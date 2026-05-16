<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$course_code   = trim($_POST["course_code"]   ?? "");
$title         = trim($_POST["title"]         ?? "");
$description   = trim($_POST["description"]   ?? "");
$instructor    = trim($_POST["instructor"]     ?? "");
$schedule_info = trim($_POST["schedule_info"] ?? "");
$department    = trim($_POST["department"]    ?? "");
$semester      = trim($_POST["semester"]      ?? "");
$credits       = (int) ($_POST["credits"]  ?? 0);
$capacity      = (int) ($_POST["capacity"] ?? 0);

if (
    !$course_code || !$title    || !$description ||
    !$instructor  || !$schedule_info || !$department ||
    !$semester    || !$credits  || !$capacity
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

$sql = "INSERT INTO courses
            (course_code, title, description, instructor,
             schedule_info, credits, capacity, department, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}

$stmt->bind_param(
    "sssssiiis",
    $course_code, $title, $description, $instructor,
    $schedule_info, $credits, $capacity, $department, $semester
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Course added successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
