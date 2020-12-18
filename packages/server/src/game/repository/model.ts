import { model } from "mongoose";
import { IGameDocument } from "./types";
import schema from "./schema";
import SchemaNames from "@tntl/server/src/_definition/schemaNames";

export const gameModel = model<IGameDocument>(SchemaNames.Game, schema);
