import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import VehiculesPage from "./pages/VehiculesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import VehiculeDetail from "./pages/VehiculeDetailPage";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AuthProvider from "./services/authContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />

          <main className="flex-grow px-4 sm:px-6 md:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicules" element={<VehiculesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/vehicules/:id" element={<VehiculeDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
