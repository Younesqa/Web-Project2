<?php

header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$input = $_POST;

if (empty($input) && $_SERVER["REQUEST_METHOD"] === "PUT") {
    parse_str(file_get_contents("php://input"), $input);
}

$id            = (int) ($input["id"]            ?? $_GET["id"] ?? 0);
$course_code   = trim($input["course_code"]     ?? "");
$title         = trim($input["title"]           ?? "");
$description   = trim($input["description"]     ?? "");
$instructor    = trim($input["instructor"]       ?? "");
$schedule_info = trim($input["schedule_info"]   ?? "");
$department    = trim($input["department"]      ?? "");
$semester      = trim($input["semester"]        ?? "");
$credits       = (int) ($input["credits"]  ?? 0);
$capacity      = (int) ($input["capacity"] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Course ID is required."]);
    exit;
}

if (
    !$course_code || !$title    || !$description ||
    !$instructor  || !$schedule_info || !$department ||
    !$semester    || !$credits  || !$capacity
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

$sql = "UPDATE courses SET
            course_code   = ?,
            title         = ?,
            description   = ?,
            instructor    = ?,
            schedule_info = ?,
            credits       = ?,
            capacity      = ?,
            department    = ?,
            semester      = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}

$stmt->bind_param(
    "sssssiiisi",
    $course_code, $title, $description, $instructor,
    $schedule_info, $credits, $capacity, $department, $semester,
    $id
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Course updated successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
