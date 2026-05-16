<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "admin") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$sql = "SELECT r.id,
               s.name            AS student_name,
               c.course_code,
               c.title,
               r.registration_date
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN courses  c ON r.course_id  = c.id
        ORDER BY c.course_code, s.name";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();
?>
