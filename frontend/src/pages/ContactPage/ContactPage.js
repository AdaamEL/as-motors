import React from "react";
import "./contactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>
      <p>Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter !</p>

      <div className="contact-container">
        {/* Formulaire de contact */}
        <form className="contact-form">
          <label htmlFor="name">Nom</label>
          <input type="text" id="name" name="name" placeholder="Votre nom" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Votre email" required />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" placeholder="Votre message" rows="5" required></textarea>

          <button type="submit" className="btn-primary">Envoyer</button>
        </form>

        {/* Informations de contact */}
        <div className="contact-info">
          <h2>Nos coordonnées</h2>
          <p><strong>Adresse :</strong> 123 Rue de l'Automobile, Paris, France</p>
          <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          <p><strong>Email :</strong> contact@asmotors.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;