import React, { useState } from "react";
import { clearLocalTrackingData } from "../services/analytics";

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/70 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
    <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-[var(--color-text)]">{title}</h2>
    <div className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">{children}</div>
  </section>
);

const CookiesPolicyPage = () => {
  const [message, setMessage] = useState("");

  const handleRevokeConsent = () => {
    localStorage.removeItem("cookieConsent");
    clearLocalTrackingData();
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: { revoked: true } }));
    setMessage("Vos preferences cookies ont ete reinitialisees. La banniere reapparaitra a votre prochaine navigation.");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24">
      <div className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[var(--color-brand)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[var(--color-brand-light)]/10 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--color-text)] mb-4">Politique de cookies</h1>
          <p className="text-lg text-[var(--color-text-muted)]">Informations sur l’usage des cookies et traceurs</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 sm:space-y-7">
        <Section title="Cookies essentiels">
          <p>Nous utilisons des cookies necessaires au bon fonctionnement du site (authentification, securite, preferences). Ils ne peuvent pas etre desactives car ils sont strictement necessaires.</p>
        </Section>

        <Section title="Cookies d’analyse (optionnels)">
          <p>Les cookies de mesure d'audience nous aident a comprendre les pages consultees et a ameliorer le site. Ils sont desactives par defaut et actifs uniquement apres consentement explicite.</p>
        </Section>

        <Section title="Finalites et base legale">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Essentiels: execution technique du service (interet legitime et necessite technique).</li>
            <li>Analytics: mesure d'audience et amelioration continue (consentement).</li>
          </ul>
        </Section>

        <Section title="Duree de conservation">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Choix de consentement: 6 mois maximum, puis nouvelle demande.</li>
            <li>Donnees de mesure d'audience: selon la configuration de l'outil analytics.</li>
          </ul>
        </Section>

        <Section title="Liste des traceurs">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Stockage local `cookieConsent`: conservation de vos choix.</li>
            <li>Traceurs de mesure d'audience (si acceptes): pages vues et parcours de navigation.</li>
          </ul>
        </Section>

        <Section title="Retrait du consentement">
          <p>Vous pouvez retirer votre consentement a tout moment. Les traceurs optionnels seront desactives immediatement.</p>
          <button
            onClick={handleRevokeConsent}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-brand)" }}
          >
            Reinitialiser mes preferences cookies
          </button>
          {message && <p className="mt-3 text-sm text-[var(--color-text-muted)]">{message}</p>}
        </Section>

        <Section title="Gestion des cookies">
          <p>Vous pouvez aussi configurer votre navigateur pour refuser ou supprimer les cookies. Cette action peut toutefois degrader certaines fonctionnalites essentielles du site.</p>
        </Section>

        <p className="text-xs text-[var(--color-text-muted)]/80 pt-3">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;