import { Schema } from 'mongoose';

const schema = new Schema({
  displayName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String, required: false },
  googleId: { type: String, required: false },
  isValidated: { type: Boolean, required: true },
  score: { type: Number, required: true },
  // expireAt: {type: Date, required: true }
}, { _id: true });

// schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export default schema;
