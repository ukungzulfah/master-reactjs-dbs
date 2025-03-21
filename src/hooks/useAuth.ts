import { useState, useEffect } from "react";

export function useAuth<T extends object>() {
  const [user, setUser] = useState<T | null>(null);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem("user") || '{}'));
    }
  }, []);

  const login = (userData: T, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
}