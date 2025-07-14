<?php
header("Access-Control-Allow-Origin: https://vonus-form-vjx3.vercel.app");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];

$data = $_POST;
$id = $data['id'] ?? null;
if (!$id) {
    echo json_encode(["error" => "Missing ID"]);
    exit;
}

$hobbies = isset($data['hobbies']) ? json_decode($data['hobbies'], true) : [];

$displayPic = null;

$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (isset($_FILES['displayPic']) && $_FILES['displayPic']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['displayPic']['tmp_name'];
    $fileName = basename($_FILES['displayPic']['name']);
    $fileSize = $_FILES['displayPic']['size'];
    $fileType = mime_content_type($fileTmpPath);
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(["error" => "Invalid file type. Only JPG, PNG, GIF, and WEBP allowed."]);
        exit;
    }

    if ($fileSize > 5 * 1024 * 1024) {
        echo json_encode(["error" => "File size exceeds 5MB."]);
        exit;
    }

    $newFileName = uniqid() . "_" . $fileName;
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $displayPic = "uploads/" . $newFileName;
    } else {
        echo json_encode(["error" => "Failed to upload display picture."]);
        exit;
    }
}

$dataFile = "data.json";
$existing = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
$updated = false;

foreach ($existing as &$person) {
    if ($person['id'] === $id) {
        $person['name'] = $data['name'] ?? $person['name'];
        $person['gender'] = $data['gender'] ?? $person['gender'];
        $person['dob'] = $data['dob'] ?? $person['dob'];
        $person['address'] = $data['address'] ?? $person['address'];
        $person['hobbies'] = $hobbies;
        if ($displayPic) {
            $person['display_picture'] = $displayPic;
        }
        $person['updated_at'] = date("c");
        $updated = true;
        break;
    }
}

if ($updated) {
    file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true, "message" => "Person updated successfully"]);
} else {
    echo json_encode(["error" => "Person not found"]);
}
