import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { AuthContext } from "../../services/authContext";

const HomeNav = ({ isOpen, onClose, isHomePage = false }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        style={{
          paddingTop: "var(--safe-area-top)"
        }}
        className={`fixed top-0 left-0 h-[100dvh] w-64 max-w-[74vw] sm:w-72 sm:max-w-[80vw] z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${
            isHomePage
              ? "bg-[color:rgba(15,15,15,0.96)] text-[var(--color-surface)] border-r border-[color:rgba(214,214,212,0.2)]"
              : "bg-[var(--color-surface)] text-[var(--color-text)]"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-4 sm:px-5 sm:py-5 border-b ${
            isHomePage ? "border-[color:rgba(214,214,212,0.2)]" : "border-[var(--color-border)]"
          }`}>
            <button
              onClick={onClose}
              className={`flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                isHomePage
                  ? "text-[color:rgba(214,214,212,0.76)] hover:text-[var(--color-surface)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
              }`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              CLOSE
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto py-5 px-4 sm:py-6 sm:px-5 space-y-1.5 sm:space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className={`block px-3 py-3 text-2xl sm:text-3xl font-bold transition-colors ${
                isHomePage
                  ? "text-[var(--color-surface)] hover:text-[var(--color-brand)]"
                  : "text-[var(--color-text)] hover:text-[var(--color-brand)]"
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/vehicules"
              onClick={onClose}
              className={`block px-3 py-3 text-2xl sm:text-3xl font-bold transition-colors ${
                isActive("/vehicules")
                  ? isHomePage
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-brand)]"
                  : isHomePage
                    ? "text-[var(--color-surface)] hover:text-[var(--color-brand)]"
                    : "text-[var(--color-text)] hover:text-[var(--color-brand)]"
              }`}
            >
              Véhicules
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className={`block px-3 py-3 text-2xl sm:text-3xl font-bold transition-colors ${
                isActive("/contact")
                  ? isHomePage
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-brand)]"
                  : isHomePage
                    ? "text-[var(--color-surface)] hover:text-[var(--color-brand)]"
                    : "text-[var(--color-text)] hover:text-[var(--color-brand)]"
              }`}
            >
              Contact
            </Link>

            {isAuthenticated && (
              <>
                <div className={`h-px my-4 sm:my-6 ${
                  isHomePage ? "bg-[color:rgba(214,214,212,0.2)]" : "bg-[var(--color-border)]"
                }`} />
                <Link
                  to="/profile"
                  onClick={onClose}
                  className={`block px-3 py-3 text-2xl sm:text-3xl font-bold transition-colors ${
                    isActive("/profile")
                      ? isHomePage
                        ? "text-[var(--color-brand)]"
                        : "text-[var(--color-brand)]"
                      : isHomePage
                        ? "text-[var(--color-surface)] hover:text-[var(--color-brand)]"
                        : "text-[var(--color-text)] hover:text-[var(--color-brand)]"
                  }`}
                >
                  Profil
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className={`block px-3 py-3 text-2xl sm:text-3xl font-bold transition-colors ${
                      isActive("/admin")
                        ? isHomePage
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-brand)]"
                        : isHomePage
                          ? "text-[var(--color-surface)] hover:text-[var(--color-brand)]"
                          : "text-[var(--color-text)] hover:text-[var(--color-brand)]"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className={`px-4 py-4 sm:px-5 sm:py-5 border-t space-y-2.5 sm:space-y-3 ${
            isHomePage ? "border-[color:rgba(214,214,212,0.2)]" : "border-[var(--color-border)]"
          }`}>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  onClose();
                }}
                className={`w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  isHomePage
                    ? "text-[var(--color-surface)] hover:text-white bg-[color:rgba(214,214,212,0.08)] hover:bg-[color:rgba(214,214,212,0.16)] border border-[color:rgba(214,214,212,0.35)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] bg-[var(--color-brand)]/5 hover:bg-[var(--color-brand)]/10"
                }`}
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className={`block w-full text-center px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    isHomePage
                      ? "text-[var(--color-surface)] hover:text-white hover:bg-[color:rgba(214,214,212,0.08)] border border-[color:rgba(214,214,212,0.35)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className={`block w-full text-center px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                    isHomePage
                      ? "text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                      : "text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90"
                  }`}
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeNav;
