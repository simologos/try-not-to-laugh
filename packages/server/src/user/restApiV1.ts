import { Express, Request, Response } from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import {
  use, serializeUser, deserializeUser, authenticate, initialize,
} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';
import { StatusCodes } from 'http-status-codes';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import bodyParser from 'body-parser';
import {
  cookieKey, serverSubmitterId, sessionSecret, authClientId, authClientSecret,
} from '../config';

import { getMongooseConnection } from '../mongoose';
import { getUserByGoogleId, getUserById } from './queries/user';
import { registerAddUserHandler } from './commandHandlers/addUserHandler';
import { addUser } from './commands';
import { subscribeByCommandId } from '../eventPublisher';
import { Event } from '../_definition/events/Event';
import { isType } from '../_definition/isType';
import { onUserAdded } from './events';
import { publishCommand } from '../commandPublisher';
import { isAuthenticated } from '../_middleware/authMiddleware';

use(
  new GoogleStrategy(
    {
      clientID: authClientId,
      clientSecret: authClientSecret,
      callbackURL: '/auth/google/redirect',
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
          score: 0,
        }, serverSubmitterId);

        subscribeByCommandId(command.id, (event: Event<any>) => {
          if (isType(event, onUserAdded)) {
            done(null, event.payload);
          }
        });

        publishCommand(command);
      });
    },
  ),
);

use(new CustomStrategy(
  (req, done) => {
    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '$',
      style: 'capital',
    }).split('$');

    const command = addUser({
      avatar: '',
      displayName: `${randomName[0]} ${randomName[1]}`,
      firstName: randomName[0],
      googleId: '',
      isValidated: false,
      lastName: randomName[1],
      score: 0,
    }, serverSubmitterId);

    subscribeByCommandId(command.id, (event: Event<any>) => {
      if (isType(event, onUserAdded)) {
        done(null, event.payload);
      }
    });

    publishCommand(command);
  },
));

const registerCommandHandlers = () => {
  registerAddUserHandler();
};

serializeUser((user: any, done) => {
  done(null, user.id);
});

deserializeUser((id: string, done) => {
  getUserById(id).then((user) => {
    done(null, user);
  });
});

export const registerRestEndpoints = (app: Express, socketNs: SocketIO.Namespace) => {
  const MongoStore = connectMongo(session);
  const jsonParser = bodyParser.json();

  const sessionMiddleware = session({
    store: new MongoStore({
      mongooseConnection: getMongooseConnection(),
      secret: sessionSecret,
    }),
    secret: cookieKey,
    resave: false,
    saveUninitialized: true,
  });

  app.use(initialize());
  app.use(sessionMiddleware);

  socketNs.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  app.get('/auth/google', authenticate('google', {
    scope: ['profile', 'email'],
  }));

  app.get('/auth/google/redirect', authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
    res.redirect('/');
  });

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/anonymous', authenticate('custom', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
  });

  app.get(
    '/v1/users/me',
    isAuthenticated,
    jsonParser,
    async (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');

      // @ts-ignore
      const result = await getUserById(req.session.passport.user);

      if (result.success) {
        res.status(StatusCodes.OK);
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      }

      res.end(JSON.stringify(result));
    },
  );
};

const initModule = (app: Express, socketNs: SocketIO.Namespace) => {
  registerCommandHandlers();
  registerRestEndpoints(app, socketNs);
};

export { initModule as initUserModule };
