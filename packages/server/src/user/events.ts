import IIdentifier from '@tntl/definition/src/generic/IIdentifier';
import IUser from '@tntl/definition/src/user/IUser';
import { eventCreator } from '../_definition/events/eventCreator';
import IEventCreator from '../_definition/events/IEventCreator';

export const onUserAdded: IEventCreator<IUser & IIdentifier> = eventCreator<IUser & IIdentifier>('ON_USER_ADDED');
