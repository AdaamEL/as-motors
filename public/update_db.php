<?php
require_once '../config/database.php';

$password = password_hash('admin123', PASSWORD_DEFAULT);

$query = $pdo->prepare("INSERT INTO users (email, mot_de_passe, role) VALUES (?, ?, ?)");
$query->execute(['admin@example.com', $password, 'admin']);

echo "Admin ajouté avec succès.";
?>
