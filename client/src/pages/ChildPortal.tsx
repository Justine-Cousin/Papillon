import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import "../styles/ChildPortal.css";

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

interface Mood {
  id: number;
  child_id: number;
  mood: string;
}

const ChildPortal = () => {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [_, setCurrentMood] = useState<Mood | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const moods = [
    { name: "joyeux", emoji: "😃" },
    { name: "content", emoji: "😊" },
    { name: "triste", emoji: "😢" },
    { name: "en colère", emoji: "😠" },
    { name: "fatigué", emoji: "😴" },
    { name: "malade", emoji: "🤒" },
    { name: "affamé", emoji: "🤤" },
    { name: "énergique", emoji: "⚡" },
    { name: "jaloux", emoji: "😤" },
    { name: "ému", emoji: "🥺" },
  ];

  useEffect(() => {
    // Charger les informations de l'enfant
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}`)
      .then((response) => response.json())
      .then((data) => setChild(data));

    // Charger les tâches
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data));

    // Charger l'humeur actuelle
    fetch(`${import.meta.env.VITE_API_URL}/api/children/${id}/mood`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentMood(data);
        if (data.mood) {
          setSelectedMoods(data.mood.split(","));
        }
      });
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Mettre à jour la liste des tâches localement
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        ),
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleMoodSelection = async (mood: string) => {
    let newMoods = [...selectedMoods];

    if (selectedMoods.includes(mood)) {
      newMoods = selectedMoods.filter((m) => m !== mood);
    } else if (selectedMoods.length < 2) {
      newMoods = [...selectedMoods, mood];
    } else {
      return; // Maximum 2 émotions
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/children/${id}/mood`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mood: newMoods.join(",") }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedMood = await response.json();
      setCurrentMood(updatedMood);
      setSelectedMoods(updatedMood.mood ? updatedMood.mood.split(",") : []);
    } catch (error) {
      console.error("Error updating mood:", error);
      // Restaurer l'état précédent en cas d'erreur
      setSelectedMoods([...selectedMoods]);
    }
  };

  return (
    <div className="child-portal">
      <div className="child-portal__content">
        <h1 className="child-portal__title">
          Bonjour, {child?.name}
          <span className="child-portal__moods">
            {selectedMoods.map((mood) => (
              <span key={mood} className="child-portal__mood-emoji">
                {moods.find((m) => m.name === mood)?.emoji}
              </span>
            ))}
          </span>
        </h1>

        <div className="child-portal__mood-section">
          <h2>Comment vas-tu ?</h2>
          <div className="child-portal__mood-grid">
            {moods.map(({ name, emoji }) => (
              <button
                type="button"
                key={name}
                onClick={() => handleMoodSelection(name)}
                className={`mood-button ${selectedMoods.includes(name) ? "selected" : ""}`}
                title={name}
              >
                <span className="mood-emoji">{emoji}</span>
                <span className="mood-name">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="child-portal__tasks-section">
          <h2>Mes tâches</h2>
          <TaskList
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskEdit={() => {}}
            onTaskDelete={() => {}}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ChildPortal;
