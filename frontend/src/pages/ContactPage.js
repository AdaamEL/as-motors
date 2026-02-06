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
    <section className="flex items-center justify-center min-h-[calc(100vh-6rem)] px-4 bg-slate-50 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/90 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200 dark:border-slate-700 shadow-xl rounded-3xl p-8 md:p-12 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
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
            className="w-full px-4 py-3 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Sujet"
            className="w-full px-4 py-3 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
          />
          <textarea
            placeholder="Votre message"
            className="w-full h-32 px-4 py-3 resize-none rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3 rounded-md transition"
        >
          Envoyer le message
        </button>
      </form>
    </section>
  );
};

export default ContactPage;
