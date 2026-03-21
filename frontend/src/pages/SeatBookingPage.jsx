import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [bookingId, setBookingId] = useState("");

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
    setSuccessMessage("");
    setBookingId("");
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
    setSuccessMessage("");
    setBookingId("");

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

      setSuccessMessage(response.data.message || "Booking created successfully.");
      setBookingId(response.data.bookingId || "");

      setPassengerName("");
      setPhoneNumber("");
      setSelectedSeat(null);

      await fetchBookedSeats();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create booking.";
      setError(message);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSeats = () => {
    if (!schedule) return null;

    const seats = [];
    for (let i = 1; i <= schedule.totalSeats; i++) {
      let seatClass = "seat available-seat";

      if (bookedSeats.includes(i)) {
        seatClass = "seat booked-seat";
      } else if (selectedSeat === i) {
        seatClass = "seat selected-seat";
      }

      seats.push(
        <button
          key={i}
          type="button"
          className={seatClass}
          onClick={() => handleSeatClick(i)}
          disabled={bookedSeats.includes(i)}
        >
          {i}
        </button>
      );
    }

    return seats;
  };

  return (
    <div className="page-container">
      <button className="secondary-btn" onClick={handleBack}>
        ← Back to Schedules
      </button>

      <h1 className="title">Select Your Seat</h1>
      <p className="subtitle">Choose an available seat and enter passenger details</p>

      {loading && <p>Loading seat layout...</p>}
      {error && <p className="error-text">{error}</p>}
      {successMessage && (
        <div className="success-box">
          <h3>{successMessage}</h3>
          {bookingId && <p><strong>Booking ID:</strong> {bookingId}</p>}
        </div>
      )}

      {schedule && (
        <div className="booking-info-card">
          <h3>Bus Number: {schedule.busNumber}</h3>
          <p>
            <strong>Date:</strong> {schedule.travelDate}
          </p>
          <p>
            <strong>Departure Time:</strong> {schedule.departureTime}
          </p>
          <p>
            <strong>Total Seats:</strong> {schedule.totalSeats}
          </p>
        </div>
      )}

      <div className="seat-legend">
        <div className="legend-item">
          <span className="legend-box available-seat"></span> Available
        </div>
        <div className="legend-item">
          <span className="legend-box booked-seat"></span> Booked
        </div>
        <div className="legend-item">
          <span className="legend-box selected-seat"></span> Selected
        </div>
      </div>

      <div className="seat-grid">{renderSeats()}</div>

      {selectedSeat && (
        <div className="selected-seat-box">
          <h3>Selected Seat: {selectedSeat}</h3>
          <p>You selected seat number {selectedSeat}.</p>
        </div>
      )}

      <form className="booking-form" onSubmit={handleBookingSubmit}>
        <h2>Passenger Details</h2>

        <div className="form-group">
          <label>Passenger Name</label>
          <input
            type="text"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="Enter passenger name"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <button className="primary-btn full-width-btn" type="submit" disabled={submitLoading}>
          {submitLoading ? "Confirming Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default SeatBookingPage;