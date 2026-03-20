import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function HomePage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get("/routes");
      setRoutes(response.data);
    } catch (err) {
      setError("Failed to load routes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedules = (routeId) => {
    navigate(`/schedules/${routeId}`);
  };

  return (
    <div className="page-container">
      <h1 className="title">Bus Seat Booking Application</h1>
      <p className="subtitle">Select a route to start booking your seat</p>

      {loading && <p>Loading routes...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="route-list">
        {routes.map((route) => (
          <div className="route-card" key={route.id}>
            <h3>
              {route.fromCity} → {route.toCity}
            </h3>
            <button
              className="primary-btn"
              onClick={() => handleViewSchedules(route.id)}
            >
              View Schedules
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;