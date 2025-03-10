<?php
session_start();
require_once '../config/database.php';
$twig = require '../config/twig.php';

// Vérifier si l'utilisateur est admin
if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

// Récupérer les voitures
$query = $pdo->prepare("SELECT * FROM voitures");
$query->execute();
$voitures = $query->fetchAll(PDO::FETCH_ASSOC);

// Affichage avec Twig
echo $twig->render('admin.twig', ['voitures' => $voitures]);
?>
