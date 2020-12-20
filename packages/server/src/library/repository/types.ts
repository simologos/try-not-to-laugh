import IVideo from '@tntl/definition/src/library/IVideo';
import IOwnership from '@tntl/definition/src/generic/IOwnership';
import { Document, Model } from 'mongoose';

export interface ILibraryDocument extends IVideo, IOwnership, Document {}

export interface ILibraryModel extends Model<ILibraryDocument> {}
