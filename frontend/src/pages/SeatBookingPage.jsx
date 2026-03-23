import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./SeatBookingPage.css";

function SeatBookingPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [passengerName, setPassengerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScheduleDetails();
    fetchBookedSeats();
  }, [scheduleId]);

  const fetchScheduleDetails = async () => {
    try {
      const response = await api.get("/schedules");
      const selectedSchedule = response.data.find(
        (item) => item.id === Number(scheduleId)
      );
      if (selectedSchedule) {
        setSchedule(selectedSchedule);
      } else {
        setError("Schedule not found.");
      }
    } catch (err) {
      setError("Failed to load schedule details.");
      console.error(err);
    }
  };

  const fetchBookedSeats = async () => {
    try {
      const response = await api.get(`/bookings/schedule/${scheduleId}/booked-seats`);
      setBookedSeats(response.data);
    } catch (err) {
      setError("Failed to load booked seats.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeat(seatNumber);
    setError("");
  };

  const validateForm = () => {
    if (!selectedSeat) {
      setError("Please select a seat.");
      return false;
    }
    if (!passengerName.trim()) {
      setError("Please enter passenger name.");
      return false;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter phone number.");
      return false;
    }
    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setError("Phone number must be 10 digits.");
      return false;
    }
    return true;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      const payload = {
        passengerName,
        phoneNumber,
        scheduleId: Number(scheduleId),
        seatNumber: selectedSeat,
      };
      const response = await api.post("/bookings", payload);
      await fetchBookedSeats();
      navigate("/booking-success", { state: response.data });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create booking.";
      setError(message);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSeats = () => {
    if (!schedule) return null;

    const rows = [];
    const seatsPerRow = 4; // 2×2 layout

    for (let i = 1; i <= schedule.totalSeats; i += seatsPerRow) {
      const rowSeats = [];

      for (let j = i; j < i + seatsPerRow && j <= schedule.totalSeats; j++) {
        let seatStatus = "available";
        if (bookedSeats.includes(j)) seatStatus = "booked";
        else if (selectedSeat === j) seatStatus = "selected";

        // Add aisle gap after seat 2 in each row
        if ((j - i) === 2) {
          rowSeats.push(<div key={`aisle-${j}`} className="aisle-gap" />);
        }

        rowSeats.push(
          <button
            key={j}
            type="button"
            className={`seat seat-${seatStatus}`}
            onClick={() => handleSeatClick(j)}
            disabled={seatStatus === "booked"}
            title={seatStatus === "booked" ? "Already booked" : `Seat ${j}`}
          >
            {j}
          </button>
        );
      }

      rows.push(
        <div className="seat-row" key={i}>
          {rowSeats}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="booking-page">

      {/* Page Header */}
      <div className="booking-page-header">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Schedules
        </button>
        <div className="booking-page-title">
          <h1>Select Your Seat</h1>
          <p>Choose an available seat and enter your details to confirm</p>
        </div>
      </div>

      <div className="booking-body">

        {/* Left Column — Seat Map */}
        <div className="booking-left">

          {/* Schedule Info Card */}
          {schedule && (
            <div className="schedule-info-card">
              <h2 className="info-card-title">🚌 Journey Details</h2>
              <div className="info-row">
                <span className="info-label">Bus Number</span>
                <span className="info-value bus-badge">{schedule.busNumber}</span>
              </div>
              <div className="info-row">
                <span className="info-label">📅 Travel Date</span>
                <span className="info-value">{schedule.travelDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">🕐 Departure</span>
                <span className="info-value">{schedule.departureTime}</span>
              </div>
              <div className="info-row">
                <span className="info-label">💺 Total Seats</span>
                <span className="info-value">{schedule.totalSeats}</span>
              </div>
            </div>
          )}

          {/* Seat Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <span className="legend-box legend-available" />
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-box legend-booked" />
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-box legend-selected" />
              <span>Selected</span>
            </div>
          </div>

          {/* Seat Map */}
          <div className="seat-map-container">
            <div className="bus-front">
              <span>🪟 Driver</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading seat layout...</p>
              </div>
            ) : (
              <div className="seat-map">
                {renderSeats()}
              </div>
            )}
          </div>

          {/* Selected Seat Info */}
          {selectedSeat && (
            <div className="selected-seat-banner">
              ✅ Seat <strong>{selectedSeat}</strong> selected
            </div>
          )}

        </div>

        {/* Right Column — Booking Form */}
        <div className="booking-right">
          <div className="booking-form-card">
            <h2 className="form-card-title">Passenger Details</h2>

            {error && (
              <div className="error-banner">⚠️ {error}</div>
            )}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="passengerName">Full Name</label>
                <input
                  id="passengerName"
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. John Perera"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </div>

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Selected Seat</span>
                  <span>{selectedSeat ? `Seat ${selectedSeat}` : "—"}</span>
                </div>
                <div className="summary-row">
                  <span>Bus</span>
                  <span>{schedule?.busNumber ?? "—"}</span>
                </div>
                <div className="summary-row">
                  <span>Date</span>
                  <span>{schedule?.travelDate ?? "—"}</span>
                </div>
              </div>

              <button
                className="confirm-btn"
                type="submit"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <span className="btn-spinner" /> Confirming...
                  </>
                ) : (
                  "Confirm Booking →"
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SeatBookingPage;
