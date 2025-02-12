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
}

export default new TaskRepository();
