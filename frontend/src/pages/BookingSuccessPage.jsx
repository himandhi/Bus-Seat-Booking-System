import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccessPage.css";

function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  // No booking data
  if (!state) {
    return (
      <div className="bsp-page">
        <div className="bsp-card">
          <div className="bsp-error-icon">❌</div>
          <h1>No Booking Data Found</h1>
          <p>Please create a booking first.</p>
          <button className="bsp-home-btn" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Multi-seat booking (new format)
  const isMulti = Array.isArray(state.bookings);

  // Extract data depending on format
  const bookings       = isMulti ? state.bookings : [state];
  const passengerName  = isMulti ? state.passengerName  : state.passengerName;
  const phoneNumber    = isMulti ? state.bookings[0]?.phoneNumber : state.phoneNumber;
  const selectedSeats  = isMulti ? state.selectedSeats  : [state.seatNumber];
  const totalPrice     = isMulti ? state.totalPrice     : state.totalPrice ?? 0;
  const advancePayment = isMulti ? state.advancePayment : state.advancePayment ?? 0;
  const payAtBus       = isMulti ? state.payAtBus       : state.payAtBus ?? 0;
  const schedule       = isMulti ? state.schedule       : null;
  const scheduleId     = isMulti ? state.schedule?.id   : state.scheduleId;

  const status = bookings[0]?.status ?? "BOOKED";

  return (
    <div className="bsp-page">
      <div className="bsp-card">

        {/* ── Success Header ── */}
        <div className="bsp-success-header">
          <div className="bsp-check-circle">✓</div>
          <h1 className="bsp-title">Booking Confirmed!</h1>
          <p className="bsp-subtitle">
            Your {selectedSeats.length > 1 ? `${selectedSeats.length} seats have` : "seat has"} been successfully booked.
          </p>
        </div>

        {/* ── Booking IDs (multi-seat shows all) ── */}
        <div className="bsp-booking-ids">
          {bookings.map((b, i) => (
            <div className="bsp-id-badge" key={i}>
              <span className="bsp-id-label">Booking ID</span>
              <span className="bsp-id-value">{b.bookingId}</span>
            </div>
          ))}
        </div>

        {/* ── Journey Details ── */}
        {schedule && (
          <div className="bsp-section">
            <h3 className="bsp-section-title">🚌 Journey Details</h3>
            <div className="bsp-detail-row">
              <span>Route</span>
              <span>{schedule.route?.fromCity} → {schedule.route?.toCity}</span>
            </div>
            <div className="bsp-detail-row">
              <span>Bus Number</span>
              <span>{schedule.busNumber}</span>
            </div>
            <div className="bsp-detail-row">
              <span>Travel Date</span>
              <span>{schedule.travelDate}</span>
            </div>
            <div className="bsp-detail-row">
              <span>Departure</span>
              <span>{schedule.departureTime}</span>
            </div>
          </div>
        )}

        {/* ── Passenger Details ── */}
        <div className="bsp-section">
          <h3 className="bsp-section-title">👤 Passenger Details</h3>
          <div className="bsp-detail-row">
            <span>Full Name</span>
            <span>{passengerName}</span>
          </div>
          <div className="bsp-detail-row">
            <span>Phone Number</span>
            <span>{phoneNumber}</span>
          </div>
          <div className="bsp-detail-row">
            <span>No. of Seats</span>
            <span>{selectedSeats.length}</span>
          </div>
          <div className="bsp-detail-row">
            <span>Selected Seats</span>
            <span>{selectedSeats.map(s => `Seat ${s}`).join(", ")}</span>
          </div>
          <div className="bsp-detail-row">
            <span>Status</span>
            <span className={`bsp-status bsp-status-${status.toLowerCase()}`}>
                    {status === "PENDING" ? "⏳ Pending Confirmation" :
                     status === "BOOKED"  ? "✅ Confirmed" :
                     status === "RESERVED" ? "📌 Reserved" :
                     status === "CANCELLED" ? "❌ Cancelled" : status}
                  </span>
          </div>
        </div>

        {/* ── Payment Breakdown ── */}
        <div className="bsp-section bsp-payment-section">
          <h3 className="bsp-section-title">💰 Payment Summary</h3>
          <div className="bsp-detail-row bsp-total-row">
            <span>Total Price</span>
            <span className="bsp-price-total">Rs. {totalPrice.toLocaleString()}</span>
          </div>
          <div className="bsp-detail-row">
            <span>💳 Advance Payment (30%)</span>
            <span className="bsp-price-advance">Rs. {advancePayment.toLocaleString()}</span>
          </div>
          <div className="bsp-detail-row">
            <span>🚌 Pay at Bus (70%)</span>
            <span>Rs. {payAtBus.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Notice ── */}
        <div className="bsp-notice">
          ⏳ Your booking is <strong>pending confirmation</strong> by the admin. Once confirmed, please pay <strong>Rs. {advancePayment.toLocaleString()}</strong> as advance payment. The remaining <strong>Rs. {payAtBus.toLocaleString()}</strong> is payable on the bus.
        </div>

        {/* ── Actions ── */}
        <div className="bsp-actions">
          <button className="bsp-home-btn" onClick={() => navigate("/")}>
            🏠 Back to Home
          </button>
          <button className="bsp-again-btn" onClick={() => navigate(`/booking/${scheduleId}`)}>
            + Book Another Ticket
          </button>
        </div>

      </div>
    </div>
  );
}

export default BookingSuccessPage;
