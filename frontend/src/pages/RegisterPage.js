import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";

// Tes règles de validation existantes
const pwdRules = [
  { key: "length", test: (s) => s.length >= 8, label: "8 caractères minimum" },
  { key: "upper", test: (s) => /[A-Z]/.test(s), label: "1 majuscule" },
  { key: "lower", test: (s) => /[a-z]/.test(s), label: "1 minuscule" },
  { key: "digit", test: (s) => /[0-9]/.test(s), label: "1 chiffre" },
  { key: "special", test: (s) => /[!@#$%^&*]/.test(s), label: "1 caractère spécial (!@#$%^&*)" },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "", // Ajouté pour le backend
    adresse: ""    // Ajouté pour le backend
  });

  const [pwdFocus, setPwdFocus] = useState(false);
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return pwdRules.every((rule) => rule.test(pwd));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(formData.password)) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
      return;
    }

    try {
      await register(formData);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800/80 p-10 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ou <Link to="/login" className="font-medium text-blue-700 dark:text-blue-400 hover:text-blue-600 transition-colors">connectez-vous</Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prénom</label>
              <input
                name="prenom"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nom</label>
              <input
                name="nom"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              onChange={handleChange}
            />
          </div>

          {/* Nouveaux champs requis par le backend */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Téléphone *</label>
              <input
              name="telephone"
              type="tel"
              required
              placeholder="06 12 34 56 78"
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Adresse complète *</label>
              <input
              name="adresse"
              type="text"
              required
              placeholder="10 rue de la Paix, Paris"
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              onChange={handleChange}
              />
            </div>
          </div>

          {/* Champ mot de passe avec ta logique de validation visuelle */}
          <div className="relative">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-1"
              onChange={handleChange}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            
            {/* Popup des règles qui s'affiche au focus */}
            {pwdFocus && (
              <div className="absolute left-0 bottom-full mb-2 w-full bg-white dark:bg-slate-900 p-3 rounded shadow-lg border border-slate-200 dark:border-slate-700 text-xs z-10">
                <p className="font-bold mb-2 text-slate-700 dark:text-slate-200">Conditions du mot de passe :</p>
                <ul className="space-y-1">
                  {pwdRules.map((rule) => {
                    const isValid = rule.test(formData.password);
                    return (
                      <li key={rule.key} className={`flex items-center ${isValid ? "text-green-600" : "text-slate-500"}`}>
                        <span className={`mr-2 ${isValid ? "text-green-500" : "text-slate-400"}`}>
                          {isValid ? "✔" : "○"}
                        </span>
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;