const nodemailer = require("nodemailer");
const path = require("path");
const reservationModel = require('../models/reservationModel');
const userModel = require('../models/userModel');
const vehiculeModel = require('../models/vehiculeModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// --- CONFIGURATION DES PRIX PAR VÉHICULE (En dur) ---
const GRILLE_PRIX = {
    "Mercedes-Classe-A250e": {
        prix24hSemaine: 150,
        prix48hWeekend: 350,
        prix72hWeekend: 550,
        prixSemaine: 750
    },
    "Renault-Clio-V-Alpine": {
        prix24hSemaine: 1,
        prix48hWeekend: 170,
        prix72hWeekend: 300,
        prixSemaine: 550
    },
};

const createReservation = async (req, res) => {
    try {
        const { vehicule_id, date_debut, date_fin, modele_cle } = req.body; 
        
        const user_id = req.user ? req.user.id : null;
        if (!user_id) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const estDispo = await reservationModel.checkAvailability(vehicule_id, date_debut, date_fin);
        if (!estDispo) {
            return res.status(409).json({ // 409 = Conflict
                message: "Ce véhicule n'est pas disponible aux dates sélectionnées." 
            });
        }

        // Tous les demandes passent désormais par un devis
        const modeDevis = true;

        const reservationData = {
            user_id,
            vehicule_id,
            date_debut, // On sauvegarde la vraie date avec heure en base
            date_fin,
            montant_total: 0,
            statut: 'en_attente'
        };

        const reservation = await reservationModel.createReservation(reservationData);

        // --- Envoi d'emails (confirmation user + notification admin)
        const canSendEmails = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        if (canSendEmails) {
            try {
                const userInfo = await userModel.getUserById(user_id);
                const vehiculeInfo = await vehiculeModel.getVehiculeById(vehicule_id);
                const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.EMAIL_TO || "";
                const adminEmails = adminEmailsRaw
                    .split(",")
                    .map((e) => e.trim())
                    .filter(Boolean);

                const vehiculeLabel = vehiculeInfo
                    ? `${vehiculeInfo.marque || ""} ${vehiculeInfo.modele || ""}`.trim()
                    : `#${vehicule_id}`;

                                const logoUrl = process.env.EMAIL_LOGO_URL || "";
                                const logoHtml = logoUrl
                                    ? `<img src="${logoUrl}" alt="AS Motors" style="height:36px;display:block;" />`
                                    : `<span style="font-weight:700;font-size:20px">AS Motors</span>`;
                                const detailsText = `Réservation: ${vehiculeLabel}\nDates: ${date_debut} → ${date_fin}\nMontant: ${reservationData.montant_total}€\nStatut: ${reservationData.statut}`;
                                const detailsHtml = `
                                    <table style="width:100%;border-collapse:collapse;margin-top:12px">
                                        <tr><td style="padding:8px 0;color:#6b7280">Véhicule</td><td style="padding:8px 0;font-weight:600;color:#111827">${vehiculeLabel}</td></tr>
                                        <tr><td style="padding:8px 0;color:#6b7280">Dates</td><td style="padding:8px 0;font-weight:600;color:#111827">${date_debut} → ${date_fin}</td></tr>
                                        <tr><td style="padding:8px 0;color:#6b7280">Montant</td><td style="padding:8px 0;font-weight:600;color:#111827">${reservationData.montant_total}€</td></tr>
                                        <tr><td style="padding:8px 0;color:#6b7280">Statut</td><td style="padding:8px 0;font-weight:600;color:#111827">${reservationData.statut}</td></tr>
                                    </table>
                                `;

                if (userInfo?.email) {
                                        await transporter.sendMail({
                                                from: `"AS Motors" <${process.env.EMAIL_USER}>`,
                                                to: userInfo.email,
                                                subject: "Votre demande de réservation a bien été reçue",
                                                text: `Bonjour ${userInfo.prenom || ""},\n\nNous avons bien reçu votre demande de réservation.\n${detailsText}\n\nNotre équipe vous recontacte rapidement.\n\nAS Motors`,
                                                html: `
                                                    <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px">
                                                        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                                                            <div style="background:#111827;color:#ffffff;padding:20px 24px">
                                                                ${logoHtml}
                                                                <p style="margin:8px 0 0;font-size:13px;color:#d1d5db">Confirmation de réception</p>
                                                            </div>
                                                            <div style="padding:24px">
                                                                <p style="margin:0 0 12px;font-size:16px;color:#111827">Bonjour ${userInfo.prenom || ""},</p>
                                                                <p style="margin:0 0 12px;color:#374151">Nous avons bien reçu votre demande de réservation. Voici le récapitulatif :</p>
                                                                ${detailsHtml}
                                                                <div style="margin-top:16px;padding:12px 16px;background:#f3f4f6;border-radius:8px;color:#374151;font-size:13px">
                                                                    Notre équipe vous recontacte rapidement pour la validation finale.
                                                                </div>
                                                            </div>
                                                            <div style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
                                                                AS Motors — Merci pour votre confiance.
                                                            </div>
                                                        </div>
                                                    </div>
                                                `
                                        });
                }

                if (adminEmails.length > 0) {
                                        await transporter.sendMail({
                                                from: `"AS Motors" <${process.env.EMAIL_USER}>`,
                                                to: adminEmails.join(","),
                                                subject: "Nouvelle demande de réservation",
                                                text: `Une nouvelle réservation a été demandée.\nClient: ${userInfo?.nom || ""} ${userInfo?.prenom || ""} (${userInfo?.email || ""})\n${detailsText}`,
                                                html: `
                                                    <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px">
                                                        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                                                            <div style="background:#0f172a;color:#ffffff;padding:20px 24px">
                                                                ${logoHtml}
                                                                <p style="margin:8px 0 0;font-size:13px;color:#d1d5db">Alerte Admin — Nouvelle réservation</p>
                                                            </div>
                                                            <div style="padding:24px">
                                                                <p style="margin:0 0 12px;font-size:16px;color:#111827">Une nouvelle demande a été enregistrée.</p>
                                                                <div style="margin-bottom:12px;padding:12px 16px;background:#f3f4f6;border-radius:8px;color:#374151;font-size:13px">
                                                                    <strong>Client :</strong> ${userInfo?.nom || ""} ${userInfo?.prenom || ""} (${userInfo?.email || ""})
                                                                </div>
                                                                ${detailsHtml}
                                                                <div style="margin-top:16px;color:#6b7280;font-size:12px">
                                                                    Consultez le tableau d'administration pour valider ou annuler la demande.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `
                                        });
                }
            } catch (mailError) {
                console.error("Erreur envoi email réservation:", mailError);
            }
        } else {
            console.warn("EMAIL_USER/EMAIL_PASS manquants: envoi email désactivé.");
        }

        return res.status(200).json({
            message: "Votre demande de réservation a été envoyée. Un devis sera réalisé.",
            reservation,
            isDevis: true
        });

    } catch (error) {
        console.error("Erreur Reservation:", error);
        res.status(500).json({ message: 'Erreur lors de la réservation' });
    }
};

const getMyReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.getReservationsByUser(req.user.id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getPricing = (req, res) => {
    return res.json({ pricing: GRILLE_PRIX });
};

const getPricingForVehicule = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicule = await vehiculeModel.getVehiculeById(id);
        if (!vehicule) {
            return res.status(404).json({ message: "Véhicule introuvable" });
        }

        const baseKey = vehicule.modele_cle || `${vehicule.marque}-${vehicule.modele}`.replace(/\s+/g, "-");
        const candidates = [
            baseKey,
            `${vehicule.marque}-Classe-${vehicule.modele}`.replace(/\s+/g, "-"),
        ];

        const foundKey = candidates.find((k) => GRILLE_PRIX[k]);
        const pricing = foundKey ? GRILLE_PRIX[foundKey] : null;

        return res.json({ pricing, key: foundKey || baseKey });
    } catch (error) {
        console.error("Erreur getPricingForVehicule:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

const getBlockedRanges = async (req, res) => {
    try {
        const { id } = req.params;
        const ranges = await reservationModel.getBlockedRangesByVehicule(id);
        return res.json({ ranges });
    } catch (error) {
        console.error("Erreur getBlockedRanges:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.getAllReservations();
        res.json(reservations);
    } catch (error) {
        console.error('Erreur getAllReservations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Valeurs valides en français
        if (!['en_attente', 'confirmée', 'annulée'].includes(status)) {
            return res.status(400).json({ message: 'Statut invalide. Utilisez: en_attente, confirmée, annulée' });
        }

        const reservation = await reservationModel.updateReservation(id, { status });
        
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation mise à jour', reservation });
    } catch (error) {
        console.error('Erreur updateReservation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const uploadDevis = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Fichier devis requis' });
        }

        const devisPath = `/uploads/devis/${req.file.filename}`;
        const reservation = await reservationModel.updateReservationDevis(id, devisPath);

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        const canSendEmails = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        if (canSendEmails) {
            try {
                const userInfo = await userModel.getUserById(reservation.user_id);
                const vehiculeInfo = await vehiculeModel.getVehiculeById(reservation.vehicule_id);
                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
                const devisUrl = `${frontendUrl}${devisPath}`;

                const vehiculeLabel = vehiculeInfo
                    ? `${vehiculeInfo.marque || ""} ${vehiculeInfo.modele || ""}`.trim()
                    : `#${reservation.vehicule_id}`;

                const logoUrl = process.env.EMAIL_LOGO_URL || "";
                const logoHtml = logoUrl
                    ? `<img src="${logoUrl}" alt="AS Motors" style="height:36px;display:block;" />`
                    : `<span style="font-weight:700;font-size:20px">AS Motors</span>`;

                if (userInfo?.email) {
                    await transporter.sendMail({
                        from: `"AS Motors" <${process.env.EMAIL_USER}>`,
                        to: userInfo.email,
                        subject: "Votre devis est disponible",
                        text: `Bonjour ${userInfo.prenom || ""},\n\nVotre devis est disponible pour la réservation ${vehiculeLabel}.\nTélécharger le devis : ${devisUrl}\n\nAS Motors`,
                        html: `
                            <div style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;padding:24px">
                                <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
                                    <div style="background:#111827;color:#ffffff;padding:20px 24px">
                                        ${logoHtml}
                                        <div style="margin-top:8px;font-size:14px;opacity:0.8">Votre devis est prêt</div>
                                    </div>
                                    <div style="padding:24px">
                                        <h2 style="margin:0 0 12px;font-size:20px;color:#111827">Bonjour ${userInfo.prenom || ""},</h2>
                                        <p style="margin:0 0 16px;color:#374151">Votre devis est disponible pour la réservation :</p>
                                        <p style="margin:0 0 16px;font-weight:600;color:#111827">${vehiculeLabel}</p>
                                        <a href="${devisUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600">Télécharger le devis</a>
                                        <p style="margin:16px 0 0;color:#6b7280;font-size:12px">Si le bouton ne fonctionne pas, utilisez ce lien : ${devisUrl}</p>
                                    </div>
                                </div>
                            </div>
                        `,
                        attachments: [
                            {
                                filename: req.file.originalname || path.basename(req.file.path),
                                path: req.file.path,
                            },
                        ],
                    });
                }
            } catch (mailError) {
                console.error('Erreur envoi devis email:', mailError);
            }
        }

        res.json({
            message: 'Devis ajouté',
            devis_path: devisPath,
            devis_uploaded_at: reservation.devis_uploaded_at,
        });
    } catch (error) {
        console.error('Erreur uploadDevis:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reservationModel.deleteReservation(id);

        if (!result) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée' });
    } catch (error) {
        console.error('Erreur deleteReservation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { createReservation, getMyReservations, getPricing, getPricingForVehicule, getBlockedRanges, getAllReservations, updateReservation, uploadDevis, deleteReservation };