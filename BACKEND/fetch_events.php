<?php
$ch = curl_init('http://127.0.0.1:8000/api/events');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
echo json_encode(json_decode($result), JSON_PRETTY_PRINT);
