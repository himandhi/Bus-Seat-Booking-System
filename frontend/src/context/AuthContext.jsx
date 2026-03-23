import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Try to restore session from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("busgo_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    // userData = { name, email, role: "user" | "admin" }
    setUser(userData);
    localStorage.setItem("busgo_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("busgo_user");
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
