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

  async create(childId: number, appointment: Appointment) {
    const { title, date_time } = appointment;
    await databaseClient.query<Result>(
      "INSERT INTO appointments (child_id, title, date_time) VALUES (?, ?, ?)",
      [childId, title, date_time],
    );
  }

  async update(appointment: Appointment) {
    try {
      // Convertir la date ISO en format MySQL datetime
      const mysqlDateTime = new Date(appointment.date_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const [result] = await databaseClient.query<Result>(
        "UPDATE appointments SET title = ?, date_time = ? WHERE id = ?",
        [appointment.title, mysqlDateTime, appointment.id],
      );

      return result.affectedRows;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  async delete(appointmentId: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM appointments WHERE id = ?",
      [appointmentId],
    );
    return result.affectedRows;
  }
}

export default new AppointmentRepository();
