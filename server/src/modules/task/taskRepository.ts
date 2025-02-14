import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface Task {
  id: number;
  child_id: number;
  description: string;
  completed: boolean;
}

class TaskRepository {
  async getTasksByChildId(childId: number) {
    try {
      const [rows] = await databaseClient.query<Rows>(
        "SELECT * FROM tasks WHERE child_id = ?",
        [childId],
      );
      return rows as Task[];
    } catch (error) {
      console.error(
        "An error occurred while getting tasks by child ID: ",
        error,
      );
      return [];
    }
  }

  async updateTaskStatus(taskId: number, completed: boolean) {
    try {
      const [result] = await databaseClient.query<Result>(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        [completed, taskId],
      );

      if (result.affectedRows === 0) {
        throw new Error(`Task with id ${taskId} not found`);
      }

      return true;
    } catch (error) {
      console.error("An error occurred while updating task status: ", error);
      throw error;
    }
  }

  async create(childId: number, task: Task) {
    const { description, completed } = task;
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO tasks (child_id, description, completed) VALUES (?, ?, ?)",
      [childId, description, completed],
    );
  }

  async update(task: Task) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE tasks SET description = ? WHERE id = ?",
      [task.description, task.id],
    );
    return result.affectedRows;
  }

  async delete(taskId: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM tasks WHERE id = ?",
      [taskId],
    );
    return result.affectedRows;
  }
}

export default new TaskRepository();
