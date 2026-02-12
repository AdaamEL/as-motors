import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Menu, X, ChevronRight } from "lucide-react";
import logoClair from "../../styles/logo_clair.png";
import logoSombre from "../../styles/logo_sombre.png";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/vehicules", label: "Véhicules" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection for glassmorphism effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "glass bg-[var(--nav-bg)] border-b border-[var(--nav-border)] shadow-premium"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 relative z-10">
              <img src={logoClair} alt="AS Motors" className="h-16 sm:h-[4.25rem] block dark:hidden transition-all" />
              <img src={logoSombre} alt="AS Motors" className="h-16 sm:h-[4.25rem] hidden dark:block transition-all" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? "text-brand dark:text-gold bg-brand-50 dark:bg-gold-50/10"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
                  }`}
                >
                  {label}
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-brand dark:bg-gold rounded-full" />
                  )}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive("/profile")
                        ? "text-brand dark:text-gold bg-brand-50 dark:bg-gold-50/10"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
                    }`}
                  >
                    Profil
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive("/admin")
                          ? "text-brand dark:text-gold bg-brand-50 dark:bg-gold-50/10"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="ml-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-light shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </nav>

            {/* Right section: theme + hamburger */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden relative z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden
          bg-white dark:bg-navy-900 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                  isActive(to)
                    ? "text-brand dark:text-gold bg-brand-50 dark:bg-gold-50/10"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {label}
                <ChevronRight className="w-4 h-4 opacity-40" />
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                    isActive("/profile")
                      ? "text-brand dark:text-gold bg-brand-50 dark:bg-gold-50/10"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  Profil
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Admin
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Connexion
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              </>
            )}
          </nav>

          {/* Drawer footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-brand hover:bg-brand-light transition-all shadow-md"
              >
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;