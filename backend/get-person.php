<?php
header("Access-Control-Allow-Origin: https://vonus-form-vjx3.vercel.app");
header("Content-Type: application/json");

$id = $_GET['id'] ?? null;
if (!$id) {
    echo json_encode(["error" => "Missing ID"]);
    exit;
}

$people = json_decode(file_get_contents("data.json"), true);
$person = null;

foreach ($people as $p) {
    if ($p['id'] === $id) {
        $person = $p;
        break;
    }
}

if ($person) {
    echo json_encode(["person" => $person]);
} else {
    echo json_encode(["error" => "Person not found"]);
}