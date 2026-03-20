import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function SchedulePage() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, [routeId]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get(`/schedules/route/${routeId}`);
      setSchedules(response.data);
    } catch (err) {
      setError("Failed to load schedules.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleBookNow = (scheduleId) => {
    navigate(`/booking/${scheduleId}`);
  };

  return (
    <div className="page-container">
      <button className="secondary-btn" onClick={handleBack}>
        ← Back to Routes
      </button>

      <h1 className="title">Available Schedules</h1>
      <p className="subtitle">Choose a bus schedule for your selected route</p>

      {loading && <p>Loading schedules...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && schedules.length === 0 && (
        <p className="empty-text">No schedules found for this route.</p>
      )}

      <div className="schedule-list">
        {schedules.map((schedule) => (
          <div className="schedule-card" key={schedule.id}>
            <h3>Bus Number: {schedule.busNumber}</h3>
            <p>
              <strong>Date:</strong> {schedule.travelDate}
            </p>
            <p>
              <strong>Departure Time:</strong> {schedule.departureTime}
            </p>
            <p>
              <strong>Total Seats:</strong> {schedule.totalSeats}
            </p>

            <button
              className="primary-btn"
              onClick={() => handleBookNow(schedule.id)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulePage;