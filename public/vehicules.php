<?php
session_start();
require_once '../config/database.php';
$twig = require '../config/twig.php';

// Récupérer toutes les voitures de la base de données
$query = $pdo->query("SELECT * FROM voitures ORDER BY id DESC");
$voitures = $query->fetchAll(PDO::FETCH_ASSOC);

// Préparer le contexte pour Twig
$context = [
    'voitures' => $voitures,
    'session' => $_SESSION
];

echo $twig->render('vehicules.twig', $context);
?>