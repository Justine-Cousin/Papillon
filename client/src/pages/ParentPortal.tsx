import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ParentPortal.css";

interface Parent {
  id: number;
  name: string;
  email: string;
}

export default function ParentPortal() {
  const { id } = useParams();
  const [parent, setParent] = useState<Parent | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
      .then((response) => response.json())
      .then((data) => setParent(data));
  }, [id]);

  return (
    <div className="parent-portal-container">
      <h1 className="parent-portal-title">Bonjour, {parent?.name}</h1>

      <div className="parent-portal-child-board">
        <h2 className="parent-portal-child-board-title">Tableau de bord de</h2>
        <div className="parent-portal-child-board-info">
          <div className="parent-portal-child-planning">
            <h3>Planning</h3>
          </div>
          <div className="task-section">
            <div className="parent-portal-child-board-info-item">
              <h3>Messages</h3>
              <p>2</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="parent-portal-add-button">
        +
      </button>
    </div>
  );
}
