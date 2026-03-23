import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import SeatBookingPage from "./pages/SeatBookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminSchedulesPage from "./pages/AdminSchedulesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedules/:routeId" element={<SchedulePage />} />
          <Route path="/booking/:scheduleId" element={<SeatBookingPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />

          {/* Protected — admin only */}
          <Route path="/admin/bookings" element={
            <ProtectedAdminRoute><AdminBookingsPage /></ProtectedAdminRoute>
          } />
          <Route path="/admin/schedules" element={
            <ProtectedAdminRoute><AdminSchedulesPage /></ProtectedAdminRoute>
          } />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
