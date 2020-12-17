import { model } from "mongoose";
import { IUserDocument } from "./types";
import schema from "./schema";
import SchemaNames from "../../_definition/schemaNames";

export const userModel = model<IUserDocument>(SchemaNames.User, schema);