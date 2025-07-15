import React, { useState } from "react";
import { sendContactMessage } from "../../services/api";
import "./contactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    contenu: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      await sendContactMessage(formData);
      setStatus("Votre message a bien été envoyé !");
      setFormData({ nom: "", email: "", sujet: "", contenu: "" });
    } catch (err) {
      setStatus("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="contact-page">
      <h1>Contactez-nous</h1>
      <p>Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter !</p>

      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="nom">Nom</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="sujet">Sujet</label>
          <input type="text" id="sujet" name="sujet" value={formData.sujet} onChange={handleChange} required />

          <label htmlFor="contenu">Message</label>
          <textarea
            id="contenu"
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>

          <button type="submit" className="btn-primary">Envoyer</button>
          {status && <p className="message-status">{status}</p>}
        </form>

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
