import { model } from "mongoose";
import { ILibraryDocument } from "./types";
import schema from "./schema";

export const libraryModel = model<ILibraryDocument>('library', schema);