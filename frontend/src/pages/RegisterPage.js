import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import { UserPlus, AlertCircle, Check, Circle } from "lucide-react";

const pwdRules = [
  { key: "length", test: (s) => s.length >= 12, label: "12 caractères minimum" },
  { key: "upper", test: (s) => /[A-Z]/.test(s), label: "1 majuscule" },
  { key: "lower", test: (s) => /[a-z]/.test(s), label: "1 minuscule" },
  { key: "digit", test: (s) => /[0-9]/.test(s), label: "1 chiffre" },
  { key: "special", test: (s) => /[!@#$%^&*]/.test(s), label: "1 caractère spécial (!@#$%^&*)" },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", password: "", telephone: "", adresse: "", consent: false,
  });
  const [pwdFocus, setPwdFocus] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (pwd) => pwdRules.every((r) => r.test(pwd));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validatePassword(formData.password)) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }
    if (!formData.consent) {
      setError("Veuillez accepter la politique de confidentialité.");
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12 pt-28">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="gold-accent mx-auto mb-6" />
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Déjà inscrit ?{" "}
            <Link to="/login" className="font-semibold text-brand dark:text-gold hover:underline transition-colors">
              Connectez-vous
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Prénom</label>
                <input name="prenom" type="text" required className="input-premium" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nom</label>
                <input name="nom" type="text" required className="input-premium" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
              <input name="email" type="email" required className="input-premium" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Téléphone</label>
                <input name="telephone" type="tel" required placeholder="06 12 34 56 78" className="input-premium" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Adresse</label>
                <input name="adresse" type="text" required placeholder="10 rue de la Paix, Paris" className="input-premium" onChange={handleChange} />
              </div>
            </div>

            {/* Password with rules */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                className="input-premium"
                onChange={handleChange}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />

              {pwdFocus && (
                <div className="absolute left-0 bottom-full mb-2 w-full p-4 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 shadow-premium z-20">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Critères du mot de passe :</p>
                  <ul className="space-y-1.5">
                    {pwdRules.map((rule) => {
                      const ok = rule.test(formData.password);
                      return (
                        <li key={rule.key} className={`flex items-center gap-2 text-xs ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}>
                          {ok ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <label htmlFor="consent" className="leading-relaxed">
                J’accepte la
                {" "}
                <Link to="/legal/privacy" className="text-brand dark:text-gold hover:underline">politique de confidentialité</Link>
                {" "}
                et les
                {" "}
                <Link to="/legal/terms" className="text-brand dark:text-gold hover:underline">CGU</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Inscription...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  S'inscrire
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;