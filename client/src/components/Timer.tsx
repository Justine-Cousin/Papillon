import { useEffect, useState } from "react";
import "../styles/Timer.css";

const Timer: React.FC = () => {
  const [duration, setDuration] = useState(25 * 60); // 25 minutes par défaut
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Vous pouvez ajouter ici une notification ou un son de fin de compte à rebours
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsSettingTime(false);
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsSettingTime(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsSettingTime(true);
  };

  return (
    <div className="timer-container">
      <h3 className="timer-title">Compte à rebours</h3>
      <div className="timer-display">{formatTime(timeLeft)}</div>

      {isSettingTime ? (
        <div className="timer-preset-buttons">
          <button
            type="button"
            className="timer-button"
            onClick={() => handleTimeChange(25)}
          >
            25 min
          </button>
          <button
            type="button"
            className="timer-button"
            onClick={() => handleTimeChange(15)}
          >
            15 min
          </button>
          <button
            type="button"
            className="timer-button"
            onClick={() => handleTimeChange(5)}
          >
            5 min
          </button>
        </div>
      ) : (
        <div className="timer-controls">
          {!isRunning ? (
            <button type="button" className="timer-button" onClick={startTimer}>
              Démarrer
            </button>
          ) : (
            <button type="button" className="timer-button" onClick={pauseTimer}>
              Pause
            </button>
          )}
          <button type="button" className="timer-button" onClick={stopTimer}>
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;
