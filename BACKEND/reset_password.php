<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$user = User::where('email', 'Vijay123@sharklasers.com')->first();
if ($user) {
    $user->password = bcrypt('Test123*');
    $user->save();
    echo "Password reset successfully for " . $user->email . "\n";
} else {
    echo "User not found\n";
}
