<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$id = '430ca261-831a-49e6-a9c6-46ef0c1f0d79';
$class = DB::table('kids_classes')->where('id', $id)->first();
if (!$class) { echo "Class not found\n"; exit; }
$instructor = DB::table('instructors')->where('id', $class->instructor_id)->first();
echo "Instructor: " . $instructor->name . "\n";
echo "Photo URL: " . $instructor->profile_photo_url . "\n";
