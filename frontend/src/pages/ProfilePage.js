import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
    if (user) {
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        mot_de_passe: "",
      });
    }
  }, [isLoading, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const confirmChange = window.confirm("Confirmez-vous la modification ?");
    if (!confirmChange) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour.");
      }

      setMessage("✅ Profil mis à jour avec succès !");
    } catch (err) {
      setError(err.message || "Erreur de mise à jour.");
    }
  };

  return (
    <section className="min-h-[calc(100vh-6rem)] px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white/80 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-2xl p-8 md:p-10">
        <h1 className="text-3xl font-bold text-center text-[#6B1E1E] dark:text-white mb-6">
          Mon Profil
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom :</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe :</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6B1E1E] hover:bg-[#5a1919] text-white py-3 rounded-md font-semibold transition"
          >
            Mettre à jour
          </button>
          {message && <p className="text-green-600 dark:text-green-400 text-sm text-center">{message}</p>}
          {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
