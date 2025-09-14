// src/pages/RegisterPage.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";

const pwdRules = [
  { key: "length", test: (s) => s.length >= 12, label: "Au moins 12 caractères" },
  { key: "upper", test: (s) => /[A-Z]/.test(s), label: "Une majuscule" },
  { key: "lower", test: (s) => /[a-z]/.test(s), label: "Une minuscule" },
  { key: "digit", test: (s) => /\d/.test(s), label: "Un chiffre" },
  { key: "special", test: (s) => /[^A-Za-z0-9]/.test(s), label: "Un caractère spécial" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const pwdOk = pwdRules.every((r) => r.test(password));
  const matchOk = password && password === confirm;

  const canSubmit =
    nom.trim() &&
    prenom.trim() &&
    email.trim() &&
    pwdOk &&
    matchOk &&
    consent &&
    !loading;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!canSubmit) {
      setErr("Veuillez corriger les champs indiqués.");
      return;
    }

    try {
      setLoading(true);

      await register({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        password,
        consent: true,
      });

      setOk("Compte créé avec succès. Redirection...");
      setTimeout(() => navigate("/login"), 900);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Erreur lors de l'inscription.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Créer un compte
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                autoComplete="family-name"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
                autoComplete="given-name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white"
              autoComplete="new-password"
              required
            />
            <ul className="mt-2 space-y-1 text-sm">
              {pwdRules.map((r) => {
                const ok = r.test(password);
                return (
                  <li
                    key={r.key}
                    className={`flex items-center gap-2 ${
                      ok ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        ok ? "bg-green-600 dark:bg-green-400" : "bg-gray-400"
                      }`}
                    />
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border dark:bg-gray-800 dark:text-white ${
                confirm.length > 0 && !matchOk ? "border-red-500" : ""
              }`}
              autoComplete="new-password"
              required
            />
            {confirm.length > 0 && !matchOk && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span className="text-gray-700 dark:text-gray-300">
              J’accepte la{" "}
              <Link to="/politique-de-confidentialite" className="underline">
                Politique de confidentialité
              </Link>{" "}
              et les{" "}
              <Link to="/cgu" className="underline">
                CGU
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded-md text-white transition ${
              canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          {err && <p className="text-sm text-red-600 dark:text-red-400 text-center">{err}</p>}
          {ok && <p className="text-sm text-green-600 dark:text-green-400 text-center">{ok}</p>}
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
