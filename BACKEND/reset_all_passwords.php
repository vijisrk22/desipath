<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$password = bcrypt('Test123*');
$updatedCount = User::query()->update(['password' => $password]);

echo "Successfully reset passwords for {$updatedCount} users to Test123*\n";
