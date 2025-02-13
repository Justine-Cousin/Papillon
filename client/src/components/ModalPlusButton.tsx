import { useState } from "react";
import Timer from "./Timer";
import "../styles/ModalPlusButton.css";

interface Appointment {
  id: number;
  title: string;
  date: string;
  date_time: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface Child {
  id: number;
  name: string;
  parent_id: number;
}

interface ModalPlusButtonProps {
  parentId: number;
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onAddTask: (task: Task) => void;
  onAddChild: (child: Child) => void;
}

const ModalPlusButton: React.FC<ModalPlusButtonProps> = ({
  parentId,
  isOpen,
  onClose,
  onAddAppointment,
  onAddTask,
  onAddChild,
}) => {
  if (!isOpen) return null;
  const [selectedOption, setSelectedOption] = useState<
    "menu" | "timer" | "addAppointment" | "addTask"
  >("menu");
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [childName, setChildName] = useState("");

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      id: 0,
      title: appointmentTitle,
      date: appointmentDate,
      date_time: appointmentDate,
    });
    setAppointmentTitle("");
    setAppointmentDate("");
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      id: 0,
      name: taskName,
      description: taskDescription,
      completed: false,
    });
    setTaskName("");
    setTaskDescription("");
    onClose();
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChild({
      id: 0,
      name: childName,
      parent_id: parentId, // Replace 0 with the actual parent ID if available
    });
    setChildName("");
    onClose();
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "menu":
        return (
          <div className="modal-menu">
            <div className="modal-section">
              <h2>Ajouter un rendez-vous</h2>
              <form onSubmit={handleAppointmentSubmit}>
                <input
                  type="text"
                  placeholder="Titre du rendez-vous"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                  required
                />
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
                <button type="submit">Ajouter le rendez-vous</button>
              </form>
            </div>

            <div className="modal-section">
              <h2>Ajouter une tâche</h2>
              <form onSubmit={handleTaskSubmit}>
                <input
                  type="text"
                  placeholder="Nom de la tâche"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description de la tâche"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                />
                <button type="submit">Ajouter la tâche</button>
              </form>
            </div>

            <div className="modal-section">
              <h2>Un nouveau papillon rejoint le cocon</h2>
              <form onSubmit={handleChildSubmit}>
                <input
                  type="text"
                  placeholder="Prénom de l'enfant"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                />
                <button type="submit">Ajouter l'enfant</button>
              </form>
            </div>

            <div className="modal-section">
              <button type="button" onClick={() => setSelectedOption("timer")}>
                Ouvrir le timer
              </button>
            </div>
          </div>
        );

      case "timer":
        return (
          <div className="timer-wrapper">
            <button
              type="button"
              onClick={() => setSelectedOption("menu")}
              className="back-button"
            >
              Retour
            </button>
            <Timer />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ModalPlusButton;
