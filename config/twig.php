<?php
require_once __DIR__ . '/../vendor/autoload.php';

// Initialisation de Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => false, // Mettre un dossier cache en production
]);

return $twig; // <== Assurez-vous que ce fichier retourne bien $twig
?>
