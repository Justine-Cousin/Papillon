import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface Mood {
  id: number;
  child_id: number;
  mood: string;
}

class MoodRepository {
  async findByChildId(childId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM emotions WHERE child_id = ? ORDER BY id DESC LIMIT 1",
      [childId],
    );
    return rows[0] || null;
  }

  async update({ child_id, mood }: Omit<Mood, "id">) {
    try {
      const existingMood = await this.findByChildId(child_id);

      if (existingMood) {
        const [result] = await databaseClient.query<Result>(
          "UPDATE emotions SET mood = ? WHERE child_id = ?",
          [mood, child_id],
        );

        return result.affectedRows;
      }

      const [result] = await databaseClient.query<Result>(
        "INSERT INTO emotions (child_id, mood) VALUES (?, ?)",
        [child_id, mood],
      );

      return result.insertId;
    } catch (error) {
      console.error("Error in MoodRepository.update:", error);
      throw error;
    }
  }
}

export default new MoodRepository();
