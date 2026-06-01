<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ForumPost;

$posts = ForumPost::orderBy('created_at', 'desc')->limit(10)->get();
foreach ($posts as $post) {
    echo "- ID: {$post->id} | Title: {$post->title} | Category: {$post->category} | Created: {$post->created_at}\n";
}
