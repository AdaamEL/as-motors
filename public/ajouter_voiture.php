<?php
session_start();
require_once '../config/database.php';

if (!isset($_SESSION['admin'])) {
    header("Location: login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $marque = $_POST['marque'];
    $modele = $_POST['modele'];
    $annee = $_POST['annee'];
    $prix = $_POST['prix'];
    $disponible = isset($_POST['disponible']) ? 1 : 0;
    
    // Gérer l'image uploadée
    $image = "uploads/default.jpg"; // Valeur par défaut
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $uploadDir = '../uploads/';
        $filename = uniqid() . "." . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename);
        $image = "uploads/" . $filename;
    }

    // Insérer en base de données
    $query = $pdo->prepare("INSERT INTO voitures (marque, modele, annee, prix, image, disponible) VALUES (?, ?, ?, ?, ?, ?)");
    $query->execute([$marque, $modele, $annee, $prix, $image, $disponible]);

    header("Location: admin.php");
    exit;
}

$twig = require '../config/twig.php';
echo $twig->render('ajouter_voiture.twig');
?>
