import { model } from "mongoose";
import { IUserDocument } from "./types";
import schema from "./schema";
import SchemaNames from "@tntl/server/src/_definition/schemaNames";

export const userModel = model<IUserDocument>(SchemaNames.User, schema);