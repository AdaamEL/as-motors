import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Impossible de se connecter. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12 pt-28">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-3xl font-bold font-display text-[var(--color-text)]">Connexion</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">Accédez à votre espace client</p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Adresse email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Mot de passe</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundColor: "var(--color-brand)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Link */}
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-light)] underline transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}