<?php

header("Content-Type: application/json");

require_once "auth.php";
require_once "db.php";

if (!isset($_SESSION["user"]) || $_SESSION["user"]["role"] !== "student") {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Access denied."]);
    exit;
}

$student_id = (int) $_SESSION["user"]["id"];

$sql = "SELECT c.*
        FROM registrations r
        INNER JOIN courses c ON r.course_id = c.id
        WHERE r.student_id = ?
        ORDER BY c.course_code";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result  = $stmt->get_result();
$courses = [];

while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}
$stmt->close();

foreach ($courses as &$course) {
    $cid  = (int) $course["id"];
    $sql2 = "SELECT c2.course_code AS prereq_code, c2.title AS prereq_title
             FROM course_prerequisites cp
             JOIN courses c2 ON cp.prerequisite_course_id = c2.id
             WHERE cp.course_id = ?
             ORDER BY c2.course_code";

    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $cid);
    $stmt2->execute();
    $r2    = $stmt2->get_result();
    $prereqs = [];

    while ($p = $r2->fetch_assoc()) {
        $prereqs[] = $p["prereq_code"] . " - " . $p["prereq_title"];
    }

    $course["prerequisites"] = $prereqs;
    $stmt2->close();
}
unset($course);

echo json_encode($courses);

$conn->close();
?>
