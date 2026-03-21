import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import SeatBookingPage from "./pages/SeatBookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedules/:routeId" element={<SchedulePage />} />
        <Route path="/booking/:scheduleId" element={<SeatBookingPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;