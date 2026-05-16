<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$result        = $conn->query("SELECT COUNT(*) AS total FROM courses");
$total_courses = (int) $result->fetch_assoc()["total"];

$result          = $conn->query("SELECT COUNT(DISTINCT student_id) AS total FROM registrations");
$active_students = (int) $result->fetch_assoc()["total"];

$result               = $conn->query("SELECT COUNT(*) AS total FROM registrations");
$total_registrations  = (int) $result->fetch_assoc()["total"];

echo json_encode([
    "courses"       => $total_courses,
    "students"      => $active_students,
    "registrations" => $total_registrations
]);

$conn->close();
?>
