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

$sql  = "SELECT id FROM registrations WHERE student_id = ? AND course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $student_id, $course_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "You are already registered in this course."]);
    $stmt->close();
    exit;
}
$stmt->close();

$sql  = "SELECT capacity FROM courses WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $course_id);
$stmt->execute();
$result = $stmt->get_result();
$course = $result->fetch_assoc();
$stmt->close();

if (!$course) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Course not found."]);
    exit;
}

$sql  = "SELECT COUNT(*) AS total FROM registrations WHERE course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $course_id);
$stmt->execute();
$result = $stmt->get_result();
$row    = $result->fetch_assoc();
$stmt->close();

if ((int) $row["total"] >= (int) $course["capacity"]) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "This course is full."]);
    exit;
}

$sql  = "SELECT cp.prerequisite_course_id, c.title AS prereq_title, c.course_code AS prereq_code
         FROM course_prerequisites cp
         JOIN courses c ON cp.prerequisite_course_id = c.id
         WHERE cp.course_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $course_id);
$stmt->execute();
$prereqs = $stmt->get_result();
$stmt->close();

while ($prereq = $prereqs->fetch_assoc()) {
    $prereq_id = (int) $prereq["prerequisite_course_id"];

    $sql2  = "SELECT id FROM completed_courses WHERE student_id = ? AND course_id = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("ii", $student_id, $prereq_id);
    $stmt2->execute();
    $stmt2->store_result();

    if ($stmt2->num_rows === 0) {
        $stmt2->close();
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Prerequisite not completed: " . $prereq["prereq_code"] . " - " . $prereq["prereq_title"]
        ]);
        exit;
    }
    $stmt2->close();
}

$sql  = "INSERT INTO registrations (student_id, course_id, registration_date) VALUES (?, ?, NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $student_id, $course_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Course registered successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
