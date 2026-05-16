<?php

header("Content-Type: application/json");

require_once "db.php";
require_once "auth.php";
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

if (isset($_GET["id"])) {

    $course_id = (int) $_GET["id"];

    $sql = "SELECT c.*,
                   COUNT(r.id) AS registered
            FROM courses c
            LEFT JOIN registrations r
                   ON c.id = r.course_id
            WHERE c.id = ?
            GROUP BY c.id";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare statement."
        ]);
        exit;
    }

    $stmt->bind_param("i", $course_id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Course not found."
        ]);
    }

    $stmt->close();
} else {

    $sql = "SELECT c.*,
                   COUNT(r.id) AS registered
            FROM courses c
            LEFT JOIN registrations r
                   ON c.id = r.course_id
            GROUP BY c.id
            ORDER BY c.course_code";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to prepare statement."
        ]);
        exit;
    }

    $stmt->execute();

    $result  = $stmt->get_result();
    $courses = [];

    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }

    echo json_encode($courses);

    $stmt->close();
}

$conn->close();
