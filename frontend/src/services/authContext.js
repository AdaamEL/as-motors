import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = process.env.REACT_APP_API_URL || "https://as-motors.onrender.com/api";

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
    // Optionnel: purger la session au démarrage de l'app pour éviter les sessions "fantômes"
    // Si vous voulez TOUJOURS être déconnecté au rechargement, décommentez:
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        if (!decoded?.exp) return false;
        return Date.now() >= decoded.exp * 1000;
      } catch {
        return true;
      }
    };

    if (t && u) {
      if (isTokenExpired(t)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
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
    // Force le rechargement de la page pour nettoyer le cache
    window.location.href = "/login";
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
