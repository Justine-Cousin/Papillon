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

const edit: RequestHandler = async (req, res, next) => {
  try {
    const task = {
      id: Number(req.params.taskId),
      child_id: Number(req.params.childId),
      name: req.body.name,
      description: req.body.description,
      completed: req.body.completed,
    };
    const affectedRows = await taskRepository.update(task);

    if (affectedRows === 0) {
      res.status(404).send("Task not found");
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const taskId = Number(req.params.taskId);
    const affectedRows = await taskRepository.delete(taskId);

    if (affectedRows === 0) {
      res.status(404).send("Task not found");
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getTasksByChildId,
  updateTaskStatus,
  addTask,
  edit,
  destroy,
};
