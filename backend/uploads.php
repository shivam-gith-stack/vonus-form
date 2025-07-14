<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: https://vonus-form-vjx3.vercel.app");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if (!isset($_FILES['displayPic'])) {
    echo json_encode(["error" => "No file uploaded"]);
    exit;
}

$file = $_FILES['displayPic'];
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExts)) {
    echo json_encode(["error" => "Only image files are allowed."]);
    exit;
}

$imageInfo = getimagesize($file['tmp_name']);
if ($imageInfo === false) {
    echo json_encode(["error" => "Not a valid image."]);
    exit;
}

$targetDir = "uploads/";
if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);

$filename = uniqid() . "_" . basename($file["name"]);
$targetFile = $targetDir . $filename;

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
    echo json_encode([
        "success" => true,
        "url" => $targetFile
    ]);
} else {
    echo json_encode(["error" => "Upload failed"]);
}
