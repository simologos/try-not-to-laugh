import { Schema, Types } from "mongoose";

const schema = new Schema({
  addedBy: { type: Types.ObjectId, required: true, ref: 'user' },
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: true });

export default schema;
