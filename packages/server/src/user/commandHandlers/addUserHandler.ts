import IUser from '@tntl/definition/src/user/IUser';
import { Command } from '../../_definition/commands/Command';
import { subscribe } from '../../commandPublisher';
import { onUserAdded } from '../events';
import { userModel } from '../repository/model';
import { publishEvent } from '../../eventPublisher';
import { getErrorEvent, getEventFromCommand } from '../../_helpers/eventGenerator';
import { addUser } from '../commands';

const processCommand = async (command: Command<IUser>) => {
  try {
    const newUser = await userModel.create({
      avatar: command.payload.avatar,
      displayName: command.payload.displayName,
      firstName: command.payload.firstName,
      googleId: command.payload.googleId,
      lastName: command.payload.lastName,
      isValidated: command.payload.isValidated,
      score: command.payload.score,
    });

    publishEvent(getEventFromCommand(onUserAdded, command, {
      ...command.payload,
      id: newUser.id,
    }));
  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerAddUserHandler = () => {
  subscribe(addUser.type, processCommand);
};
