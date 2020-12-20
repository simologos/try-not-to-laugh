import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IChatMessage from '@tntl/definition/src/game/IChatMessage';
import IChatMessageBase from '@tntl/definition/src/game/IChatMessageBase';
import { Command } from '../../_definition/commands/Command';
import { subscribe } from '../../commandPublisher';
import { onChatMessageSent } from '../events';
import { publishEvent } from '../../eventPublisher';
import { getErrorEvent, getEventFromCommand, getEventWithRecipients } from '../../_helpers/eventGenerator';
import { sendChatMessage } from '../commands';
import { gameModel } from '../repository/model';

const processCommand = async (command: Command<IChatMessageBase & IIdentifier>) => {
  try {
    const game = await gameModel.findById(command.payload.id).exec();

    if (game === null) {
      publishEvent(getErrorEvent('Game not found.', command));
      return;
    }

    const createdAt = new Date().getTime();

    game.chat.push({
      createdAt,
      message: command.payload.message,
      sender: command.submitterId,
    });

    await game.save();

    publishEvent(getEventWithRecipients<IChatMessage & IIdentifier>(onChatMessageSent, command, game.players, {
      createdAt,
      message: command.payload.message,
      sender: command.submitterId,
      id: command.payload.id,
    }));
  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerSendChatMessageHandler = () => {
  subscribe(sendChatMessage.type, processCommand);
};
