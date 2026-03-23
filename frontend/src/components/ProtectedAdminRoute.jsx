import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps any admin-only route.
// If not logged in → redirect to /login
// If logged in but not admin → redirect to home
export default function ProtectedAdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
