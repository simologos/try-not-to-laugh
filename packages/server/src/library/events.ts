import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IVideo from '@tntl/definition/src/library/IVideo';
import IError from '@tntl/definition/src/generic/IError';
import { eventCreator } from '../_definition/events/eventCreator';
import IEventCreator from '../_definition/events/IEventCreator';

/**
 * Event which informs about the creation of a new video.
 */
export const onVideoAdded: IEventCreator<IVideo & IIdentifier> = eventCreator<IVideo & IIdentifier>('ON_VIDEO_ADDED');

export const onVideoUpdated: IEventCreator<IVideo & IIdentifier> = eventCreator<IVideo & IIdentifier>('ON_VIDEO_UPDATED');

export const onVideoDeleted: IEventCreator<IIdentifier> = eventCreator<IIdentifier>('ON_VIDEO_DELETED');

export const onError: IEventCreator<IError> = eventCreator<IError>('ON_ERROR');
