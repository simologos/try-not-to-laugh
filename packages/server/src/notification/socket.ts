import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import { subscribe } from '../eventPublisher';
import { Event } from '../_definition/events/Event';

let io: socket.Server;
let ns: socket.Namespace;

export const getNamespace = () => {
  return ns;
};

export const startNotificationServer = (server: Server) => {

  io = socket(server);

  ns = io.of('/notification');

  ns.on('connection', (socket: Socket) => {

    try {
      const userId = socket.request.session.passport.user;
      const sessionId = socket.id;

      const unsubscribe = subscribe(userId, sessionId, (event: Event<any>) => {
        socket.emit('event', event);
      });

      socket.on('disconnect', function () {
        console.log('Got disconnect!');

        unsubscribe();
      });

    } catch (e) {
      socket.emit('event', e);
    }
  });
};
