<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
echo 'Volunteers: ' . \App\Models\VolunteerPost::count() . "\n";
echo 'Requests: ' . \App\Models\TravelRequest::count() . "\n";
