<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'playwright@example.com')->first();
if ($user) {
    echo $user->createToken('auth')->plainTextToken;
} else {
    echo "USER_NOT_FOUND";
}
