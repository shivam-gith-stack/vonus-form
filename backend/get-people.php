<?php
header("Access-Control-Allow-Origin: https://vonus-form-vjx3.vercel.app");
header("Content-Type: application/json");

$data = file_get_contents("data.json");
echo json_encode(["people" => json_decode($data, true)]);