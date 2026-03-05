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
    <div className="min-h-screen bg-[var(--color-bg)] pt-28">
      {/* Header */}
      <div className="pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-5xl sm:text-6xl font-bold text-[var(--color-text)] mb-4">Contactez-nous</h1>
          <p className="text-xl text-[var(--color-text-muted)]">
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
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[var(--color-brand)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{text}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-3">Réseaux</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/as_motors75/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram AS Motors"
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.snapchat.com/add/as_motors75"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat AS Motors"
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
                >
                  <Ghost className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/33783366760"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp AS Motors"
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-5"
          >
            {success === true && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700">Message envoyé avec succès !</p>
              </div>
            )}
            {success === false && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">Une erreur est survenue. Veuillez réessayer.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Nom</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Sujet</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50" value={sujet} onChange={(e) => setSujet(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Message</label>
              <textarea
                className="w-full h-36 px-4 py-2.5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/50 resize-none"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              En envoyant ce formulaire, vous acceptez notre
              {" "}
              <Link to="/legal/privacy" className="text-[var(--color-brand)] hover:text-[var(--color-brand-light)] underline">politique de confidentialité</Link>.
            </p>

            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundColor: "var(--color-brand)" }}
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
