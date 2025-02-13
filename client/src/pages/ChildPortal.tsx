import { CalendarCheck, CheckSquare, Frown, Meh, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChildPortal.css";

interface Task {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface Activity {
  id: number;
  name: string;
  type: string;
}

interface Mood {
  id: number;
  type: "happy" | "sad" | "nervous";
  timestamp: string;
}

const ChildPortal = () => {
  const { id } = useParams();
  const [childName, setChildName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood["type"] | null>(null);

  useEffect(() => {
    // Fetch child info
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}`)
      .then((response) => response.json())
      .then((data) => setChildName(data.name));

    // Fetch tasks
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data));

    // Fetch activities
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}/activities`)
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, [id]);

  const handleTaskToggle = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
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

      if (response.ok) {
        setTasks(
          tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleMoodSelect = async (mood: Mood["type"]) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}/mood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: mood }),
      });
      setSelectedMood(mood);
    } catch (error) {
      console.error("Error updating mood:", error);
    }
  };

  return (
    <div className="child-portal-container">
      {/* Welcome Section */}
      <div className="child-portal-welcome">
        <h1>Salut {childName}! 👋</h1>
      </div>

      {/* Mood Section */}
      <div className="child-portal-section">
        <div className="child-portal-section-title">
          <h2>Comment je me sens ?</h2>
        </div>
        <div className="mood-selector">
          <button
            type="button"
            onClick={() => handleMoodSelect("happy")}
            className={`mood-button ${selectedMood === "happy" ? "selected" : ""}`}
          >
            <Smile className="w-12 h-12" />
          </button>
          <button
            type="button"
            onClick={() => handleMoodSelect("sad")}
            className={`mood-button ${selectedMood === "sad" ? "selected" : ""}`}
          >
            <Frown className="w-12 h-12" />
          </button>
          <button
            type="button"
            onClick={() => handleMoodSelect("nervous")}
            className={`mood-button ${selectedMood === "nervous" ? "selected" : ""}`}
          >
            <Meh className="w-12 h-12" />
          </button>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="child-portal-section">
        <div className="child-portal-section-title">
          <CheckSquare />
          <h2>Liste des tâches</h2>
        </div>
        <div>
          {tasks.map((task) => (
            <div key={task.id} className="task-list-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(task.id)}
                className="task-list-item-checkbox"
              />
              <span className={task.completed ? "task-completed" : ""}>
                {task.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="child-portal-section">
        <div className="child-portal-section-title">
          <CalendarCheck />
          <h2>Activités</h2>
        </div>
        <div>
          {activities.map((activity) => (
            <div key={activity.id} className="activities-list-item">
              <span className="activities-list-item-icon">
                {activity.type === "coloring" && "🎨"}
                {activity.type === "meditation" && "🧘‍♂️"}
                {activity.type === "sport" && "⚽"}
              </span>
              <span>{activity.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildPortal;
