import { Event } from './_definition/events/Event';

const subscribers: { [key: string]: [string, ((event: Event<any>) => void)][]} = {};
const oneTimeSubscriptions: {[key: string]: ((event: Event<any>) => void)[]} = {};

export const publishEvent = (event: Event<any>) => {
  event.recipients.forEach(((r) => {
    if (!subscribers[r]) {
      return;
    }

    subscribers[r].forEach((s) => {
      s[1](event);
    });
  }));

  if (oneTimeSubscriptions[event.id]) {
    oneTimeSubscriptions[event.id].forEach((e) => {
      e(event);
    });

    delete oneTimeSubscriptions[event.id];
  }
};

export const subscribe = (userId: string, sessionId: string, callback: (event: Event<any>) => void): () => void => {
  if (!Array.isArray(subscribers[userId])) {
    subscribers[userId] = [];
  }

  subscribers[userId].push([sessionId, callback]);

  const index = subscribers[userId].length - 1;

  return () => {
    subscribers[userId].splice(index, 1);

    if (!subscribers[userId].length) {
      delete subscribers[userId];
    }
  };
};

export const subscribeByCommandId = (id: string, callback: (event: Event<any>) => void): void => {
  if (!Array.isArray(oneTimeSubscriptions[id])) {
    oneTimeSubscriptions[id] = [];
  }

  oneTimeSubscriptions[id].push(callback);
};
