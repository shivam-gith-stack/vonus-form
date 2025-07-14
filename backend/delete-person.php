<?php
header("Access-Control-Allow-Origin: https://vonus-form-1.onrender.com");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["id"])) {
    echo json_encode(["error" => "Missing ID"]);
    exit;
}

$existing = json_decode(file_get_contents("data.json"), true);
$filtered = array_filter($existing, fn($p) => $p["id"] !== $data["id"]);

file_put_contents("data.json", json_encode(array_values($filtered), JSON_PRETTY_PRINT));

echo json_encode(["success" => true, "message" => "Person deleted"]);