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
import LegalMentionsPage from "./pages/LegalMentionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiesPolicyPage from "./pages/CookiesPolicyPage";
import TermsPage from "./pages/TermsPage";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import AuthProvider from "./services/authContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicules" element={<VehiculesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/vehicules/:id" element={<VehiculeDetail />} />
              <Route path="/legal/mentions" element={<LegalMentionsPage />} />
              <Route path="/legal/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/cookies" element={<CookiesPolicyPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
            </Routes>
          </main>

          <Footer />
          <CookieBanner />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
