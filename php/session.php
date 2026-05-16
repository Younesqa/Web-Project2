<?php


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json");

echo json_encode([
    "ok"            => true,
    "user"          => $_SESSION["user"]          ?? null,
    "last_activity" => $_SESSION["last_activity"] ?? null,
    "now"           => time()
]);
?>
