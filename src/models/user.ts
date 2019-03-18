import { Document, model, Schema } from "mongoose";
import { isEmail } from "validator";
export interface UserType extends Document {
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Invalid Email"]
  },
  phone: {
    type: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = model<UserType>("User", userSchema);
export default User;
