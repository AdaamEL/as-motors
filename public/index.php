<?php
session_start(); // Important : Démarrer la session

require_once '../config/database.php';
$twig = require '../config/twig.php';

// Vérifier si l'utilisateur est connecté
$userConnected = isset($_SESSION['user']) || isset($_SESSION['admin']);

// Récupérer les voitures
$query = $pdo->prepare("SELECT * FROM voitures");
$query->execute();
$voitures = $query->fetchAll(PDO::FETCH_ASSOC);

// Afficher la page d'accueil
echo $twig->render('accueil.twig', [
    'voitures' => $voitures,
    'session' => $_SESSION, // Envoyer toute la session à Twig
    'userConnected' => $userConnected
]);
