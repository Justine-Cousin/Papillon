import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalPlusButton from "../components/ModalPlusButton";
import PlanningChild from "../components/PlanningChild";
import TaskList from "../components/TaskList";
import "../styles/ParentPortal.css";

interface Parent {
  id: number;
  name: string;
  email: string;
}

interface Child {
  id: number;
  name: string;
  parent_id: number;
}

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface Appointment {
  id: number;
  title: string;
  date: string;
  date_time: string;
}

interface Emotion {
  id: number;
  child_id: number;
  mood: string;
}

export default function ParentPortal() {
  const { id } = useParams();
  const [parent, setParent] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [childTasks, setChildTasks] = useState<{ [key: number]: Task[] }>({});
  const [childAppointments, setChildAppointments] = useState<{
    [key: number]: Appointment[];
  }>({});
  const [childEmotions, setChildEmotions] = useState<{
    [key: number]: Emotion;
  }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
      .then((response) => response.json())
      .then((data) => setParent(data));

    fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/children`)
      .then((response) => response.json())
      .then((data) => {
        setChildren(data);

        for (const child of data) {
          fetchChildTasks(child.id);
          fetchChildAppointments(child.id);
          fetchChildEmotion(child.id);
        }
      });
  }, [id]);

  const fetchChildEmotion = (childId: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}/emotion`)
      .then((response) => response.json())
      .then((data) => {
        setChildEmotions((prev) => ({
          ...prev,
          [childId]: data,
        }));
      });
  };

  const fetchChildTasks = (childId: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        setChildTasks((prev) => ({
          ...prev,
          [childId]: data,
        }));
      });
  };

  const fetchChildAppointments = (childId: number) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/appointments`,
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedAppointments = data.map((apt: Appointment) => ({
          ...apt,
          date: apt.date_time,
        }));
        setChildAppointments((prev) => ({
          ...prev,
          [childId]: formattedAppointments,
        }));
      });
  };

  const handleTaskToggle = async (childId: number, taskId: number) => {
    const task = childTasks[childId]?.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !task.completed }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      fetchChildTasks(childId);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddAppointment = (childId: number, appointment: Appointment) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchChildAppointments(childId);
      })
      .catch((error) => console.error("Error adding appointment:", error));

    setIsModalOpen(false);
  };

  const handleAddTask = async (childId: number, task: Task) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchChildTasks(childId);
      })
      .catch((error) => console.error("Error adding task:", error));

    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "content":
        return "😊";
      case "fatigué":
        return "😴";
      case "énergique":
        return "⚡";
      default:
        return "😐";
    }
  };

  return (
    <div className="parent-portal-container">
      <h1 className="parent-portal-title">Bonjour, {parent?.name}</h1>
      <p className="parent-portal-instruction">
        Cliquez sur le tableau de bord d'un enfant pour le sélectionner
      </p>

      <div className="parent-portal-child-boards">
        {children.map((child: Child) => (
          <div
            key={child.id}
            className={`parent-portal-child-board ${selectedChildId === child.id ? "selected" : ""}`}
            onClick={() => setSelectedChildId(child.id)}
            onKeyUp={(e) => e.key === "Enter" && setSelectedChildId(child.id)}
            onKeyDown={(e) => e.key === " " && setSelectedChildId(child.id)}
          >
            <h2 className="parent-portal-child-board-title">
              Tableau de bord de {child.name}
              {childEmotions[child.id] && (
                <span
                  className="child-mood"
                  title={childEmotions[child.id].mood}
                >
                  {getMoodEmoji(childEmotions[child.id].mood)}
                </span>
              )}
            </h2>
            <div className="parent-portal-child-board-info">
              <div className="parent-portal-child-planning">
                <h3>Planning</h3>
                {childAppointments[child.id] && (
                  <PlanningChild appointments={childAppointments[child.id]} />
                )}
              </div>
              <div className="task-section">
                {childTasks[child.id] && (
                  <TaskList
                    tasks={childTasks[child.id]}
                    onTaskToggle={(taskId: number) =>
                      handleTaskToggle(child.id, taskId)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="parent-portal-add-button"
        onClick={handleOpenModal}
        disabled={!selectedChildId}
      >
        +
      </button>
      <ModalPlusButton
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAppointment={(appointment: Appointment) =>
          selectedChildId
            ? handleAddAppointment(selectedChildId, appointment)
            : null
        }
        onAddTask={(task: Task) =>
          selectedChildId ? handleAddTask(selectedChildId, task) : null
        }
      />
    </div>
  );
}
