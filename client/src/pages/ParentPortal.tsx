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

  // Ajout de la mise à jour périodique des émotions
  useEffect(() => {
    const interval = setInterval(() => {
      for (const child of children) {
        fetchChildEmotion(child.id);
      }
    }, 10000); // Mise à jour toutes les 10 secondes

    return () => clearInterval(interval);
  }, [children]);

  const fetchChildEmotion = (childId: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}/mood`)
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

  const editAppointment = (childId: number, appointment: Appointment) => {
    const appointmentToUpdate = {
      id: appointment.id,
      title: appointment.title,
      date_time: new Date(appointment.date_time).toISOString(),
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/appointments/${appointment.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentToUpdate),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${response.statusText}`,
          );
        }
        fetchChildAppointments(childId);
      })
      .catch((error) => console.error("Error updating appointment:", error));
  };

  const deleteAppointment = (childId: number, appointmentId: number) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/appointments/${appointmentId}`,
      {
        method: "DELETE",
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchChildAppointments(childId);
      })
      .catch((error) => console.error("Error deleting appointment:", error));
  };

  const handleAddTask = async (childId: number, task: Task) => {
    const taskData = {
      name: task.name, // On s'assure d'envoyer le nom
      description: task.description,
      completed: false,
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/children/${childId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData), // On envoie taskData au lieu de task
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

  const editTask = (childId: number, task: Task) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchChildTasks(childId);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const deleteTask = (childId: number, taskId: number) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/children/${childId}/tasks/${taskId}`,
      {
        method: "DELETE",
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchChildTasks(childId);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const addChild = async (child: Child) => {
    const childWithParent = {
      ...child,
      parent_id: Number(id),
    };
    fetch(`${import.meta.env.VITE_API_URL}/api/children`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(childWithParent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setChildren((prev) => [...prev, data]);
        setChildTasks((prev) => ({
          ...prev,
          [data.id]: [],
        }));
        setChildAppointments((prev) => ({
          ...prev,
          [data.id]: [],
        }));
        setChildEmotions((prev) => ({
          ...prev,
          [data.id]: { id: 0, child_id: data.id, mood: "" },
        }));
      })
      .catch((error) => console.error("Error adding child:", error));
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getMoodEmoji = (mood: string) => {
    const moods = mood.split(",");
    return moods
      .map((m) => {
        switch (m.toLowerCase().trim()) {
          case "malade":
            return "🤒";
          case "en colère":
            return "😠";
          case "triste":
            return "😢";
          case "ému":
            return "🥺";
          case "jaloux":
            return "😤";
          case "affamé":
            return "🤤";
          case "joyeux":
            return "😃";
          case "content":
            return "😊";
          case "fatigué":
            return "😴";
          case "énergique":
            return "⚡";
          default:
            return "😐";
        }
      })
      .join(" ");
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
                  <PlanningChild
                    appointments={childAppointments[child.id]}
                    onAppointmentEdit={(appointmentId, newTitle, newDate) =>
                      editAppointment(child.id, {
                        id: appointmentId,
                        title: newTitle,
                        date_time: newDate,
                        date: newDate,
                      })
                    }
                    onAppointmentDelete={(appointmentId) =>
                      deleteAppointment(child.id, appointmentId)
                    }
                  />
                )}
              </div>
              <div className="task-section">
                {childTasks[child.id] && (
                  <TaskList
                    tasks={childTasks[child.id]}
                    onTaskToggle={(taskId) =>
                      handleTaskToggle(child.id, taskId)
                    }
                    onTaskEdit={(taskId, newDescription) =>
                      editTask(child.id, {
                        id: taskId,
                        name:
                          childTasks[child.id].find((t) => t.id === taskId)
                            ?.name || "",
                        description: newDescription,
                        completed:
                          childTasks[child.id].find((t) => t.id === taskId)
                            ?.completed || false,
                      })
                    }
                    onTaskDelete={(taskId) => deleteTask(child.id, taskId)}
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
      >
        +
      </button>
      <ModalPlusButton
        parentId={Number(id)}
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
        onAddChild={addChild}
      />
    </div>
  );
}
