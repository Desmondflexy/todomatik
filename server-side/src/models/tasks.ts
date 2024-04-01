import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  name: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user: string;
}

const taskSchema = new mongoose.Schema<ITask>({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  }
},
{timestamps: true});

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;