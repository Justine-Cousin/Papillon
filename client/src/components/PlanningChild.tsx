import "../styles/styleCompoParent.css";

interface Appointment {
  id: number;
  date: string;
  title: string;
}

interface PlanningChildProps {
  appointments: Appointment[];
}

const PlanningChild: React.FC<PlanningChildProps> = ({ appointments }) => {
  return (
    <div className="planning-container">
      <div className="planning-list">
        {appointments.map((appointment) => (
          <div className="planning-item" key={appointment.id}>
            <div className="appointment-time">
              <span className="appoitmen-date">
                {new Date(appointment.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                })}
              </span>
              <span className="appointment-hour">
                {new Date(appointment.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="appointment-description">
              <p>{appointment.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningChild;
