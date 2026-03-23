import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HomePage.css";

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
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-text">
          <span className="hero-badge">🚌 Sri Lanka's Bus Booking Platform</span>
          <h1 className="hero-title">
            Book Your Bus Seat <span className="hero-highlight">in Seconds</span>
          </h1>
          <p className="hero-subtitle">
            Choose your route, pick a schedule, select your seat — all in one place.
          </p>
        </div>
        <div className="hero-admin-links">
          <button className="admin-link-btn" onClick={() => navigate("/admin/bookings")}>
            📋 Admin Bookings
          </button>
          <button className="admin-link-btn" onClick={() => navigate("/admin/schedules")}>
            ➕ Add Schedule
          </button>
        </div>
      </section>

      {/* Routes Section */}
      <section className="home-routes">
        <h2 className="routes-heading">Available Routes</h2>
        <p className="routes-subheading">Select a route to view schedules and book your seat</p>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading routes...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <div className="route-grid">
          {routes.map((route) => (
            <div className="route-card" key={route.id}>
              <div className="route-card-icon">🗺️</div>
              <h3 className="route-card-title">
                {route.fromCity} <span className="route-arrow">→</span> {route.toCity}
              </h3>
              <button
                className="route-card-btn"
                onClick={() => handleViewSchedules(route.id)}
              >
                View Schedules
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
