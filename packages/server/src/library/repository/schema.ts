import { Schema, Types } from "mongoose";
import SchemaNames from "@tntl/server/src/_definition/schemaNames";

const schema = new Schema({
  addedBy: { type: Types.ObjectId, required: true, ref: SchemaNames.User },
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: true });

export default schema;
