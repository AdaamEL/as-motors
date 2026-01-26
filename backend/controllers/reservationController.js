const reservationModel = require('../models/reservationModel');

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

        const debut = new Date(date_debut);
        const fin = new Date(date_fin);

        const dateDebutSansHeure = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate(), 12, 0, 0);
        const dateFinSansHeure = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate(), 12, 0, 0);

        // Calcul de la différence en jours (1 jour = 86400000 ms)
        const diffMs = dateFinSansHeure - dateDebutSansHeure;
        const nbJours = Math.round(diffMs / (1000 * 60 * 60 * 24));

        // --- 2. DETERMINATION DU JOUR DE LA SEMAINE ---
        // getDay() : 0 = Dimanche, 1 = Lundi, ... 5 = Vendredi, 6 = Samedi
        const jourSemaine = dateDebutSansHeure.getDay(); 
        
        // Définition simple du weekend : Départ Vendredi ou Samedi
        const estWeekend = (jourSemaine === 5 || jourSemaine === 6); 

        // --- 3. RECUPERATION DU PRIX ---
        // Sécurité : Si modele_cle est vide ou inconnu, on fallback sur 'clio-alpine' pour tester
        // (En prod, tu pourrais renvoyer une erreur, mais ici ça aide à tester)
        const cleAUtiliser = (modele_cle && GRILLE_PRIX[modele_cle]) ? modele_cle : "clio-alpine";
        const prixVhf = GRILLE_PRIX[cleAUtiliser];

        let montant_total = 0;
        let modeDevis = false;

        // --- 4. LOGIQUE DES FORFAITS ---
        if (nbJours === 1 && !estWeekend) {
            // Ex: Lundi -> Mardi
            montant_total = prixVhf["prix24hSemaine"];
        } 
        else if (nbJours === 2 && estWeekend) {
            // Ex: Vendredi -> Dimanche (48h)
            montant_total = prixVhf["prix48hWeekend"];
        }
        else if (nbJours === 3 && estWeekend) {
            // Ex: Vendredi -> Lundi (72h)
            montant_total = prixVhf["prix72hWeekend"];
        }
        else if (nbJours === 7) {
            // Ex: Lundi -> Lundi suivant
            montant_total = prixVhf["prixSemaine"];
        }
        else {
            // Tout ce qui ne rentre pas dans les cases = Devis
            modeDevis = true;
        }

        const reservationData = {
            user_id,
            vehicule_id,
            date_debut, // On sauvegarde la vraie date avec heure en base
            date_fin,
            montant_total: modeDevis ? 0 : montant_total,
            statut: modeDevis ? 'en_attente' : 'confirmée'
        };

        const reservation = await reservationModel.createReservation(reservationData);

        if (modeDevis) {
            return res.status(200).json({
                message: "Votre durée de location ne correspond pas aux forfaits standards (ex: 4 jours). Devis nécessaire.",
                reservation,
                isDevis: true,
                debug: { nbJours, estWeekend, jourSemaine, cleUtilisee: cleAUtiliser }
            });
        }

        res.status(201).json({ 
            message: "Réservation confirmée au tarif forfaitaire.", 
            reservation,
            isDevis: false,
            debug: { nbJours, estWeekend, prixApplique: montant_total }
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

module.exports = { createReservation, getMyReservations };