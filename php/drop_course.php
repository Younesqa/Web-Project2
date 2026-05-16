<?php

header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "student") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

if (!isset($_GET["course_id"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Course ID is required."]);
    exit;
}

$student_id = (int) $_SESSION["user"]["id"];
$course_id  = (int) $_GET["course_id"];

$sql  = "DELETE FROM registrations WHERE student_id = ? AND course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $student_id, $course_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Course dropped successfully."]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Registration not found."]);
}

$stmt->close();
$conn->close();
?>
