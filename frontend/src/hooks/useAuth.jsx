import { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/client";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("onestop_user");
    const token = localStorage.getItem("onestop_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { clearAuth(); }
    }
    setLoading(false);
  }, []);

  function clearAuth() {
    localStorage.removeItem("onestop_user");
    localStorage.removeItem("onestop_token");
    localStorage.removeItem("onestop_comparison");
  }

  const login = async (email, password) => {
    const { data, error } = await api.post("/auth/login", { email, password });
    if (error) return { success: false, error };
    localStorage.setItem("onestop_token", data.token);
    localStorage.setItem("onestop_user", JSON.stringify(data.user));
    setUser(data.user);
    return { success: true, user: data.user };
  };

  const register = async (formData) => {
    const { data, error } = await api.post("/auth/register", formData);
    if (error) return { success: false, error };
    localStorage.setItem("onestop_token", data.token);
    localStorage.setItem("onestop_user", JSON.stringify(data.user));
    setUser(data.user);
    return { success: true, user: data.user };
  };

  const updateProfile = (profileData) => {
    const updated = { ...user, ...profileData };
    setUser(updated);
    localStorage.setItem("onestop_user", JSON.stringify(updated));
  };

  const completeAssessment = () => {
    const updated = { ...user, assessmentCompleted: true };
    setUser(updated);
    localStorage.setItem("onestop_user", JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  // Helpers derived from JWT payload
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, updateProfile, completeAssessment, logout, isAdmin, isStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
