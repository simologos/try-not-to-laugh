import IVideo from '@tntl/definition/src/library/IVideo';
import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import { Command } from '../../_definition/commands/Command';
import { isValidName } from '../../_helpers/nameValidator';
import { subscribe } from '../../commandPublisher';
import { onVideoAdded } from '../events';
import { isValidUrl } from '../../_helpers/youTube';
import { libraryModel } from '../repository/model';
import { publishEvent } from '../../eventPublisher';
import { getErrorEvent, getEventFromCommand } from '../../_helpers/eventGenerator';
import { addVideo } from '../commands';

const processCommand = async (command: Command<IVideo>) => {
  if (!isValidUrl(command.payload.url)) {
    publishEvent(getErrorEvent('Invalid URL', command));

    return;
  }

  if (!isValidName(command.payload.name)) {
    publishEvent(getErrorEvent('Invalid name', command));

    return;
  }

  try {
    const newVideo = await libraryModel.create({
      addedBy: command.submitterId,
      name: command.payload.name,
      url: command.payload.url,
      start: command.payload.start,
    });

    publishEvent(getEventFromCommand<IVideo & IIdentifier>(onVideoAdded, command, {
      ...command.payload,
      id: newVideo.id,
    }));
  } catch (e) {
    publishEvent(getErrorEvent(e.message, command));
  }
};

export const registerAddVideoHandler = () => {
  subscribe(addVideo.type, processCommand);
};
