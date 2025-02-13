import "../styles/styleCompoParent.css";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskToggle }) => {
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
          <span>{task.description}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
