import { onError } from "../library/events";
import { Command } from "../_definition/commands/Command";
import IEventCreator from "../_definition/events/IEventCreator";

export const getErrorEvent = (message: string, command: Command<any>) => {
  return onError(
    {
      error: message
    },
    command.submitterId,
    command.timestamp,
    [command.submitterId],
    command.id
  );
};

export const getEventFromCommand =
  <P>(event: IEventCreator<any>, command: Command<any>, payload: P) => {
    return event(
      payload, 
      command.submitterId, 
      command.timestamp, 
      [command.submitterId], 
      command.id
    );
  };

  export const getEventWithRecipients =
  <P>(event: IEventCreator<any>, command: Command<any>, recipients: string[], payload: P) => {
    return event(
      payload, 
      command.submitterId, 
      command.timestamp, 
      recipients, 
      command.id
    );
  };