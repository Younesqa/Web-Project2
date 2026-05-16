<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

$course_id              = (int) ($_POST["course_id"]              ?? 0);
$prerequisite_course_id = (int) ($_POST["prerequisite_course_id"] ?? 0);

if (!$course_id || !$prerequisite_course_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Both course IDs are required."]);
    exit;
}

if ($course_id === $prerequisite_course_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "A course cannot be its own prerequisite."]);
    exit;
}

$sql  = "SELECT id FROM course_prerequisites
         WHERE course_id = ? AND prerequisite_course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $course_id, $prerequisite_course_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Prerequisite already exists."]);
    $stmt->close();
    exit;
}
$stmt->close();

$sql  = "INSERT INTO course_prerequisites (course_id, prerequisite_course_id) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $course_id, $prerequisite_course_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Prerequisite added successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
