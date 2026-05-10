<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ForumPost;
use App\Models\ForumSubforum;

echo "--- Post Categories in Database ---\n";
$postCategories = ForumPost::select('category')->distinct()->pluck('category');
foreach ($postCategories as $cat) {
    echo "- " . ($cat ?: '[NULL]') . "\n";
}

echo "\n--- Subforums in Database ---\n";
$subforums = ForumSubforum::all()->pluck('name');
foreach ($subforums as $sub) {
    echo "- " . $sub . "\n";
}

echo "\n--- Sample Post ---\n";
$post = ForumPost::first();
if ($post) {
    print_r($post->toArray());
} else {
    echo "No posts found.\n";
}
