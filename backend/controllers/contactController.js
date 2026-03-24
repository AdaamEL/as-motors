const nodemailer = require("nodemailer");
const contactModel = require('../models/contactModel');

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#039;");

const toParagraphs = (value = "") => escapeHtml(value).replace(/\n/g, "<br />");

const normalizeEnv = (value = "") => {
  const trimmed = String(value).trim();
  return trimmed.replace(/^['\"](.*)['\"]$/, "$1").trim();
};

const sanitizeSmtpUser = (value = "") => normalizeEnv(value).replace(/\s+/g, "");
const sanitizeSmtpPass = (value = "") => normalizeEnv(value).replace(/\s+/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "");

const smtpUser = sanitizeSmtpUser(process.env.EMAIL_USER);
const smtpPass = sanitizeSmtpPass(process.env.EMAIL_PASS);

const emailUser = smtpUser.toLowerCase();
const isGmail = emailUser.endsWith("@gmail.com");

const smtpHost = process.env.SMTP_HOST || (isGmail ? 'smtp.gmail.com' : 'smtp.office365.com');
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: { ciphers: 'SSLv3' }
});

console.log("SMTP contact config:", {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  user: smtpUser,
  passLength: smtpPass.length,
  hasUser: Boolean(smtpUser),
  hasPass: Boolean(smtpPass),
});

exports.sendMessage = async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  try {
    // Enregistrement dans la BDD
    await contactModel.sendMessage({ nom, email, sujet, contenu });

    // L'envoi email ne doit pas bloquer le formulaire si SMTP est indisponible.
    try {
      const senderName = escapeHtml(nom);
      const senderEmail = String(email || "").trim();
      const contactSubject = String(sujet || "").trim();
      const messageHtml = toParagraphs(contenu);

      const recipientsRaw = process.env.ADMIN_EMAILS || process.env.EMAIL_TO || "";
      const recipients = recipientsRaw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (!process.env.EMAIL_USER || recipients.length === 0) {
        console.warn("EMAIL_USER ou destinataire(s) manquant(s): notification email contact ignorée.");
        return res.status(200).json({
          message: "Message enregistré. Notification email non configurée."
        });
      }

      const info = await transporter.sendMail({
        // Important pour Outlook: l'expéditeur doit être le compte SMTP authentifié.
        from: `"AS Motors" <${process.env.EMAIL_USER}>`,
        replyTo: senderEmail,
        to: recipients.join(','),
        subject: `Nouveau message contact - ${contactSubject}`,
        text:
`Nouveau message via le formulaire de contact\n\n` +
`Nom: ${nom}\n` +
`Email: ${senderEmail}\n` +
`Sujet: ${contactSubject}\n\n` +
`Message:\n${contenu}`,
        html: `
          <div style="margin:0;padding:24px;background:#f2f2f0;font-family:Segoe UI,Arial,sans-serif;color:#111111;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7e7e3;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:24px 24px 16px;background:linear-gradient(135deg,#5c240c,#3f1708);color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.86;">AS Motors</div>
                  <h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;">Nouveau message contact</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 24px 8px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #ecece8;font-size:14px;color:#585856;width:130px;">Nom</td>
                      <td style="padding:10px 0;border-bottom:1px solid #ecece8;font-size:15px;font-weight:600;">${senderName}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #ecece8;font-size:14px;color:#585856;">Email</td>
                      <td style="padding:10px 0;border-bottom:1px solid #ecece8;font-size:15px;">
                        <a href="mailto:${escapeHtml(senderEmail)}" style="color:#5c240c;text-decoration:none;font-weight:600;">${escapeHtml(senderEmail)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;font-size:14px;color:#585856;">Sujet</td>
                      <td style="padding:10px 0;font-size:15px;font-weight:600;">${escapeHtml(contactSubject)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 24px 24px;">
                  <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#6a6a67;margin-bottom:10px;">Message</div>
                  <div style="padding:16px;border:1px solid #ecece8;border-radius:12px;background:#fafaf8;font-size:15px;line-height:1.65;color:#1d1d1d;">
                    ${messageHtml}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        `
      });

      console.log("Email contact envoyé:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
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
