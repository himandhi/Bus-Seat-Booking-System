import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import SeatBookingPage from "./pages/SeatBookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminSchedulesPage from "./pages/AdminSchedulesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Header appears on every page */}
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedules/:routeId" element={<SchedulePage />} />
        <Route path="/booking/:scheduleId" element={<SeatBookingPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
