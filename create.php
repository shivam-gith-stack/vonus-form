<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$data = $_POST;
$hobbies = isset($data['hobbies']) ? json_decode($data['hobbies'], true) : [];

$displayPic = null;
if (isset($_FILES['displayPic'])) {
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $filename = uniqid() . "_" . basename($_FILES["displayPic"]["name"]);
    $targetFile = $targetDir . $filename;

    $info = getimagesize($_FILES["displayPic"]["tmp_name"]);
    if ($info === false) {
        echo json_encode(["error" => "Invalid image uploaded"]);
        exit;
    }

    if (move_uploaded_file($_FILES["displayPic"]["tmp_name"], $targetFile)) {
        $displayPic = $targetFile;
    }
}

$newPerson = [
    "id" => uniqid(),
    "name" => $data['name'] ?? '',
    "gender" => $data['gender'] ?? '',
    "dob" => $data['dob'] ?? '',
    "address" => $data['address'] ?? '',
    "hobbies" => $hobbies,
    "display_picture" => $displayPic,
    "created_at" => date("c"),
];

$existing = [];
if (file_exists("data.json")) {
    $existing = json_decode(file_get_contents("data.json"), true);
}
$existing[] = $newPerson;

file_put_contents("data.json", json_encode($existing, JSON_PRETTY_PRINT));

echo json_encode(["success" => true, "message" => "Person created successfully"]);
