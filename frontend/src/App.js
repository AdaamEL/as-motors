import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import VehiculesPage from './pages/VehiculesPage/VehiculesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AdminPage from './pages/AdminPage/AdminPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AuthProvider  from "./services/authContext";
import VehiculeDetail from './pages/VehiculeDetailPage/VehiculeDetailPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicules" element={<VehiculesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vehicules/:id" element={<VehiculeDetail />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
