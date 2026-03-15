import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

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

import HomeHeader from "./components/Home/HomeHeader";
import HomeNav from "./components/Home/HomeNav";
import Footer from "./components/Footer/Footer";
import CookieBanner from "./components/CookieBanner/CookieBanner";
import AuthProvider from "./services/authContext";

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      {!isHomePage && <HomeHeader onMenuOpen={() => setMenuOpen(true)} />}
      {!isHomePage && <HomeNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}

      <main className={`flex-grow ${!isHomePage ? "pt-3 sm:pt-0" : ""}`}>
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

      {!isHomePage && <Footer />}
      {!isHomePage && <CookieBanner />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
