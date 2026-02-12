import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import GoogleSignInButton from "../components/Auth/GoogleSignInButton";
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
          <div className="gold-accent mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Connexion</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Accédez à votre espace client</p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Adresse email</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="input-premium" />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Mot de passe</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className="input-premium" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
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

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="px-3 text-xs text-gray-400 dark:text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleSignInButton onCredential={(cred) => console.log("Google credential:", cred)} />
          </div>

          {/* Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-brand dark:text-gold hover:underline transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}