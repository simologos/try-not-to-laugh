import IGame from "@tntl/definition/src/game/IGame";
import { Document, Model } from "mongoose";

export interface IGameDocument extends IGame, Document {};

export interface IGameModel extends Model<IGameDocument> {};
