import React, { useState, useContext } from "react";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      alert("Échec de connexion");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-300 dark:border-gray-700 shadow-xl rounded-3xl p-8 md:p-12 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#6B1E1E] dark:text-[#6B1E1E]">Connexion</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6B1E1E] hover:bg-[#5a1919] text-white font-semibold py-3 rounded-md transition"
        >
          Se connecter
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
