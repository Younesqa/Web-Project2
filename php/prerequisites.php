<?php


header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";

if (isset($_GET["course_id"])) {

    $course_id = (int) $_GET["course_id"];

    $sql = "SELECT cp.id,
                   c2.course_code AS prereq_code,
                   c2.title       AS prereq_title
            FROM course_prerequisites cp
            JOIN courses c2 ON cp.prerequisite_course_id = c2.id
            WHERE cp.course_id = ?
            ORDER BY c2.course_code";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error."]);
        exit;
    }

    $stmt->bind_param("i", $course_id);

} else {

    $sql = "SELECT cp.id,
                   c1.course_code AS course_code,
                   c1.title       AS course_title,
                   c2.course_code AS prereq_code,
                   c2.title       AS prereq_title
            FROM course_prerequisites cp
            JOIN courses c1 ON cp.course_id              = c1.id
            JOIN courses c2 ON cp.prerequisite_course_id = c2.id
            ORDER BY c1.course_code";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error."]);
        exit;
    }
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
