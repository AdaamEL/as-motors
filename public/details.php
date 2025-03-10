<?php
session_start();
require_once '../config/database.php';
$twig = require '../config/twig.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

// Vérifier si un ID est fourni
if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$voiture_id = $_GET['id'];

// Récupérer les détails de la voiture
$query = $pdo->prepare("SELECT * FROM voitures WHERE id = ?");
$query->execute([$voiture_id]);
$voiture = $query->fetch(PDO::FETCH_ASSOC);

if (!$voiture) {
    die("Véhicule non trouvé.");
}

echo $twig->render('details.twig', ['voiture' => $voiture]);
?>
