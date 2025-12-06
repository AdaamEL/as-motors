import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const API = process.env.REACT_APP_API_URL || "https://as-motors.onrender.com";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setIsAuthenticated(true);
      try { setUser(JSON.parse(u)); } catch {}
    }
  }, []);

  const login = async ({ email, password }) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // NEW: on étend register pour nom + prenom + consent
  const register = async ({ nom, prenom, email, password, consent }) => {
    // Le backend doit accepter ces champs.
    await axios.post(`${API}/auth/register`, {
      nom,
      prenom,
      email,
      password,
      consent: !!consent,
    });
    // pas de login auto → écran “inscription OK”, puis redirection login
  };

  const loginWithGoogle = async (credential) => {
    const res = await axios.post(`${API}/auth/google`, { credential });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
