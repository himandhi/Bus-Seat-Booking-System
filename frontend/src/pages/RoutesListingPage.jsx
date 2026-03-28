import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./RoutesListingPage.css";

export default function RoutesListingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  // Read filters passed from HomePage via navigation state
  const passedState = location.state || {};

  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search bar filters (top)
  const [pickupCity, setPickupCity] = useState(passedState.pickupCity || "");
  const [droppingCity, setDroppingCity] = useState(passedState.droppingCity || "");
  const [departureDate, setDepartureDate] = useState(passedState.departureDate || "");

  // Sidebar route filters
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesRes, schedulesRes] = await Promise.all([
        api.get("/routes"),
        api.get("/schedules"),
      ]);
      setRoutes(routesRes.data);
      setSchedules(schedulesRes.data);
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cities come from embedded route object inside each schedule
  const fromCities = [...new Set(schedules.map(s => s.route?.fromCity).filter(Boolean))];

  const handleSearch = () => {
    // Just triggers re-filter via derived state — no action needed
    setSelectedRoutes([]); // reset sidebar when searching
  };

  const handleReset = () => {
    setPickupCity("");
    setDroppingCity("");
    setDepartureDate("");
    setSelectedRoutes([]);
  };

  const toggleRouteFilter = (routeLabel) => {
    setSelectedRoutes(prev =>
      prev.includes(routeLabel)
        ? prev.filter(r => r !== routeLabel)
        : [...prev, routeLabel]
    );
  };

  // Build route label map: routeId → "CityA to CityB"
  // ── Filter schedules using embedded schedule.route object
  const filteredSchedules = schedules.filter(schedule => {
    const route = schedule.route;
    if (!route) return false;

    if (pickupCity && route.fromCity !== pickupCity) return false;
    if (droppingCity && route.toCity !== droppingCity) return false;
    if (departureDate && schedule.travelDate !== departureDate) return false;

    if (selectedRoutes.length > 0) {
      const label = `${route.fromCity} to ${route.toCity}`;
      if (!selectedRoutes.includes(label)) return false;
    }

    return true;
  });

  // Unique route labels for sidebar
  const routeLabels = [...new Set(schedules.map(s => s.route ? `${s.route.fromCity} to ${s.route.toCity}` : null).filter(Boolean))];

  return (
    <div className="rlp-page">

      {/* ── Top Search Bar ── */}
      <div className="rlp-search-bar">
        <div className="rlp-search-field">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Pickup Point
          </label>
          <select value={pickupCity} onChange={e => { setPickupCity(e.target.value); setDroppingCity(""); }}>
            <option value="">Select pickup location</option>
            {[...new Set(schedules.map(s => s.route?.fromCity).filter(Boolean))].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="rlp-search-field">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Dropping Point
          </label>
          <select value={droppingCity} onChange={e => setDroppingCity(e.target.value)} disabled={!pickupCity}>
            <option value="">Select destination</option>
            {[...new Set(schedules.filter(s => s.route?.fromCity === pickupCity).map(s => s.route?.toCity))].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="rlp-search-field">
          <label>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Date of Journey
          </label>
          <div className="rlp-date-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <input
              type="date"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button className="rlp-find-btn" onClick={handleSearch}>
          Find Tickets
        </button>
      </div>

      {/* ── Body ── */}
      <div className="rlp-body">

        {/* ── Sidebar ── */}
        <aside className="rlp-sidebar">
          <div className="rlp-sidebar-header">
            <h3>Filter</h3>
            <button className="rlp-reset-btn" onClick={handleReset}>Reset All</button>
          </div>

          <div className="rlp-filter-section">
            <p className="rlp-filter-label">Routes</p>
            {routeLabels.map(label => (
              <label key={label} className="rlp-checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedRoutes.includes(label)}
                  onChange={() => toggleRouteFilter(label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ── Schedule Cards ── */}
        <div className="rlp-results">
          {loading && (
            <div className="rlp-loading">
              <div className="rlp-spinner" />
              <p>Loading schedules...</p>
            </div>
          )}

          {error && <div className="rlp-error">⚠️ {error}</div>}

          {!loading && filteredSchedules.length === 0 && (
            <div className="rlp-empty">
              <div className="rlp-empty-icon">🚌</div>
              <h3>No schedules found</h3>
              <p>Try changing your filters or selecting a different date.</p>
              <button className="rlp-reset-btn-lg" onClick={handleReset}>Reset Filters</button>
            </div>
          )}

          {filteredSchedules.map(schedule => {
            const route = schedule.route;
            if (!route) return null;

            return (
              <div className="rlp-card" key={schedule.id}>
                <div className="rlp-card-top">
                  <div className="rlp-card-title-row">
                    <h3 className="rlp-card-title">
                      {route.fromCity} - {route.toCity}
                    </h3>
                    <div className="rlp-card-price-wrap">
                      <span className="rlp-card-price">Rs {route.price?.toLocaleString() ?? "—"}</span>
                      <span className="rlp-card-availability">Every day available</span>
                    </div>
                  </div>

                  <div className="rlp-card-tags">
                    <span className={schedule.acType === "A/C" ? "rlp-tag rlp-tag-ac" : "rlp-tag rlp-tag-nonac"}>
                      {schedule.acType === "A/C" ? "A/C" : "Non-A/C"}
                    </span>
                    <span className="rlp-tag rlp-tag-blue">{schedule.busNumber}</span>
                  </div>
                </div>

                <div className="rlp-card-bottom">
                  <div className="rlp-card-time-row">
                    <div className="rlp-time-block">
                      <span className="rlp-time">{schedule.departureTime?.substring(0, 5) ?? schedule.departureTime}</span>
                      <span className="rlp-city">{route.fromCity}</span>
                    </div>
                    <div className="rlp-duration-block">
                      <span className="rlp-arrow-line">→</span>
                      <span className="rlp-duration-text">{route.duration ?? "—"}</span>
                    </div>
                    <div className="rlp-time-block">
                      <span className="rlp-time">—</span>
                      <span className="rlp-city">{route.toCity}</span>
                    </div>
                  </div>

                  <button
                    className="rlp-select-btn"
                    onClick={() => {
                      if (!isLoggedIn) {
                        alert("Please log in first to book a seat.");
                        navigate("/login");
                        return;
                      }
                      navigate(`/booking/${schedule.id}`);
                    }}
                  >
                    Select Seat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
