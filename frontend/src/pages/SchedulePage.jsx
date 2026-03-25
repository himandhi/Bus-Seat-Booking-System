import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./SchedulePage.css";

function SchedulePage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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
    if (!isLoggedIn) {
      alert("Please log in first to book a seat.");
      navigate("/login");
      return;
    }
    navigate(`/booking/${scheduleId}`);
  };

  return (
    <div className="schedule-page">

      {/* Page Header */}
      <div className="schedule-page-header">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Routes
        </button>
        <div className="schedule-page-title">
          <h1>Available Schedules</h1>
          <p>Choose a bus schedule for your selected route</p>
        </div>
      </div>

      {/* Content */}
      <div className="schedule-content">

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading schedules...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">⚠️ {error}</div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🚌</div>
            <h3>No Schedules Found</h3>
            <p>There are no schedules available for this route at the moment.</p>
            <button className="back-btn-sm" onClick={handleBack}>← Go Back</button>
          </div>
        )}

        <div className="schedule-grid">
          {schedules.map((schedule) => (
            <div className="schedule-card" key={schedule.id}>
              <div className="schedule-card-top">
                <div className="schedule-bus-badge">
                  🚌 {schedule.busNumber}
                </div>
              </div>

              <div className="schedule-details">
                <div className="schedule-detail-row">
                  <span className="detail-icon">📅</span>
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{schedule.travelDate}</span>
                </div>
                <div className="schedule-detail-row">
                  <span className="detail-icon">🕐</span>
                  <span className="detail-label">Departure</span>
                  <span className="detail-value">{schedule.departureTime}</span>
                </div>
                <div className="schedule-detail-row">
                  <span className="detail-icon">💺</span>
                  <span className="detail-label">Total Seats</span>
                  <span className="detail-value">{schedule.totalSeats}</span>
                </div>
              </div>

              <button
                className="book-now-btn"
                onClick={() => handleBookNow(schedule.id)}
              >
                Book Now →
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SchedulePage;
