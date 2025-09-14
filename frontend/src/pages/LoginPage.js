import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = email.trim() && password && !loading;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!canSubmit) return;
    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      navigate("/");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Erreur lors de la connexion.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleCredential = async (credential) => {
    setErr("");
    try {
      setLoading(true);
      await loginWithGoogle(credential);
      navigate("/");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Connexion Google échouée.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Se connecter</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded-md text-white transition ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {err && <p className="text-sm text-red-600 dark:text-red-400 text-center">{err}</p>}
        </form>

        {/* CTA Inscription */}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="underline">
            Inscrivez-vous ici
          </Link>
          .
        </p>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-500 dark:text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Google Sign-In */}
        <GoogleSignInButton onCredential={onGoogleCredential} />
      </div>
    </div>
  );
}