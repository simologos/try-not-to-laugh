import { Command } from './commands/Command';
import ICommandCreator from './commands/ICommandCreator';
import { Event } from './events/Event';
import IEventCreator from './events/IEventCreator';

export function isType<P>(
  object: Event<any> | Command<any>,
  creator: IEventCreator<P> | ICommandCreator<P>,
): object is Event<P> | Command<any> {
  return object.type === creator.type;
}
