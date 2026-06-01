<?php
use App\Models\BuySellItem;
use App\Models\User;
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$imageMap = [
    'Lego Star Wars Set' => 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
    'Camping Tent 4-Person' => 'https://images.unsplash.com/photo-1504280390227-36109eb97bd4?w=800&q=80',
    'Ninja Air Fryer' => 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80',
    'Solid Wood Dining Table Set' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80',
    'Golf Clubs Set with Bag' => 'https://images.unsplash.com/photo-1593111774240-d529f12cb416?w=800&q=80',
    'Queen Size Bed Frame' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    "Women's Designer Handbag" => 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    'Trek Mountain Bike' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
    'KitchenAid Stand Mixer' => 'https://images.unsplash.com/photo-1595089304386-8a4db9447432?w=800&q=80',
    'Vintage Ray-Ban Sunglasses' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    'Dyson V11 Vacuum Cleaner' => 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    'Office Desk with Chair' => 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80',
    'Board Games Bundle' => 'https://images.unsplash.com/photo-1611891487122-2075b9d76c76?w=800&q=80',
    'Samsung 4K TV 65"' => 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
    "Men's Winter Jacket" => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    'IKEA Kivik Sofa' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'iPhone 13 Pro 256GB' => 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80',
    'MacBook Air M1 2020' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    'Nintendo Switch OLED' => 'https://images.unsplash.com/photo-1612282130134-49b828ac4642?w=800&q=80',
    'Sony PlayStation 5 Console' => 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
];

$users = User::take(30)->get();
$items = BuySellItem::all();

foreach($items as $i) {
    if (isset($imageMap[$i->title])) {
        $i->pictures = [$imageMap[$i->title]];
    }
    // Random user
    $randomUser = $users->random();
    $i->user_id = $randomUser->id;
    $i->save();
}
echo "Successfully updated items with relevant images and real users.\n";
