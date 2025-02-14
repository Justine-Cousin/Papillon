import { Pencil, Save, Trash2, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
  onTaskEdit: (taskId: number, newDescription: string) => void;
  onTaskDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
}) => {
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskDescription, setEditTaskDescription] = useState("");

  useEffect(() => {
    if (editTaskId !== null) {
      const task = tasks.find((task) => task.id === editTaskId);
      if (task) {
        setEditTaskDescription(task.description);
      }
    }
  }, [editTaskId, tasks]);

  const handleEditTask = (taskId: number) => {
    setEditTaskId(taskId);
  };

  const handleSaveTask = () => {
    if (editTaskId !== null) {
      onTaskEdit(editTaskId, editTaskDescription);
      setEditTaskId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTaskDescription("");
  };

  return (
    <div className="task-list-container">
      <h3>Les tâches</h3>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onTaskToggle(task.id)}
          />
          {editTaskId === task.id ? (
            <div className="task-edit-form">
              <input
                type="text"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                className="task-edit-input"
              />
              <div className="task-edit-buttons">
                <button
                  type="button"
                  className="task-save-button"
                  onClick={handleSaveTask}
                >
                  <Save size={18} />
                </button>
                <button
                  type="button"
                  className="task-cancel-button"
                  onClick={handleCancelEdit}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span>{task.description}</span>
              <div className="task-buttons">
                <button
                  type="button"
                  className="task-edit-button"
                  onClick={() => handleEditTask(task.id)}
                >
                  <Pencil size={18} />
                </button>
                <button
                  type="button"
                  className="task-delete-button"
                  onClick={() => onTaskDelete(task.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
