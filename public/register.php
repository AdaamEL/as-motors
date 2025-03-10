<?php
session_start();
require_once '../config/database.php';
$twig = require '../config/twig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Vérifier si l'email existe déjà
    $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $query->execute([$email]);
    if ($query->fetch()) {
        $error = "Cet email est déjà utilisé.";
    } else {
        // Hasher le mot de passe et insérer l'utilisateur en tant que "user"
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $query = $pdo->prepare("INSERT INTO users (email, mot_de_passe, role) VALUES (?, ?, 'user')");
        $query->execute([$email, $hashedPassword]);

        // Connexion automatique après inscription
        $_SESSION['user'] = $pdo->lastInsertId();
        header("Location: index.php");
        exit;
    }
}

echo $twig->render('register.twig', ['error' => $error ?? null]);
?>
