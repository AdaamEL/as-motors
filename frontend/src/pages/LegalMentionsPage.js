import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
    <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{children}</div>
  </section>
);

const LegalMentionsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-4">Mentions légales</h1>
          <p className="section-subheading">Informations légales de l’éditeur et de l’hébergeur</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Section title="Éditeur du site">
          <p><strong>AS Motor's SAS</strong></p>
          <p>Raison sociale : AS Motor's SAS</p>
          <p>Forme juridique : SAS</p>
          <p>Capital social : 1 000 €</p>
          <p>RCS / SIRET : Siren 988 597 118</p>
          <p>TVA intracommunautaire : <em>[à compléter]</em></p>
          <p>Adresse : 15 rue du Louvre, 75001 Paris</p>
          <p>Email : contact@as-motors.fr</p>
          <p>Téléphone : +33 (0)7 83 36 67 60</p>
          <p>Directeur de publication : EL OUNISSI Sofiane</p>
        </Section>

        <Section title="Hébergement">
          <p>Netlify, Inc.</p>
          <p>2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</p>
          <p>Site : https://www.netlify.com</p>
        </Section>

        <Section title="Propriété intellectuelle">
          <p>Le contenu du site (textes, visuels, logo, marques) est protégé. Toute reproduction non autorisée est interdite.</p>
        </Section>

        <Section title="Responsabilité">
          <p>AS Motors s’efforce d’assurer l’exactitude des informations, sans garantir l’absence d’erreurs. La responsabilité ne peut être engagée en cas d’indisponibilité ou d’erreurs involontaires.</p>
        </Section>

        <Section title="Contact">
          <p>Pour toute question, vous pouvez nous écrire à <strong>contact@as-motors.fr</strong>.</p>
        </Section>

        <p className="text-xs text-gray-400 dark:text-gray-500">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default LegalMentionsPage;