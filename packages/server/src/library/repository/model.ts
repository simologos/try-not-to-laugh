import { model } from "mongoose";
import { ILibraryDocument } from "./types";
import schema from "./schema";
import SchemaNames from "@tntl/server/src/_definition/schemaNames";

export const libraryModel = model<ILibraryDocument>(SchemaNames.Library, schema);