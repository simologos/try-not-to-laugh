import { model } from 'mongoose';
import { IUserDocument } from './types';
import schema from './schema';

export const userModel = model<IUserDocument>('user', schema);
