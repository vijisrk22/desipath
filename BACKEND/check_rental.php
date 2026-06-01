<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$home = \App\Models\RentalHome::first();
echo json_encode($home, JSON_PRETTY_PRINT);
