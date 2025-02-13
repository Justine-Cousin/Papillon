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

interface ModalPlusButtonProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
  onAddTask: (task: Task) => void;
}

const ModalPlusButton: React.FC<ModalPlusButtonProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
  onAddTask,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    "menu" | "timer" | "addAppointment" | "addTask"
  >("menu");

  const handleBackToMenu = () => {
    setSelectedOption("menu");
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "menu":
        return (
          <div className="modal-buttons">
            <button
              type="button"
              onClick={() => setSelectedOption("addAppointment")}
            >
              Ajouter un rendez-vous
            </button>
            <button type="button" onClick={() => setSelectedOption("addTask")}>
              Ajouter une tâche
            </button>
            <button type="button" onClick={() => setSelectedOption("timer")}>
              Ouvrir le timer
            </button>
          </div>
        );

      case "timer":
        return (
          <div className="timer-wrapper">
            <button
              type="button"
              className="back-button"
              onClick={handleBackToMenu}
            >
              Retour au menu
            </button>
            <Timer />
          </div>
        );

      case "addAppointment":
        return (
          <div className="add-form">
            <button
              type="button"
              className="back-button"
              onClick={handleBackToMenu}
            >
              Retour au menu
            </button>
            <h2>Ajouter un rendez-vous</h2>
            <button
              type="button"
              onClick={() =>
                onAddAppointment({ id: 0, title: "", date: "", date_time: "" })
              }
            >
              Créer un rendez-vous
            </button>
          </div>
        );

      case "addTask":
        return (
          <div className="add-form">
            <button
              type="button"
              className="back-button"
              onClick={handleBackToMenu}
            >
              Retour au menu
            </button>
            <h2>Ajouter une tâche</h2>
            <button
              type="button"
              onClick={() =>
                onAddTask({
                  id: 0,
                  name: "",
                  description: "",
                  completed: false,
                })
              }
            >
              Créer une tâche
            </button>
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
