import { UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChildSelector.css";

interface ChildSelectorProps {
  isActive: boolean;
  userId: string;
}
const ChildSelector: React.FC<ChildSelectorProps> = ({ isActive, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}/children`)
        .then((response) => response.json())
        .then((data) => setChildren(data))
        .catch((error) => console.error("Error fetching children:", error));
    }
  }, [userId]);

  interface Child {
    id: string;
    name: string;
  }

  const handleChildSelect = (childId: string): void => {
    navigate(`/children/${childId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`navbar-link ${isActive ? "active" : ""}`}
      >
        <UserRound className="navbar-icon" />
      </button>

      {isOpen && children.length > 0 && (
        <div className="child-selector-dropdown">
          {children.map((child) => (
            <button
              type="button"
              key={child.id}
              onClick={() => handleChildSelect(child.id)}
              className="child-selector-item"
            >
              {child.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildSelector;
