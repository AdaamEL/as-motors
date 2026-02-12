import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{children}</div>
  </section>
);

const CookiesPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-4">Politique cookies</h1>
          <p className="section-subheading">Informations sur l’usage des cookies et traceurs</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Section title="Cookies essentiels">
          <p>Nous utilisons des cookies nécessaires au bon fonctionnement du site (authentification, sécurité, préférences).</p>
        </Section>

        <Section title="Cookies d’analyse (optionnels)">
          <p>Ces cookies nous aident à améliorer l’expérience utilisateur. Ils ne sont déposés qu’après consentement.</p>
        </Section>

        <Section title="Retrait du consentement">
          <p>Vous pouvez modifier vos préférences en supprimant le cookie de consentement dans votre navigateur ou via notre bannière.</p>
        </Section>

        <Section title="Gestion des cookies">
          <p>Vous pouvez configurer votre navigateur pour refuser ou supprimer les cookies.</p>
        </Section>

        <p className="text-xs text-gray-400 dark:text-gray-500">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;