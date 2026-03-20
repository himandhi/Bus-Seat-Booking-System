import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function SeatBookingPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
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
      <p className="subtitle">Choose an available seat for your journey</p>

      {loading && <p>Loading seat layout...</p>}
      {error && <p className="error-text">{error}</p>}

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
    </div>
  );
}

export default SeatBookingPage;