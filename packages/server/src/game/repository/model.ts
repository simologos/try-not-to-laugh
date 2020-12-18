import { model } from "mongoose";
import { IGameDocument } from "./types";
import schema from "./schema";

export const gameModel = model<IGameDocument>('game', schema);
