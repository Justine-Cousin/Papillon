import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface Child {
  id: number;
  name: string;
  parent_id: number;
}

class ChildRepository {
  async readByParentId(parentId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM children WHERE parent_id = ?",
      [parentId],
    );
    return rows as Child[];
  }

  async read(childId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM children WHERE id = ?",
      [childId],
    );
    return rows[0] as Child | undefined;
  }
}

export default new ChildRepository();
