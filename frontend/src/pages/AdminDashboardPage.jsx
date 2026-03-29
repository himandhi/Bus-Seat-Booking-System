import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AdminDashboardPage.css";

const TABS = ["All Bookings", "Schedules", "Routes"];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout, user, darkMode, toggleDarkMode } = useAuth();

  const [activeTab, setActiveTab] = useState("All Bookings");


  // ── Data
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Search
  const [searchQuery, setSearchQuery] = useState("");

  // ── Add/Edit Schedule
  const [schedForm, setSchedForm] = useState({ routeId: "", busNumber: "", totalSeats: "", departureTime: "", travelDate: "", acType: "Non-A/C" });
  const [editingSchedId, setEditingSchedId] = useState(null);
  const [schedMsg, setSchedMsg] = useState("");
  const [schedErr, setSchedErr] = useState("");
  const [schedLoading, setSchedLoading] = useState(false);

  // ── Add/Edit Route
  const [routeForm, setRouteForm] = useState({ fromCity: "", toCity: "", duration: "" });
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [routeMsg, setRouteMsg] = useState("");
  const [routeErr, setRouteErr] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);

  // ── Delete confirm modal
  const [deleteModal, setDeleteModal] = useState(null); // { type: "schedule"|"route", id, label }

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, rRes, sRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/routes"),
        api.get("/schedules"),
      ]);
      setBookings(bRes.data);
      setRoutes(rRes.data);
      setSchedules(sRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // ── Stats
  const activeBookings = bookings.filter(b => b.status === "BOOKED" || b.status === "RESERVED" || b.status === "PENDING");
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // ── Booking actions
  const handleStatusChange = async (bookingId, newStatus) => {
    // Save scroll position before re-fetching
    const scrollY = window.scrollY;
    try {
      const endpoint = newStatus === "CANCELLED" ? `/bookings/${bookingId}/cancel` : `/bookings/${bookingId}/reserve`;
      await api.put(endpoint);
      await fetchAll();
      // Restore scroll position after re-render
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
    } catch (err) { alert("Failed to update booking status."); }
  };

  // ── Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    return b.passengerName?.toLowerCase().includes(q) || b.bookingId?.toLowerCase().includes(q) || b.phoneNumber?.includes(q);
  });

  // ── Schedule CRUD
  const handleSchedChange = e => setSchedForm({ ...schedForm, [e.target.name]: e.target.value });

  const handleEditSched = (s) => {
    setEditingSchedId(s.id);
    setSchedForm({
      routeId: s.route?.id ?? "",
      busNumber: s.busNumber,
      totalSeats: s.totalSeats,
      acType: s.acType ?? "Non-A/C",
      departureTime: s.departureTime?.substring(0, 5) ?? "",
      travelDate: s.travelDate,
    });
    setSchedMsg(""); setSchedErr("");
    document.getElementById("sched-form-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelSchedEdit = () => {
    setEditingSchedId(null);
    setSchedForm({ routeId: "", busNumber: "", totalSeats: "", departureTime: "", travelDate: "", acType: "Non-A/C" });
    setSchedMsg(""); setSchedErr("");
  };

  const handleSaveSchedule = async e => {
    e.preventDefault();
    setSchedErr(""); setSchedMsg("");
    if (!schedForm.routeId || !schedForm.busNumber || !schedForm.totalSeats || !schedForm.departureTime || !schedForm.travelDate) {
      setSchedErr("Please fill in all fields."); return;
    }
    setSchedLoading(true);
    try {
      const payload = {
        routeId: Number(schedForm.routeId),
        busNumber: schedForm.busNumber,
        totalSeats: Number(schedForm.totalSeats),
        acType: schedForm.acType,
        departureTime: schedForm.departureTime,
        travelDate: schedForm.travelDate,
      };
      if (editingSchedId) {
        await api.put(`/schedules/${editingSchedId}`, payload);
        setSchedMsg("Schedule updated successfully!");
      } else {
        await api.post("/schedules", payload);
        setSchedMsg("Schedule added successfully!");
      }
      setEditingSchedId(null);
      setSchedForm({ routeId: "", busNumber: "", totalSeats: "", departureTime: "", travelDate: "", acType: "Non-A/C" });
      await fetchAll();
    } catch (err) {
      setSchedErr(err.response?.data?.message || "Failed to save schedule.");
    } finally {
      setSchedLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await api.delete(`/schedules/${id}`);
      setDeleteModal(null);
      await fetchAll();
    } catch (err) { alert("Failed to delete schedule."); }
  };

  // ── Route CRUD
  const handleRouteChange = e => setRouteForm({ ...routeForm, [e.target.name]: e.target.value });

  const handleEditRoute = (r) => {
    setEditingRouteId(r.id);
    setRouteForm({ fromCity: r.fromCity, toCity: r.toCity, duration: r.duration });
    setRouteMsg(""); setRouteErr("");
    document.getElementById("route-form-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelRouteEdit = () => {
    setEditingRouteId(null);
    setRouteForm({ fromCity: "", toCity: "", duration: "" });
    setRouteMsg(""); setRouteErr("");
  };

  const handleSaveRoute = async e => {
    e.preventDefault();
    setRouteErr(""); setRouteMsg("");
    if (!routeForm.fromCity || !routeForm.toCity || !routeForm.duration) {
      setRouteErr("Please fill in all fields."); return;
    }
    setRouteLoading(true);
    try {
      const payload = { fromCity: routeForm.fromCity, toCity: routeForm.toCity, duration: routeForm.duration };
      if (editingRouteId) {
        await api.put(`/routes/${editingRouteId}`, payload);
        setRouteMsg("Route updated successfully!");
      } else {
        await api.post("/routes", payload);
        setRouteMsg("Route added successfully!");
      }
      setEditingRouteId(null);
      setRouteForm({ fromCity: "", toCity: "", duration: "" });
      await fetchAll();
    } catch (err) {
      setRouteErr(err.response?.data?.message || "Failed to save route.");
    } finally {
      setRouteLoading(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await api.delete(`/routes/${id}`);
      setDeleteModal(null);
      await fetchAll();
    } catch (err) { alert("Failed to delete route."); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="adm-page">

      {/* ── Top Bar ── */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <div className="adm-logo-icon">
            <svg viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2563EB"/><path d="M5 8C5 6.9 5.9 6 7 6H17C18.1 6 19 6.9 19 8V15C19 15.6 18.6 16 18 16H17V17.5C17 17.8 16.8 18 16.5 18H15.5C15.2 18 15 17.8 15 17.5V16H9V17.5C9 17.8 8.8 18 8.5 18H7.5C7.2 18 7 17.8 7 17.5V16H6C5.4 16 5 15.6 5 15V8Z" fill="white"/><rect x="7" y="8.5" width="10" height="4" rx="1" fill="#2563EB"/><circle cx="8.5" cy="14.5" r="1" fill="#2563EB"/><circle cx="15.5" cy="14.5" r="1" fill="#2563EB"/></svg>
          </div>
          <div>
            <h1 className="adm-title">Admin Dashboard</h1>
            <p className="adm-subtitle">Manage bookings and routes</p>
          </div>
        </div>
        <div className="adm-topbar-right">
          {/* Dark/Light Mode Toggle */}
          <button className="adm-theme-toggle" onClick={toggleDarkMode} title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            )}
            <span>{darkMode ? "Light" : "Dark"}</span>
          </button>
          <button className="adm-back-btn" onClick={() => navigate("/")}>← Back to Home</button>
          {user && (
            <div className="adm-user-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{user.name}</span>
            </div>
          )}
          <button className="adm-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="adm-body">

        {/* ── Stats ── */}
        <div className="adm-stats">
          <div className="adm-stat-card">
            <div className="adm-stat-top">
              <span className="adm-stat-label">Total Revenue</span>
              <span className="adm-stat-icon green adm-rs-icon">Rs.</span>
            </div>
            <p className="adm-stat-value green">Rs. {totalRevenue.toLocaleString()}</p>
            <p className="adm-stat-meta">From {activeBookings.length} bookings</p>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-top">
              <span className="adm-stat-label">Total Passengers</span>
              <span className="adm-stat-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></span>
            </div>
            <p className="adm-stat-value blue">{activeBookings.length}</p>
            <p className="adm-stat-meta">Seats booked</p>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-top">
              <span className="adm-stat-label">Active Routes</span>
              <span className="adm-stat-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
            </div>
            <p className="adm-stat-value purple">{routes.length}</p>
            <p className="adm-stat-meta">Available destinations</p>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-top">
              <span className="adm-stat-label">Schedules</span>
              <span className="adm-stat-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
            </div>
            <p className="adm-stat-value orange">{schedules.length}</p>
            <p className="adm-stat-meta">Total trips</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="adm-tabs">
          {TABS.map(tab => (
            <button key={tab} className={`adm-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </div>

        {loading && <div className="adm-loading"><div className="adm-spinner"/><p>Loading...</p></div>}
        {error && <div className="adm-error">⚠️ {error}</div>}

        {/* ══ ALL BOOKINGS ══ */}
        {activeTab === "All Bookings" && !loading && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h2>Booking Management</h2>
              <p>View and manage all passenger bookings</p>
            </div>
            <div className="adm-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search by name, booking ID, or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {filteredBookings.length === 0 ? (
              <div className="adm-empty"><div className="adm-empty-icon">📋</div><p>No bookings found.</p></div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Booking ID</th><th>Passenger</th><th>Phone</th><th>Route</th><th>Bus</th><th>Date</th><th>Seat</th><th>Total</th><th>Advance</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td><span className="adm-booking-id">{b.bookingId}</span></td>
                        <td>{b.passengerName}</td>
                        <td>{b.phoneNumber}</td>
                        <td>{b.schedule?.route ? `${b.schedule.route.fromCity} → ${b.schedule.route.toCity}` : "—"}</td>
                        <td>
                          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
                            {b.schedule?.busNumber ?? "—"}
                            <span className={b.schedule?.acType === "A/C" ? "ac-badge-adm ac-yes-adm" : "ac-badge-adm ac-no-adm"}>
                              {b.schedule?.acType === "A/C" ? "A/C" : "Non-A/C"}
                            </span>
                          </div>
                        </td>
                        <td>{b.schedule?.travelDate ?? "—"}</td>
                        <td>
                          <span className="adm-seat-badge">
                            {b.seatNumbers && b.seatNumbers.trim() !== ""
                              ? b.seatNumbers.split(",").map(s => `#${s.trim()}`).join(", ")
                              : b.seatNumber ? `#${b.seatNumber}` : "—"}
                          </span>
                        </td>
                        <td>Rs. {(b.totalPrice || 0).toLocaleString()}</td>
                        <td>Rs. {(b.advancePayment || 0).toLocaleString()}</td>
                        <td><span className={`adm-status adm-status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                        <td>
                          <div className="adm-action-btns">
                            {/* PENDING only → Reserve + Cancel */}
                            {b.status === "PENDING" && (
                              <>
                                <button className="adm-btn-reserve" onClick={() => handleStatusChange(b.id, "RESERVED")}>Reserve</button>
                                <button className="adm-btn-cancel" onClick={() => handleStatusChange(b.id, "CANCELLED")}>Cancel</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ SCHEDULES ══ */}
        {activeTab === "Schedules" && !loading && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h2>Schedule Management</h2>
              <p>Add, edit and delete bus schedules</p>
            </div>

            {/* Form */}
            <div className="adm-form-card" id="sched-form-top">
              <h3 className="adm-form-title">{editingSchedId ? "✏️ Edit Schedule" : "➕ Add New Schedule"}</h3>
              {schedErr && <div className="adm-form-error">⚠️ {schedErr}</div>}
              {schedMsg && <div className="adm-form-success">✅ {schedMsg}</div>}
              <form onSubmit={handleSaveSchedule} className="adm-form-grid">
                <div className="adm-field">
                  <label>Route</label>
                  <select name="routeId" value={schedForm.routeId} onChange={handleSchedChange}>
                    <option value="">Select a route</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.fromCity} → {r.toCity}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label>Bus Number</label>
                  <input name="busNumber" type="text" placeholder="e.g. NB-4578" value={schedForm.busNumber} onChange={handleSchedChange} />
                </div>
                <div className="adm-field">
                  <label>Total Seats</label>
                  <input name="totalSeats" type="number" placeholder="e.g. 40" value={schedForm.totalSeats} onChange={handleSchedChange} min="1" />
                </div>

                <div className="adm-field">
                  <label>Departure Time</label>
                  <input name="departureTime" type="time" value={schedForm.departureTime} onChange={handleSchedChange} />
                </div>
                <div className="adm-field">
                  <label>Travel Date</label>
                  <input name="travelDate" type="date" value={schedForm.travelDate} onChange={handleSchedChange} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="adm-field">
                  <label>Bus Type</label>
                  <select name="acType" value={schedForm.acType} onChange={handleSchedChange}>
                    <option value="Non-A/C">Non-A/C</option>
                    <option value="A/C">A/C</option>
                  </select>
                </div>
                <div className="adm-field adm-field-full adm-form-actions">
                  <button type="submit" className="adm-submit-btn" disabled={schedLoading}>
                    {schedLoading ? "Saving..." : editingSchedId ? "Update Schedule" : "Add Schedule"}
                  </button>
                  {editingSchedId && (
                    <button type="button" className="adm-cancel-edit-btn" onClick={handleCancelSchedEdit}>Cancel Edit</button>
                  )}
                </div>
              </form>
            </div>

            {/* Table */}
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Route</th><th>Bus Number</th><th>Travel Date</th><th>Departure</th><th>Total Seats</th><th>Actions</th></tr></thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s.id}>
                      <td>{s.route ? `${s.route.fromCity} → ${s.route.toCity}` : "—"}</td>
                      <td>
                        <span className="adm-booking-id">{s.busNumber}</span>
                        <span className={s.acType === "A/C" ? "ac-badge-adm ac-yes-adm" : "ac-badge-adm ac-no-adm"}>
                          {s.acType === "A/C" ? "A/C" : "Non-A/C"}
                        </span>
                      </td>
                      <td>{s.travelDate}</td>
                      <td>{s.departureTime?.substring(0, 5) ?? s.departureTime}</td>
                      <td>{s.totalSeats}</td>
                      <td>
                        <div className="adm-action-btns">
                          <button className="adm-btn-edit" onClick={() => handleEditSched(s)}>Edit</button>
                          <button className="adm-btn-delete" onClick={() => setDeleteModal({ type: "schedule", id: s.id, label: `${s.busNumber} on ${s.travelDate}` })}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ ROUTES ══ */}
        {activeTab === "Routes" && !loading && (
          <div className="adm-panel">
            <div className="adm-panel-header">
              <h2>Route Management</h2>
              <p>Add, edit and delete bus routes</p>
            </div>

            {/* Form */}
            <div className="adm-form-card" id="route-form-top">
              <h3 className="adm-form-title">{editingRouteId ? "✏️ Edit Route" : "➕ Add New Route"}</h3>
              {routeErr && <div className="adm-form-error">⚠️ {routeErr}</div>}
              {routeMsg && <div className="adm-form-success">✅ {routeMsg}</div>}
              <form onSubmit={handleSaveRoute} className="adm-form-grid">
                <div className="adm-field">
                  <label>From City</label>
                  <input name="fromCity" type="text" placeholder="e.g. Colombo" value={routeForm.fromCity} onChange={handleRouteChange} />
                </div>
                <div className="adm-field">
                  <label>To City</label>
                  <input name="toCity" type="text" placeholder="e.g. Kandy" value={routeForm.toCity} onChange={handleRouteChange} />
                </div>

                <div className="adm-field">
                  <label>Duration</label>
                  <input name="duration" type="text" placeholder="e.g. 2h 30m" value={routeForm.duration} onChange={handleRouteChange} />
                </div>
                <div className="adm-field adm-field-full adm-form-actions">
                  <button type="submit" className="adm-submit-btn" disabled={routeLoading}>
                    {routeLoading ? "Saving..." : editingRouteId ? "Update Route" : "Add Route"}
                  </button>
                  {editingRouteId && (
                    <button type="button" className="adm-cancel-edit-btn" onClick={handleCancelRouteEdit}>Cancel Edit</button>
                  )}
                </div>
              </form>
            </div>

            {/* Table */}
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>From</th><th>To</th><th>Duration</th><th>Actions</th></tr></thead>
                <tbody>
                  {routes.map(r => (
                    <tr key={r.id}>
                      <td>{r.fromCity}</td>
                      <td>{r.toCity}</td>
                      <td>{r.duration}</td>
                      <td>
                        <div className="adm-action-btns">
                          <button className="adm-btn-edit" onClick={() => handleEditRoute(r)}>Edit</button>
                          <button className="adm-btn-delete" onClick={() => setDeleteModal({ type: "route", id: r.id, label: `${r.fromCity} → ${r.toCity}` })}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal">
            <div className="adm-modal-icon">🗑️</div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteModal.label}</strong>? This action cannot be undone.</p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="adm-modal-confirm" onClick={() => deleteModal.type === "schedule" ? handleDeleteSchedule(deleteModal.id) : handleDeleteRoute(deleteModal.id)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
