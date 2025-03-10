<?php
session_start();
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = htmlspecialchars($_POST['email']);
    $password = $_POST['password'];

    // Récupérer l'utilisateur avec cet email
    $query = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $query->execute([$email]);
    $user = $query->fetch(PDO::FETCH_ASSOC);

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if ($user && password_verify($password, $user['mot_de_passe'])) {
        if ($user['role'] === 'admin') {
            $_SESSION['admin'] = $user['id'];  
            $_SESSION['email'] = $user['email'];
            header("Location: admin.php");  
            exit;
        } else {
            $_SESSION['user'] = $user['id'];  
            $_SESSION['email'] = $user['email'];
            header("Location: index.php");  
            var_dump($_SESSION); // Debugging: Vérifier que la session est bien enregistrée
            exit;
        }
    } else {
        $error = "Identifiants incorrects.";
    }
}

$twig = require '../config/twig.php';
echo $twig->render('login.twig', ['error' => $error ?? null]);
?>
