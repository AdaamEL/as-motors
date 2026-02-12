import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendMessage } from "../services/messageService";
import { Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail, Instagram, Ghost, MessageCircle } from "lucide-react";

const ContactPage = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [success, setSuccess] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await sendMessage({ nom, email, sujet, contenu });
      setSuccess(true);
      setNom(""); setEmail(""); setSujet(""); setContenu("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setSuccess(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-4">Contactez-nous</h1>
          <p className="section-subheading">
            Une question, une demande spéciale ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, title: "Adresse", text: "Paris, France" },
              { icon: Phone, title: "Téléphone", text: "+33 (0)7 83 36 67 60" },
              { icon: Mail, title: "Email", text: "contact@as-motors.fr" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand dark:text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{text}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Réseaux</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/as_motors75/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.snapchat.com/add/as_motors75"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <Ghost className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/33783366760"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium space-y-5"
          >
            {success === true && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700 dark:text-emerald-400">Message envoyé avec succès !</p>
              </div>
            )}
            {success === false && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">Une erreur est survenue. Veuillez réessayer.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nom</label>
                <input type="text" className="input-premium" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                <input type="email" className="input-premium" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Sujet</label>
              <input type="text" className="input-premium" value={sujet} onChange={(e) => setSujet(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Message</label>
              <textarea
                className="input-premium !h-36 resize-none"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              En envoyant ce formulaire, vous acceptez notre
              {" "}
              <Link to="/legal/privacy" className="text-brand dark:text-gold hover:underline">politique de confidentialité</Link>.
            </p>

            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
