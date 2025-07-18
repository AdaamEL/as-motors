import React, { useState } from "react";
import { sendMessage } from "../services/messageService";

const ContactPage = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendMessage({ nom, email, sujet, contenu });
      setSuccess(true);
      setNom("");
      setEmail("");
      setSujet("");
      setContenu("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setSuccess(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-gray-300 dark:border-gray-700 shadow-xl rounded-3xl p-8 md:p-12 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#6B1E1E] dark:text-[#6B1E1E]">
          Contactez-nous
        </h2>

        {success === true && (
          <p className="text-green-600 text-center font-medium">
            ✅ Message envoyé avec succès !
          </p>
        )}
        {success === false && (
          <p className="text-red-600 text-center font-medium">
            ❌ Une erreur est survenue. Veuillez réessayer.
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sujet"
            className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
          />
          <textarea
            placeholder="Votre message"
            className="w-full h-32 px-4 py-3 resize-none rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6B1E1E] hover:bg-[#5a1919] text-white font-semibold py-3 rounded-md transition"
        >
          Envoyer le message
        </button>
      </form>
    </section>
  );
};

export default ContactPage;
