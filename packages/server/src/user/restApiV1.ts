import { Express } from "express";
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { cookieKey, serverSubmitterId, sessionSecret } from "../config";
import { use, serializeUser, deserializeUser, authenticate, initialize } from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { authClientId, authClientSecret } from "../config";
import IUser from "@tntl/definition/src/user/IUser";
import IIdentifier from "@tntl/definition/src/generic/IIdentifier";
import { getMongooseConnection } from "../mongoose";
import { getUserByGoogleId, getUserById } from "./queries/user";
import { registerAddUserHandler } from "./commandHandlers/addUserHandler";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { addUser } from "./commands";
import { subscribeByCommandId } from "../eventPublisher";
import { Event } from "../_definition/events/Event";
import { isType } from "../_definition/isType";
import { onUserAdded } from "./events";
import { publishCommand } from "../commandPublisher";

use(
  new GoogleStrategy(
    {
      clientID: authClientId,
      clientSecret: authClientSecret,
      callbackURL: "/auth/google/redirect"
    },
    (_accessToken, _refreshToken, profile, done) => {

      getUserByGoogleId(profile.id).then((currentUser) => {

        if (currentUser) {
          done(null, currentUser);
          return;
        }

        const command = addUser({
          avatar: profile.photos[0].value,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          googleId: profile.id,
          lastName: profile.name.familyName,
          isValidated: true,
          score: 0
        }, serverSubmitterId);

        subscribeByCommandId(command.id, (event: Event<any>) => {

          if (isType(event, onUserAdded)) {
            done(null, event.payload);
          }
        });

        publishCommand(command);
      })
    })
);

use(new CustomStrategy(
  (req, done) => {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: ' ',
      style: 'capital'
    });

    const command = addUser({
      avatar: '',
      displayName: randomName,
      firstName: '',
      googleId: '',
      isValidated: false,
      lastName: '',
      score: 0
    }, serverSubmitterId);

    subscribeByCommandId(command.id, (event: Event<any>) => {

      if (isType(event, onUserAdded)) {
        done(null, event.payload);
      }
    });

    publishCommand(command);   
  }
));

const registerCommandHandlers = () => {
  registerAddUserHandler();
};

serializeUser((user: any, done) => {
  done(null, user.id);
});

deserializeUser((id: string, done) => {

  getUserById(id).then(user => {
    done(null, user);
  });
});

export const registerRestEndpoints = (app: Express, socketNs: SocketIO.Namespace) => {

  const MongoStore = connectMongo(session);

  const sessionMiddleware = session({
    store: new MongoStore({
      mongooseConnection: getMongooseConnection(),
      secret: sessionSecret
    }),
    secret: cookieKey,
    resave: false,
    saveUninitialized: true
  });

  app.use(initialize());
  app.use(sessionMiddleware);

  socketNs.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  app.get("/auth/google", authenticate("google", {
    scope: ["profile", "email"]
  }));

  app.get("/auth/google/redirect", authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
    res.redirect('/');
  });

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/anonymous', authenticate('custom', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
  });
};

const initModule = (app: Express, socketNs: SocketIO.Namespace) => {
  registerCommandHandlers();
  registerRestEndpoints(app, socketNs);
};

export { initModule as initUserModule };