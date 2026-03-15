import React from "react";

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/70 backdrop-blur-sm px-5 py-5 sm:px-7 sm:py-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
    <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-[var(--color-text)]">{title}</h2>
    <div className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed space-y-1.5">{children}</div>
  </section>
);

const LegalMentionsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-24">
      <div className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[var(--color-brand)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[var(--color-brand-light)]/10 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--color-text)] mb-4">Mentions légales</h1>
          <p className="text-lg text-[var(--color-text-muted)]">Informations légales de l'éditeur et de l'hébergeur</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 sm:space-y-7">
        <Section title="Éditeur du site">
          <p><strong>AS MOTOR'S SAS</strong></p>
          <p>Raison sociale : AS MOTOR'S SAS</p>
          <p>Forme juridique : SAS</p>
          <p>Capital social : 1 000 €</p>
          <p>Adresse : 15 rue du Louvre, 75001 Paris</p>
          <p>Email : contact@as-motors.fr</p>
          <p>Téléphone : +33 (0)7 83 36 67 60</p>
          <p>Directeur de publication : EL OUNISSI Adam</p>
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

        <p className="text-xs text-[var(--color-text-muted)]/80 pt-3">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default LegalMentionsPage;