import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stocke les infos de l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Indique si les données utilisateur sont en cours de chargement

  // Vérifie si un utilisateur est connecté au chargement de l'application
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Les données utilisateur ont été chargées
  }, []);

  // Fonction pour se connecter
  const login = (userData) => {
    setUser(userData.user); // Stocke les infos utilisateur
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData.user)); // Stocke les infos utilisateur
    localStorage.setItem("token", userData.token); // Stocke le token JWT
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;