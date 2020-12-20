import { Command } from './_definition/commands/Command';

const subscribers: { [key: string]: ((command: Command<any>) => void)[] } = {};

export const publishCommand = (command: Command<any>) => {
  setTimeout(() => {
    (subscribers[command.type] || []).forEach((callback) => callback(command));
  }, 0);
};

export const subscribe = (command: string, callback: (action: Command<any>) => void) => {
  if (!Array.isArray(subscribers[command])) {
    subscribers[command] = [];
  }

  subscribers[command].push(callback);
  const index = subscribers[command].length - 1;

  return {
    unsubscribe() {
      subscribers[command].splice(index, 1);
    },
  };
};
