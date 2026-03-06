import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
    <div className="text-sm text-[var(--color-text-muted)] leading-relaxed">{children}</div>
  </section>
);

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28">
      <div className="pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--color-text)] mb-6">Et si AS Motor&apos;s était une personne, à quoi ressemblerait-elle&nbsp;?</h1>
          <div className="relative mx-auto max-w-3xl rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-bg)]/70 backdrop-blur-sm px-5 py-6 sm:px-8 sm:py-7 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <p className="text-left text-base sm:text-lg text-[var(--color-text-muted)] leading-8 sm:leading-9 font-light italic tracking-[0.01em] first-letter:text-4xl first-letter:mr-1">
              Si as motor&apos;s était une personne, ce serait quelqu&apos;un de fiable, sur qui on peut compter. <br></br>Quant a son train de vie je le décrirai d&apos;assez modeste, du genre à chercher un équilibre un peu partout, il va s&apos;habiller classe car il fait attention a son image mais sans excès, il faut garder un vêtement qui reste décontracté. <br></br>Au niveau de son alimentation il aime se faire des plaisirs mais a le recul de ne pas faire ça tout le temps
              <br></br>C&apos;est une personne qui préfère offrir que recevoir, il fait passer le bonheur d&apos;autrui avant le sien. c&apos;est la première personne a laquelle on va penser lorsqu&apos;on aura besoin d&apos;un conseil ou d&apos;un coup de main, il est toujours là pour les autres. <br></br> Pour résumer, as motor&apos;s met un point d&apos;honneur sur son exigeance professionnelle et personnelle, sur le fait de jongler entre fiabilité et humilité.
            </p>
          </div>
          {/* Cadre contractuel de la réservation */}
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