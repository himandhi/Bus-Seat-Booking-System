import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminSchedulesPage() {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [totalSeats, setTotalSeats] = useState("40");

  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setLoadingRoutes(false);
    }
  };

  const validateForm = () => {
    if (!routeId) {
      setError("Please select a route.");
      return false;
    }

    if (!travelDate) {
      setError("Please select a travel date.");
      return false;
    }

    if (!departureTime) {
      setError("Please select a departure time.");
      return false;
    }

    if (!busNumber.trim()) {
      setError("Please enter bus number.");
      return false;
    }

    if (!totalSeats || Number(totalSeats) <= 0) {
      setError("Please enter a valid total seat count.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setSubmitLoading(true);

      const payload = {
        routeId: Number(routeId),
        travelDate,
        departureTime: `${departureTime}:00`,
        busNumber,
        totalSeats: Number(totalSeats),
      };

      await api.post("/schedules", payload);

      setSuccessMessage("Schedule created successfully.");
      setRouteId("");
      setTravelDate("");
      setDepartureTime("");
      setBusNumber("");
      setTotalSeats("40");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create schedule.");
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-container">
      <button className="secondary-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 className="title">Admin - Add Schedule</h1>
      <p className="subtitle">Create a new bus travel schedule</p>

      {loadingRoutes && <p>Loading routes...</p>}
      {error && <p className="error-text">{error}</p>}
      {successMessage && <div className="success-box"><p>{successMessage}</p></div>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Schedule Details</h2>

        <div className="form-group">
          <label>Route</label>
          <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
            <option value="">Select a route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.fromCity} → {route.toCity}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Travel Date</label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Departure Time</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Bus Number</label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            placeholder="Enter bus number"
          />
        </div>

        <div className="form-group">
          <label>Total Seats</label>
          <input
            type="number"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            placeholder="Enter total seats"
          />
        </div>

        <button className="primary-btn full-width-btn" type="submit" disabled={submitLoading}>
          {submitLoading ? "Creating Schedule..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}

export default AdminSchedulesPage;