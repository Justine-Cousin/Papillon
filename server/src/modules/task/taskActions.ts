import type { RequestHandler } from "express";
import taskRepository from "./taskRepository";

const getTasksByChildId: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    if (Number.isNaN(childId)) {
      res.status(400).send("Invalid child ID");
      return;
    }

    const tasks = await taskRepository.getTasksByChildId(childId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus: RequestHandler = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const { completed } = req.body;

    if (Number.isNaN(taskId)) {
      res.status(400).send("Invalid task ID");
      return;
    }

    if (typeof completed !== "boolean") {
      res.status(400).send("Status must be a boolean");
      return;
    }

    await taskRepository.updateTaskStatus(taskId, completed);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    next(error);
  }
};

const addTask: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    const task = req.body;
    const result = await taskRepository.create(childId, task);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getTasksByChildId,
  updateTaskStatus,
  addTask,
};
