import { Request, Response } from "express";
import Task from "../models/tasks";
import * as v from '../validators';

export async function create(req: Request, res: Response) {
  try {
    const user = req.user;
    const result = v.taskValidator.validate(req.body, v.validationOptions);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let input = result.value;
    input = { ...input, user: user.id };
    // create new task
    const task = new Task(input);
    task.save();
    res.json({ message: "new task created", task });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}
export async function getAll(req: Request, res: Response) {
  const user = req.user;
  try {
    const tasks = await Task.find({ user: user.id }).sort({createdAt: -1});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getOne(req: Request, res: Response) {
  const user = req.user;
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOne({ _id: taskId, user: user.id });
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}
export async function update(req: Request, res: Response) {
  const user = req.user;
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOne({ _id: taskId, user: user.id });
    if (!task) return res.status(404).send("Task not found");

    const result = v.taskValidator.validate(req.body, v.validationOptions);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let updates = result.value;
    Object.assign(task, updates);
    task.save();
    res.json({ message: "Task updated", task });
  } catch (error) {

  }
}
export async function remove(req: Request, res: Response) {
  const user = req.user;
  const taskId = req.params.taskId;
  try {
    const task = await Task.findOne({ _id: taskId, user: user.id });
    if (!task) return res.status(404).send("Task not found");

    task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}