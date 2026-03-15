const nodemailer = require("nodemailer");
const contactModel = require('../models/contactModel');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  }
});

exports.sendMessage = async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  try {
    // Enregistrement dans la BDD
    await contactModel.sendMessage({ nom, email, sujet, contenu });

    // L'envoi email ne doit pas bloquer le formulaire si SMTP est indisponible.
    try {
      await transporter.sendMail({
        from: `"${nom}" <${email}>`,
        to: process.env.EMAIL_TO,
        subject: sujet,
        text: contenu,
        html: `<h3>Message de ${nom}</h3><p>${contenu}</p>`
      });

      return res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });
    } catch (mailErr) {
      console.error("Erreur envoi email contact:", mailErr);
      return res.status(200).json({
        message: "Message enregistré. L'e-mail de notification n'a pas pu être envoyé."
      });
    }
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du message:", err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du message." });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await contactModel.getAllMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.error("Erreur lors de la récupération des messages :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des messages." });
  }
};
