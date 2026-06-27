<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
echo json_encode(DB::table('instructors')->whereIn('name', ['Vijay Sam', 'Paul Kumar', 'Binoy Varghese'])->get());
?>
