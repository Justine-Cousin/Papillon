import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export interface Appointment {
  id: number;
  child_id: number;
  title: string;
  date_time: string;
}

class AppointmentRepository {
  async getAppointmentsByChildId(childId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM appointments WHERE child_id = ? ORDER BY date_time ASC",
      [childId],
    );
    return rows as Appointment[];
  }
}

export default new AppointmentRepository();
