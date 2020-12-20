import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import { subscribe } from '../eventPublisher';
import { Event } from '../_definition/events/Event';

let io: socket.Server;
let ns: socket.Namespace;

export const getNamespace = () => ns;

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

      socket.on('disconnect', () => {
        console.log('Got disconnect!');

        unsubscribe();
      });
    } catch (e) {
      socket.emit('event', e);
    }
  });
};
