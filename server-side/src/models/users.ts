import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  fullname: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  ssoId?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  ssoId: {
    type: String,
  }
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;