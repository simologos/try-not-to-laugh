import { Schema, Types } from "mongoose";
import SchemaNames from "../../_definition/schemaNames";

const checkpoint = new Schema({
  userId: { type: Types.ObjectId, required: true, ref: SchemaNames.User },
  state: { type: Number, required: true },
  laughed: { type: Boolean, required: true }
}, { _id: true });

const playList = new Schema({
  addedBy: { type: Types.ObjectId, required: true, ref: SchemaNames.User },
  name: { type: String, required: true },
  url: { type: String, required: true },
  start: { type: Number, required: true },
  createdAt: { type: Number, required: true },
  checkpoints: [checkpoint]
}, { _id: true });

const chatList = new Schema({
  sender: { type: Types.ObjectId, required: true, ref: SchemaNames.User },
  message: { type: String, required: true },
  createdAt: { type: Number, required: true },
}, { _id: true });

const schema = new Schema({
  state: { type: Number, required: true },
  players: [{ type: Types.ObjectId, ref: SchemaNames.User }],
  chat: [chatList],
  playlist: [playList],
  currentRound: { type: Number, required: true }
}, { _id: true });

export default schema;
