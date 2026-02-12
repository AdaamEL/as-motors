import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{children}</div>
  </section>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-4">Conditions générales d’utilisation</h1>
          <p className="section-subheading">Cadre contractuel de la réservation</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Section title="Objet">
          <p>Les présentes CGU encadrent l’utilisation du site et les demandes de réservation de véhicules.</p>
        </Section>

        <Section title="Conditions d’accès">
          <ul className="list-disc pl-5 space-y-1">
            <li>Âge minimum et permis de conduire valide</li>
            <li>Informations exactes lors de l’inscription</li>
          </ul>
        </Section>

        <Section title="Réservation et paiement">
          <p>Les demandes sont soumises à validation. Le montant final peut dépendre du devis.</p>
        </Section>

        <Section title="Annulation et remboursement">
          <p>Les conditions d’annulation et de remboursement sont précisées lors de la confirmation. En cas d’annulation tardive, des frais peuvent s’appliquer.</p>
        </Section>

        <Section title="Annulation et modification">
          <p>Les conditions d’annulation peuvent varier selon la réservation. Contactez-nous pour toute modification.</p>
        </Section>

        <Section title="Assurance et responsabilité">
          <p>Le client doit respecter les conditions d’usage du véhicule. Les dommages et infractions restent à la charge du conducteur.</p>
        </Section>

        <Section title="Dépôt de garantie">
          <p>Un dépôt de garantie peut être demandé selon le véhicule et la durée. Le montant et les modalités sont indiqués dans le devis.</p>
        </Section>

        <Section title="Limitation de responsabilité">
          <p>AS Motors ne saurait être tenue responsable des dommages indirects résultant de l’utilisation du site ou du véhicule.</p>
        </Section>

        <Section title="Support">
          <p>Pour toute question : <strong>contact@as-motors.fr</strong></p>
        </Section>

        <p className="text-xs text-gray-400 dark:text-gray-500">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default TermsPage;