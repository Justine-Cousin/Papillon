import { Pencil, Save, Trash2, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  date: string;
  title: string;
}

interface PlanningChildProps {
  appointments: Appointment[];
  onAppointmentEdit: (
    appointmentId: number,
    newTitle: string,
    newDate: string,
  ) => void;
  onAppointmentDelete: (appointmentId: number) => void;
}

const PlanningChild: React.FC<PlanningChildProps> = ({
  appointments,
  onAppointmentEdit,
  onAppointmentDelete,
}) => {
  const [editAppointmentId, setEditAppointmentId] = useState<number | null>(
    null,
  );
  const [editAppointmentTitle, setEditAppointmentTitle] = useState("");
  const [editAppointmentDate, setEditAppointmentDate] = useState("");

  useEffect(() => {
    if (editAppointmentId !== null) {
      const appointment = appointments.find(
        (appointment) => appointment.id === editAppointmentId,
      );
      if (appointment) {
        setEditAppointmentTitle(appointment.title);
        setEditAppointmentDate(appointment.date);
      }
    }
  }, [editAppointmentId, appointments]);

  const handleEditAppointment = (appointmentId: number) => {
    setEditAppointmentId(appointmentId);
  };

  const handleSaveAppointment = () => {
    if (editAppointmentId !== null) {
      onAppointmentEdit(
        editAppointmentId,
        editAppointmentTitle,
        editAppointmentDate,
      );
      setEditAppointmentId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditAppointmentId(null);
    setEditAppointmentTitle("");
    setEditAppointmentDate("");
  };

  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "";
      }
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error while formatting date:", error);
      return "";
    }
  };

  return (
    <div className="planning-container">
      <div className="planning-list">
        {appointments.map((appointment) => (
          <div className="planning-item" key={appointment.id}>
            {editAppointmentId === appointment.id ? (
              <div className="appointment-edit-form">
                <input
                  type="text"
                  value={editAppointmentTitle}
                  onChange={(e) => setEditAppointmentTitle(e.target.value)}
                  className="appointment-edit-input"
                  placeholder="Titre du rendez-vous"
                />
                <input
                  type="datetime-local"
                  value={formatDateForInput(editAppointmentDate)}
                  onChange={(e) => setEditAppointmentDate(e.target.value)}
                  className="appointment-edit-date"
                />
                <div className="appointment-edit-buttons">
                  <button
                    type="button"
                    className="appointment-save-button"
                    onClick={handleSaveAppointment}
                  >
                    <Save size={18} />
                  </button>
                  <button
                    type="button"
                    className="appointment-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="appointment-time">
                  <span className="appointment-date">
                    {new Date(appointment.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="appointment-hour">
                    {new Date(appointment.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="appointment-description">
                  <p>{appointment.title}</p>
                </div>
                <div className="appointment-buttons">
                  <button
                    type="button"
                    className="appointment-edit-button"
                    onClick={() => handleEditAppointment(appointment.id)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    className="appointment-delete-button"
                    onClick={() => onAppointmentDelete(appointment.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningChild;
