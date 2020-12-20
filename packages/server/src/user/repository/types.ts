import { Document, Model } from 'mongoose';
import IUser from '@tntl/definition/src/user/IUser';

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
