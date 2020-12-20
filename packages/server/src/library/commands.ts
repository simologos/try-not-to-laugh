import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IVideo from '@tntl/definition/src/library/IVideo';
import { commandCreator } from '../_definition/commands/commandCreator';
import ICommandCreator from '../_definition/commands/ICommandCreator';

/**
 * Command to add a new video to a users library.
 */
export const addVideo: ICommandCreator<IVideo> = commandCreator<IVideo>('ADD_VIDEO');

/**
 * Command to update an existing video in a users library.
 */
export const updateVideo: ICommandCreator<IVideo & IIdentifier> = commandCreator<IVideo & IIdentifier>('UPDATE_VIDEO');

/**
 * Command to remove an existing video from a users library.
 */
export const removeVideo: ICommandCreator<IIdentifier> = commandCreator<IIdentifier>('REMOVE_VIDEO');
