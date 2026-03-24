import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── User session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("busgo_user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── Dark mode — only persists if admin, resets on logout
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("busgo_user");
    const savedUser = saved ? JSON.parse(saved) : null;
    // Only restore dark mode if user is admin
    if (savedUser?.role === "admin") {
      return localStorage.getItem("busgo_dark") === "true";
    }
    return false;
  });

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  // ── Apply dark mode to entire document
  useEffect(() => {
    if (isAdmin && darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode, isAdmin]);

  const toggleDarkMode = () => {
    if (!isAdmin) return; // only admin can toggle
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("busgo_dark", next);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("busgo_user", JSON.stringify(userData));
    // Restore dark mode preference on login if admin
    if (userData.role === "admin") {
      const savedDark = localStorage.getItem("busgo_dark") === "true";
      setDarkMode(savedDark);
    }
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
