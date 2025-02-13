import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

class UserRepository {
  async add(name: string, email: string, password_hash: string) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash],
    );
    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    return rows[0] as User | undefined;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }
}

export default new UserRepository();
