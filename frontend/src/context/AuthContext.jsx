import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── User session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("busgo_user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── Dark mode — available for ANY logged-in user (admin or user)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("busgo_user");
    const savedUser = saved ? JSON.parse(saved) : null;
    // Restore dark mode for any logged-in user
    if (savedUser) {
      return localStorage.getItem("busgo_dark") === "true";
    }
    return false;
  });

  const isAdmin    = user?.role === "admin";
  const isLoggedIn = !!user;

  // ── Apply dark mode to entire document whenever it changes
  useEffect(() => {
    if (isLoggedIn && darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode, isLoggedIn]);

  // ── Toggle dark mode — available to any logged-in user
  const toggleDarkMode = () => {
    if (!isLoggedIn) return; // must be logged in
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("busgo_dark", String(next));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("busgo_user", JSON.stringify(userData));
    // Restore this user's dark mode preference on login
    const savedDark = localStorage.getItem("busgo_dark") === "true";
    setDarkMode(savedDark);
  };

  const logout = () => {
    setUser(null);
    setDarkMode(false);
    localStorage.removeItem("busgo_user");
    localStorage.removeItem("busgo_dark");
    document.documentElement.removeAttribute("data-theme");
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isAdmin, isLoggedIn,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
