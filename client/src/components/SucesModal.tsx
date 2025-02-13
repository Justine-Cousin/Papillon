// SuccessModal.tsx
import { useEffect } from "react";
import "../styles/SuccessModal.css";

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({
  show,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="success-modal-overlay"
      onClick={onClose}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      <div
        className="success-modal-container"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
      >
        <div className="success-modal-icon">
          <svg viewBox="0 0 24 24">
            <title>Success Icon</title>
            <path d="M20 6L9 17L4 12" />
          </svg>
        </div>
        <h2 className="success-modal-title">{title}</h2>
        <p className="success-modal-message">{message}</p>
        <button
          type="button"
          className="success-modal-button"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
