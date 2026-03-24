import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./SeatBookingPage.css";

// Advance payment is 30% of total price
const ADVANCE_PERCENT = 0.30;

function SeatBookingPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

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
      const found = response.data.find(item => item.id === Number(scheduleId));
      if (found) setSchedule(found);
      else setError("Schedule not found.");
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

  // ── Price calculations
  const pricePerSeat = schedule?.route?.price ?? 0;
  const numSeats = selectedSeats.length;
  const totalPrice = pricePerSeat * numSeats;
  const advancePayment = Math.round(totalPrice * ADVANCE_PERCENT);
  const payAtBus = totalPrice - advancePayment;

  const handleBack = () => navigate(-1);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber].sort((a, b) => a - b)
    );
    setError("");
  };

  const validateForm = () => {
    if (selectedSeats.length === 0) { setError("Please select at least one seat."); return false; }
    if (!passengerName.trim()) { setError("Please enter passenger name."); return false; }
    if (!phoneNumber.trim()) { setError("Please enter phone number."); return false; }
    if (!/^\d{10}$/.test(phoneNumber.trim())) { setError("Phone number must be 10 digits."); return false; }
    return true;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);

      // Book each selected seat separately
      const bookingPromises = selectedSeats.map(seatNumber =>
        api.post("/bookings", {
          passengerName,
          phoneNumber,
          scheduleId: Number(scheduleId),
          seatNumber,
          advancePayment: Math.round(pricePerSeat * ADVANCE_PERCENT),
          payAtBus: pricePerSeat - Math.round(pricePerSeat * ADVANCE_PERCENT),
          totalPrice: pricePerSeat,
        })
      );

      const responses = await Promise.all(bookingPromises);
      await fetchBookedSeats();

      navigate("/booking-success", {
        state: {
          bookings: responses.map(r => r.data),
          selectedSeats,
          totalPrice,
          advancePayment,
          payAtBus,
          passengerName,
          schedule,
        }
      });
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
    const seatsPerRow = 4;

    for (let i = 1; i <= schedule.totalSeats; i += seatsPerRow) {
      const rowSeats = [];
      for (let j = i; j < i + seatsPerRow && j <= schedule.totalSeats; j++) {
        let seatStatus = "available";
        if (bookedSeats.includes(j)) seatStatus = "booked";
        else if (selectedSeats.includes(j)) seatStatus = "selected";

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
      rows.push(<div className="seat-row" key={i}>{rowSeats}</div>);
    }
    return rows;
  };

  const route = schedule?.route;

  return (
    <div className="booking-page">

      {/* Page Header */}
      <div className="booking-page-header">
        <button className="back-btn" onClick={handleBack}>← Back</button>
        <div className="booking-page-title">
          <h1>Select Your Seat</h1>
          <p>Choose available seats and enter your details to confirm</p>
        </div>
      </div>

      <div className="booking-body">

        {/* Left Column */}
        <div className="booking-left">

          {/* Journey Details */}
          {schedule && (
            <div className="schedule-info-card">
              <h2 className="info-card-title">🚌 Journey Details</h2>
              {route && (
                <div className="info-row">
                  <span className="info-label">🗺️ Route</span>
                  <span className="info-value">{route.fromCity} → {route.toCity}</span>
                </div>
              )}
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
              {route && (
                <div className="info-row">
                  <span className="info-label">💰 Price per Seat</span>
                  <span className="info-value price-blue">Rs. {pricePerSeat.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item"><span className="legend-box legend-available" /><span>Available</span></div>
            <div className="legend-item"><span className="legend-box legend-booked" /><span>Booked</span></div>
            <div className="legend-item"><span className="legend-box legend-selected" /><span>Selected</span></div>
          </div>

          {/* Seat Map */}
          <div className="seat-map-container">
            <div className="bus-front"><span>🪟 Driver</span></div>
            {loading ? (
              <div className="loading-state"><div className="spinner" /><p>Loading seat layout...</p></div>
            ) : (
              <div className="seat-map">{renderSeats()}</div>
            )}
          </div>

          {selectedSeats.length > 0 && (
            <div className="selected-seat-banner">
              ✅ {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected:&nbsp;
              <strong>{selectedSeats.map(s => `Seat ${s}`).join(", ")}</strong>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="booking-right">
          <div className="booking-form-card">
            <h2 className="form-card-title">Passenger Details</h2>

            {error && <div className="error-banner">⚠️ {error}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="passengerName">Full Name</label>
                <input
                  id="passengerName"
                  type="text"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  placeholder="e.g. John Perera"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </div>

              {/* Price Breakdown */}
              <div className="booking-summary">
                <div className="summary-row">
                  <span>No. of Seats</span>
                  <span>{numSeats > 0 ? numSeats : "—"}</span>
                </div>
                <div className="summary-row">
                  <span>Selected Seats</span>
                  <span>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "—"}</span>
                </div>
                <div className="summary-row">
                  <span>1 Seat Price</span>
                  <span>Rs. {pricePerSeat.toLocaleString()}</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-total-row">
                  <span>Total Price</span>
                  <span className="summary-total">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="summary-row summary-sub">
                  <span>💳 Advance Payment (30%)</span>
                  <span>Rs. {advancePayment.toLocaleString()}</span>
                </div>
                <div className="summary-row summary-sub">
                  <span>🚌 Pay at Bus (70%)</span>
                  <span>Rs. {payAtBus.toLocaleString()}</span>
                </div>
              </div>

              <button className="confirm-btn" type="submit" disabled={submitLoading}>
                {submitLoading ? <><span className="btn-spinner" /> Confirming...</> : "Confirm Booking →"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SeatBookingPage;
