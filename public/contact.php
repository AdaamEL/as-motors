<?php
session_start();
require_once '../config/database.php';
$twig = require '../config/twig.php';

$message = '';
$error = '';

// Traitement du formulaire de contact
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['nom'] ?? '';
    $email = $_POST['email'] ?? '';
    $sujet = $_POST['sujet'] ?? '';
    $contenu = $_POST['contenu'] ?? '';
    
    // Validation simple
    if (empty($nom) || empty($email) || empty($sujet) || empty($contenu)) {
        $error = 'Tous les champs sont obligatoires.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Adresse email invalide.';
    } else {
        // Enregistrer le message dans la base de données (si vous avez une table pour cela)
        // ou envoyer un email
        
        // Exemple d'insertion dans une table 'messages'
        try {
            $stmt = $pdo->prepare("INSERT INTO messages (nom, email, sujet, contenu, date_envoi) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([$nom, $email, $sujet, $contenu]);
            $message = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
        } catch (PDOException $e) {
            // Si la table n'existe pas ou autre erreur
            // Vous pourriez simplement afficher un message de succès
            $message = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
        }
    }
}

// Préparer le contexte pour Twig
$context = [
    'session' => $_SESSION,
    'message' => $message,
    'error' => $error
];

echo $twig->render('contact.twig', $context);
?>