import React from "react";

const Section = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
    <div className="text-sm text-[var(--color-text-muted)] leading-relaxed">{children}</div>
  </section>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28">
      <div className="pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-4xl font-bold font-display text-[var(--color-text)] mb-4">Politique de confidentialité</h1>
          <p className="text-lg text-[var(--color-text-muted)]">Protection de vos données personnelles</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Section title="Données collectées">
          <ul className="list-disc pl-5 space-y-1">
            <li>Identité : nom, prénom</li>
            <li>Coordonnées : email, téléphone, adresse</li>
            <li>Compte utilisateur et réservations</li>
            <li>Messages de contact</li>
          </ul>
        </Section>

        <Section title="Finalités">
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestion des comptes et réservations</li>
            <li>Relation client et support</li>
            <li>Envoi d’informations liées à la réservation</li>
            <li>Sécurité et prévention de la fraude</li>
          </ul>
        </Section>

        <Section title="Base légale">
          <ul className="list-disc pl-5 space-y-1">
            <li>Exécution du contrat (réservation)</li>
            <li>Intérêt légitime (sécurité et prévention de fraude)</li>
            <li>Consentement (communication marketing si applicable)</li>
          </ul>
        </Section>

        <Section title="Durée de conservation">
          <p>Les données sont conservées uniquement le temps nécessaire aux finalités, puis archivées conformément aux obligations légales.</p>
        </Section>

        <Section title="Sécurité">
          <p>Des mesures techniques et organisationnelles sont mises en œuvre pour protéger les données (chiffrement, contrôle d’accès, journalisation).</p>
        </Section>

        <Section title="Transferts hors UE">
          <p>Si des prestataires hors UE sont utilisés, des garanties appropriées sont appliquées (clauses contractuelles types).</p>
        </Section>

        <Section title="Destinataires & sous-traitants">
          <p>Hébergeur, services d’e-mail et outils techniques nécessaires au fonctionnement. Aucune revente de données.</p>
        </Section>

        <Section title="Vos droits">
          <p>Accès, rectification, suppression, limitation, opposition, portabilité. Contact : <strong>contact@as-motors.fr</strong></p>
        </Section>

        <Section title="Réclamation">
          <p>Vous pouvez saisir la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.</p>
        </Section>

        <p className="text-xs text-gray-400 dark:text-gray-500">Dernière mise à jour : 12/02/2026</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;