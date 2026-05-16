<?php


session_start();

header("Content-Type: application/json");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["username"]) ||
    !isset($data["password"]) ||
    !isset($data["role"])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing login data."]);
    exit;
}

$username = trim($data["username"]);
$password = trim($data["password"]);
$role     = trim($data["role"]);

if ($role !== "student" && $role !== "admin") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role."]);
    exit;
}

$table = ($role === "student") ? "students" : "admins";

$sql  = "SELECT id, name, email, password FROM $table WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
    exit;
}

$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    exit;
}

$user = $result->fetch_assoc();


$valid = false;
if (password_get_info($user["password"])["algo"] !== 0) {
    $valid = password_verify($password, $user["password"]);
} else {

$valid = ($password === $user["password"]);
}

if (!$valid) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    exit;
}

$_SESSION["user"] = [
    "id"    => $user["id"],
    "name"  => $user["name"],
    "email" => $user["email"],
    "role"  => $role
];

$_SESSION["last_activity"] = time();

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "user"    => $_SESSION["user"]
]);

$stmt->close();
$conn->close();
?>
