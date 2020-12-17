import { model } from "mongoose";
import { ILibraryDocument } from "./types";
import schema from "./schema";
import SchemaNames from "../../_definition/schemaNames";

export const libraryModel = model<ILibraryDocument>(SchemaNames.Library, schema);