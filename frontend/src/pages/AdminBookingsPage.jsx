import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data);
    } catch (err) {
      setError("Failed to load bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking.");
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <button className="secondary-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 className="title">Admin - All Bookings</h1>
      <p className="subtitle">View and manage bus seat bookings</p>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && bookings.length === 0 && (
        <p className="empty-text">No bookings found.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking ID</th>
                <th>Passenger Name</th>
                <th>Phone</th>
                <th>Seat</th>
                <th>Status</th>
                <th>Schedule ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.bookingId}</td>
                  <td>{booking.passengerName}</td>
                  <td>{booking.phoneNumber}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{booking.status}</td>
                  <td>{booking.schedule?.id}</td>
                  <td>
                    {booking.status === "BOOKED" ? (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="cancelled-label">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;