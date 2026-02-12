const nodemailer = require("nodemailer");
const contactModel = require('../models/contactModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

exports.sendMessage = async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  try {
    // Enregistrement dans la BDD
    await contactModel.sendMessage({ nom, email, sujet, contenu });

    // Envoi d'un e-mail
    await transporter.sendMail({
      from: `"${nom}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: sujet,
      text: contenu,
      html: `<h3>Message de ${nom}</h3><p>${contenu}</p>`
    });

    res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'e-mail :", err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail." });
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
