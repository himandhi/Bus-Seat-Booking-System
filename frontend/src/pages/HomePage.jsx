import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HomePage.css";

function HomePage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [droppingCity, setDroppingCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
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

  // Get unique cities for dropdowns
  const fromCities = [...new Set(routes.map(r => r.fromCity))];

  const handleFindTickets = () => {
    navigate("/routes-listing", {
      state: { pickupCity, droppingCity, departureDate }
    });
  };

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-left">
          <h1 className="hero-title">
            GET YOUR TICKETS<br />
            WITH <span className="hero-highlight">JUST 3 STEPS</span>
          </h1>
          <p className="hero-subtitle">
            Book your bus tickets easily and travel comfortably
          </p>
          <div className="hero-contact">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.17 4 2 2 0 012.18 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +94 777 382 186
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              info@busgo.lk
            </span>
          </div>
        </div>

        {/* Booking Search Card */}
        <div className="hero-search-card">
          <div className="search-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Pickup Point
            </label>
            <select
              value={pickupCity}
              onChange={e => { setPickupCity(e.target.value); setDroppingCity(""); }}
            >
              <option value="">Select pickup location</option>
              {fromCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Dropping Point
            </label>
            <select
              value={droppingCity}
              onChange={e => setDroppingCity(e.target.value)}
              disabled={!pickupCity}
            >
              <option value="">Select destination</option>
              {routes
                .filter(r => r.fromCity === pickupCity)
                .map(r => (
                  <option key={r.id} value={r.toCity}>{r.toCity}</option>
                ))
              }
            </select>
          </div>

          <div className="search-field">
            <label>
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Departure Date
            </label>
            <div className="date-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input
                type="date"
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button className="find-tickets-btn" onClick={handleFindTickets}>
            Find Tickets
          </button>
        </div>
      </section>

      {/* Why Choose BusGo Section */}
      <section className="why-section">
        <h2 className="why-title">Why Choose BusGo?</h2>
        <p className="why-subtitle">Your trusted travel partner</p>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon-wrap why-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b39d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Safe &amp; Secure</h3>
            <p>Your safety is our priority with verified buses and drivers</p>
          </div>
          <div className="why-card">
            <div className="why-icon-wrap why-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>On-Time Service</h3>
            <p>Punctual departures and arrivals for your convenience</p>
          </div>
          <div className="why-card">
            <div className="why-icon-wrap why-icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#7c3aed" stroke="none">Rs</text></svg>
            </div>
            <h3>Best Prices</h3>
            <p>Affordable fares with no hidden charges</p>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="home-routes">
        <h2 className="routes-heading">Popular Routes</h2>
        <p className="routes-subheading">Explore our most traveled destinations</p>

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
          {routes.slice(0, 6).map((route) => (
            <div className="route-card" key={route.id}>
              <div className="route-card-top">
                <div className="route-bus-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <span className="route-price">Rs. {route.price ?? "—"}</span>
              </div>
              <div className="route-cities">
                <p className="route-from">{route.fromCity}</p>
                <p className="route-to-label">to</p>
                <p className="route-to">{route.toCity}</p>
              </div>
              <div className="route-card-footer">
                <span className="route-duration">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {route.duration ?? "—"}
                </span>
                <button
                  className="route-book-btn"
                  onClick={() => handleViewSchedules(route.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More */}
        <div className="explore-more-wrap">
          <button className="explore-more-link" onClick={() => navigate("/routes-listing")}>
            Explore more routes →
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
