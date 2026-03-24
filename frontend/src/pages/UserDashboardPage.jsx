import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./UserDashboardPage.css";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await api.get("/bookings");
      // Filter bookings by logged-in user's phone or name
      const userBookings = response.data.filter(
        b => b.passengerName?.toLowerCase() === user?.name?.toLowerCase()
      );
      setBookings(userBookings);
    } catch (err) {
      setError("Failed to load bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const bookedCount    = bookings.filter(b => b.status === "BOOKED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
  const pendingCount   = bookings.filter(b => b.status === "RESERVED").length;

  return (
    <div className="udp-page">

      {/* ── Header ── */}
      <div className="udp-header">
        <div className="udp-header-left" onClick={() => navigate("/")}>
          <div className="udp-logo-icon">
            <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563EB"/><path d="M5 8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V15C19 15.6 18.6 16 18 16H17V17.5C17 17.8 16.8 18 16.5 18H15.5C15.2 18 15 17.8 15 17.5V16H9V17.5C9 17.8 8.8 18 8.5 18H7.5C7.2 18 7 17.8 7 17.5V16H6C5.4 16 5 15.6 5 15V8Z" fill="white"/><rect x="7" y="8.5" width="10" height="4" rx="1" fill="#2563EB"/><circle cx="8.5" cy="14.5" r="1" fill="#2563EB"/><circle cx="15.5" cy="14.5" r="1" fill="#2563EB"/></svg>
          </div>
          <span className="udp-logo-text">BusGo</span>
        </div>

        <nav className="udp-nav">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/about")}>About</button>
          <button onClick={() => navigate("/contact")}>Contact</button>
          <button className="udp-nav-active" onClick={() => navigate("/user/dashboard")}>Dashboard</button>

          {/* Profile Dropdown */}
          <div className="udp-profile-wrap">
            <button className="udp-profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
              Profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {profileOpen && (
              <div className="udp-dropdown">
                <button onClick={() => { navigate("/user/profile"); setProfileOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Update Profile
                </button>
                <button onClick={() => { navigate("/user/change-password"); setProfileOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Change Password
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="udp-header-right">
          <button className="udp-buy-btn" onClick={() => navigate("/routes-listing")}>Buy Tickets</button>
          <div className="udp-user-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>{user?.name}</span>
          </div>
          <button className="udp-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="udp-hero">
        <h1>Dashboard</h1>
      </div>

      {/* ── Body ── */}
      <div className="udp-body">

        {/* Stats Cards */}
        <div className="udp-stats">
          <div className="udp-stat-card udp-stat-green">
            <div className="udp-stat-left">
              <p className="udp-stat-label">Total Booked Ticket</p>
              <p className="udp-stat-value">{bookedCount}</p>
            </div>
            <div className="udp-stat-icon udp-icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="28" height="28"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>

          <div className="udp-stat-card udp-stat-red">
            <div className="udp-stat-left">
              <p className="udp-stat-label">Total Rejected Ticket</p>
              <p className="udp-stat-value">{cancelledCount}</p>
            </div>
            <div className="udp-stat-icon udp-icon-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="28" height="28"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>

          <div className="udp-stat-card udp-stat-yellow">
            <div className="udp-stat-left">
              <p className="udp-stat-label">Total Pending Ticket</p>
              <p className="udp-stat-value">{pendingCount}</p>
            </div>
            <div className="udp-stat-icon udp-icon-yellow">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="28" height="28"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="udp-loading"><div className="udp-spinner"/><p>Loading...</p></div>
        ) : error ? (
          <div className="udp-error">⚠️ {error}</div>
        ) : (
          <div className="udp-table-wrap">
            <table className="udp-table">
              <thead>
                <tr>
                  <th>REF Number</th>
                  <th>Starting Point</th>
                  <th>Dropping Point</th>
                  <th>Journey Date</th>
                  <th>Journey Start Time</th>
                  <th>Booked Seats</th>
                  <th>Fare</th>
                  <th>Advance</th>
                  <th>Pay at Bus</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="10" className="udp-empty-cell">No booked ticket found</td></tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b.id}>
                      <td><span className="udp-ref">{b.bookingId}</span></td>
                      <td>{b.schedule?.route?.fromCity ?? "—"}</td>
                      <td>{b.schedule?.route?.toCity ?? "—"}</td>
                      <td>{b.schedule?.travelDate ?? "—"}</td>
                      <td>{b.schedule?.departureTime ?? "—"}</td>
                      <td><span className="udp-seat">#{b.seatNumber}</span></td>
                      <td>Rs. {(b.totalPrice || 0).toLocaleString()}</td>
                      <td>Rs. {(b.advancePayment || 0).toLocaleString()}</td>
                      <td>Rs. {(b.payAtBus || 0).toLocaleString()}</td>
                      <td><span className={`udp-status udp-status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
