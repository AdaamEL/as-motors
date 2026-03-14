import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sendMessage } from "../services/messageService";
import { AuthContext } from "../services/authContext";
import { Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail, Instagram, Ghost, MessageCircle, Music2, Clock3, ShieldCheck, CircleCheck, ChevronDown } from "lucide-react";

const DEMANDE_TYPES = [
  { value: "devis", label: "Demande de devis" },
  { value: "location", label: "Question location" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
];

const DEMANDE_SUBJECTS = {
  devis: "Demande de devis",
  location: "Question a propos d'une location",
  partenariat: "Proposition de partenariat",
  autre: "Demande d'information",
};

const ContactPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [demandeType, setDemandeType] = useState("devis");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [success, setSuccess] = useState(null);
  const [sending, setSending] = useState(false);

  const autoSubjects = useMemo(() => Object.values(DEMANDE_SUBJECTS), []);

  useEffect(() => {
    setSujet((prev) => {
      const trimmed = prev.trim();
      if (!trimmed || autoSubjects.includes(trimmed)) {
        return DEMANDE_SUBJECTS[demandeType];
      }
      return prev;
    });
  }, [demandeType, autoSubjects]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fullName = `${user.prenom || ""} ${user.nom || ""}`.trim();
    const fallbackName = user.nom || user.prenom || "";
    const prefilledName = fullName || fallbackName;

    setNom((prev) => (prev.trim() ? prev : prefilledName));
    setEmail((prev) => (prev.trim() ? prev : (user.email || "")));
  }, [isAuthenticated, user]);

  const isFormComplete =
    nom.trim().length > 0 &&
    email.trim().length > 0 &&
    sujet.trim().length > 0 &&
    contenu.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await sendMessage({ nom, email, sujet, contenu });
      setSuccess(true);
      const fullName = `${user?.prenom || ""} ${user?.nom || ""}`.trim();
      const fallbackName = user?.nom || user?.prenom || "";
      setNom(isAuthenticated ? (fullName || fallbackName) : "");
      setEmail(isAuthenticated ? (user?.email || "") : "");
      setSujet(DEMANDE_SUBJECTS[demandeType]);
      setContenu("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setSuccess(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="pt-32 pb-14 sm:pt-36 sm:pb-16 px-4 border-b" style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.24em] font-semibold mb-4 text-center" style={{ color: "var(--color-text-muted)" }}>
            Contact
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-3xl font-semibold text-center leading-[1.04]" style={{ color: "var(--color-text)" }}>
            Parlons de votre prochaine location.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-center max-w-3xl mx-auto leading-snug" style={{ color: "var(--color-text-muted)" }}>
            Expliquez votre besoin en quelques lignes. Notre equipe vous repond rapidement avec une proposition claire.
          </p>

          <div className="mt-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em]" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
              <Clock3 className="w-3.5 h-3.5" style={{ color: "var(--color-brand)" }} />
              Reponse en general sous 24h ouvrees
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          <aside className="lg:col-span-4 space-y-5">
            <section className="rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
              <h2 className="font-display text-2xl font-semibold" style={{ color: "var(--color-text)" }}>Infos directes</h2>
              <div className="mt-4 space-y-4">
            {[
              { icon: MapPin, title: "Adresse", text: "Paris, France" },
              { icon: Phone, title: "Téléphone", text: "+33 (0)7 83 36 67 60" },
              { icon: Mail, title: "Email", text: "contact@as-motors.fr" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-2xl border" style={{ borderColor: "var(--color-border)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(196,88,28,0.1)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--color-brand)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{title}</p>
                  <p className="text-sm leading-snug mt-0.5" style={{ color: "var(--color-text-muted)" }}>{text}</p>
                </div>
              </div>
            ))}
              </div>
            </section>

            <section className="rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-text)" }}>Reseaux</h3>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.instagram.com/as_motors75/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram AS Motors"
                  className="p-2.5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)" }}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.snapchat.com/add/as_motors75"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat AS Motors"
                  className="p-2.5 rounded-xl text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "#FFFC00" }}
                >
                  <Ghost className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/33783366760"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp AS Motors"
                  className="p-2.5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@as.motors75"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok AS Motors"
                  className="p-2.5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #0F0F0F, #1F1F1F)" }}
                >
                  <Music2 className="w-4 h-4" />
                </a>
              </div>
            </section>

            <section className="rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--color-text)" }}>Ce qu'il faut preparer</h3>
              <ul className="space-y-2.5 text-sm leading-snug" style={{ color: "var(--color-text-muted)" }}>
                <li className="flex items-start gap-2"><CircleCheck className="w-4 h-4 mt-0.5" style={{ color: "var(--color-brand)" }} /><span>Vos dates souhaitees</span></li>
                <li className="flex items-start gap-2"><CircleCheck className="w-4 h-4 mt-0.5" style={{ color: "var(--color-brand)" }} /><span>Le modele qui vous interesse</span></li>
                <li className="flex items-start gap-2"><CircleCheck className="w-4 h-4 mt-0.5" style={{ color: "var(--color-brand)" }} /><span>Le contexte de location (pro/perso)</span></li>
              </ul>
            </section>
          </aside>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 p-6 sm:p-8 rounded-3xl border space-y-5"
            style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "var(--color-text)" }}>
                Ecrivez-nous
              </h2>
              <div className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-text-muted)" }}>
                <ShieldCheck className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
                Donnees traitees de maniere confidentielle
              </div>
            </div>

            {success === true && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-700">Message envoye avec succes !</p>
              </div>
            )}
            {success === false && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">Une erreur est survenue. Veuillez reessayer.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Type de demande</label>
              <div className="relative">
                <select
                  className="input-premium appearance-none pr-11"
                  value={demandeType}
                  onChange={(e) => setDemandeType(e.target.value)}
                >
                  {DEMANDE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <ChevronDown className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Nom</label>
                <input type="text" className="input-premium" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Email</label>
                <input type="email" className="input-premium" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Sujet</label>
              <input type="text" className="input-premium" value={sujet} onChange={(e) => setSujet(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Message</label>
              <textarea
                className="input-premium !h-36 resize-none"
                value={contenu}
                onChange={(e) => setContenu(e.target.value.slice(0, 800))}
                required
              />
              <div className="mt-1 text-right text-xs" style={{ color: "var(--color-text-muted)" }}>
                {contenu.length}/800
              </div>
            </div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              En envoyant ce formulaire, vous acceptez notre
              {" "}
              <Link to="/legal/privacy" className="hover:underline" style={{ color: "var(--color-brand)" }}>politique de confidentialité</Link>.
            </p>

            <button
              type="submit"
              disabled={sending || !isFormComplete}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
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

            <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
              Sans engagement. Nous revenons vers vous avec une proposition adaptee.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
