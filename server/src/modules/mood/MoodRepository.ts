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
}

export default new MoodRepository();
