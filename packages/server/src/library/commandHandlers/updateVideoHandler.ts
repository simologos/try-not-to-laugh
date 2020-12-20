import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IVideo from '@tntl/definition/src/library/IVideo';
import { publishEvent } from '../../eventPublisher';
import { getErrorEvent, getEventFromCommand } from '../../_helpers/eventGenerator';
import { Command } from '../../_definition/commands/Command';
import { subscribe } from '../../commandPublisher';
import { updateVideo } from '../commands';
import { onVideoUpdated } from '../events';
import { libraryModel } from '../repository/model';

const processCommand = async (command: Command<IVideo & IIdentifier>) => {
  const { id } = command.payload;

  try {
    await libraryModel.findByIdAndUpdate({ id }, {
      name: command.payload.name,
      url: command.payload.url,
    }).exec();

    publishEvent(getEventFromCommand(onVideoUpdated, command, command.payload));
  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerUpdateVideoHandler = () => {
  subscribe(updateVideo.type, processCommand);
};
