<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$file = 'C:/Users/vivek/.gemini/antigravity/brain/365f1963-c84c-4454-96e2-5581999b813c/.system_generated/logs/transcript.jsonl';
$lines = file($file);

$password = Hash::make('DP_Test123*');
$count = 0;

foreach($lines as $line) {
    $data = json_decode($line, true);
    if(isset($data['type']) && $data['type'] === 'USER_INPUT') {
        $content = $data['content'];
        preg_match_all('/([A-Za-z]+),([A-Za-z]+),([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/', $content, $matches, PREG_SET_ORDER);
        
        foreach($matches as $m) {
            $name = trim($m[1]) . ' ' . trim($m[2]);
            $email = trim($m[3]);
            
            $exists = User::where('email', $email)->exists();
            if (!$exists) {
                User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => $password,
                    'email_verified_at' => now(),
                ]);
                $count++;
            }
        }
    }
}

echo "Created $count users.\n";
