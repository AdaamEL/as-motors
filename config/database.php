<?php
$host = "localhost"; // Changer si hébergé en ligne
$dbname = "asmotors";
$username = "root";  // Modifier si nécessaire
$password = "";      // Modifier si nécessaire

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}
?>
