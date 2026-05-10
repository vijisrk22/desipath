<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ForumSubforum;

$updates = [
    'GC, H1B Visa discussion' => 'H1B Visa discussion',
    'Higher Studies like MS, MBA' => 'About Studies',
    'School and Kids' => 'Kids'
];

foreach ($updates as $old => $new) {
    $sub = ForumSubforum::where('name', $old)->first();
    if ($sub) {
        $sub->update(['name' => $new]);
        echo "Updated '{$old}' to '{$new}'\n";
    }
}
