import { useLocation, useNavigate } from "react-router-dom";

function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="page-container">
        <div className="success-page-card">
          <h1 className="title">No Booking Data Found</h1>
          <p className="subtitle">Please create a booking first.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const {
    bookingId,
    passengerName,
    phoneNumber,
    seatNumber,
    status,
    scheduleId,
    message,
  } = bookingData;

  return (
    <div className="page-container">
      <div className="success-page-card">
        <h1 className="success-title">Booking Confirmed</h1>
        <p className="subtitle">{message || "Your booking was created successfully."}</p>

        <div className="confirmation-details">
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p><strong>Passenger Name:</strong> {passengerName}</p>
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
          <p><strong>Seat Number:</strong> {seatNumber}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Schedule ID:</strong> {scheduleId}</p>
        </div>

        <div className="action-btn-group">
          <button className="primary-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate(`/booking/${scheduleId}`)}
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccessPage;