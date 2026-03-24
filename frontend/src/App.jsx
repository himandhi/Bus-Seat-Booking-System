import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import RoutesListingPage from "./pages/RoutesListingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedules/:routeId" element={<SchedulePage />} />
        <Route path="/booking/:scheduleId" element={<SeatBookingPage />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/routes-listing" element={<RoutesListingPage />} />

        {/* Protected — admin only */}
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedAdminRoute><AdminBookingsPage /></ProtectedAdminRoute>
        } />
        <Route path="/admin/schedules" element={
          <ProtectedAdminRoute><AdminSchedulesPage /></ProtectedAdminRoute>
        } />
      </Routes>
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
