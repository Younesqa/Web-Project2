<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$timeout = 20 * 60; 

if (!isset($_SESSION["user"])) {
    http_response_code(401);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Please log in first."
    ]);
    exit;
}

if (!isset($_SESSION["last_activity"])) {
    $_SESSION["last_activity"] = time();
}

if (time() - $_SESSION["last_activity"] > $timeout) {
    session_unset();
    session_destroy();

    http_response_code(401);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Session expired. Please log in again."
    ]);
    exit;
}

$_SESSION["last_activity"] = time();
?>