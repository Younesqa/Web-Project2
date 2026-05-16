<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

if (!isset($_GET["id"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Course ID is required."]);
    exit;
}

$id   = (int) $_GET["id"];
$sql  = "DELETE FROM courses WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Course deleted successfully."]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Course not found."]);
}

$stmt->close();
$conn->close();
?>
