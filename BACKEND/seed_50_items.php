<?php
use App\Models\BuySellItem;
use App\Models\User;
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$locations = [
    ['city' => 'Los Angeles', 'zipcode' => '90001'],
    ['city' => 'Los Angeles', 'zipcode' => '90015'],
    ['city' => 'Hollywood', 'zipcode' => '90028'],
    ['city' => 'San Diego', 'zipcode' => '92101'],
    ['city' => 'San Diego', 'zipcode' => '92115'],
    ['city' => 'Irvine', 'zipcode' => '92602'],
    ['city' => 'Irvine', 'zipcode' => '92612'],
    ['city' => 'Santa Monica', 'zipcode' => '90401'],
    ['city' => 'Anaheim', 'zipcode' => '92801'],
    ['city' => 'Long Beach', 'zipcode' => '90802'],
];

$itemsData = [
    // Electronics - Electronics & computers
    ['title' => 'Dell XPS 15 Laptop', 'cat' => 'Electronics - Electronics & computers', 'price' => 850, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'],
    ['title' => 'Logitech MX Master 3 Mouse', 'cat' => 'Electronics - Electronics & computers', 'price' => 60, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
    ['title' => 'LG 27" 4K Monitor', 'cat' => 'Electronics - Electronics & computers', 'price' => 200, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800&q=80'],
    ['title' => 'Apple iPad Pro 11"', 'cat' => 'Electronics - Electronics & computers', 'price' => 500, 'cond' => 'Used - Very Good', 'img' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'],
    ['title' => 'Custom Built Gaming PC', 'cat' => 'Electronics - Electronics & computers', 'price' => 1200, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80'],

    // Electronics - Mobile phones
    ['title' => 'iPhone 14 Pro Max 512GB', 'cat' => 'Electronics - Mobile phones', 'price' => 900, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80'],
    ['title' => 'Samsung Galaxy S22 Ultra', 'cat' => 'Electronics - Mobile phones', 'price' => 700, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1647463510006-c8f357f8849b?w=800&q=80'],
    ['title' => 'Google Pixel 7 Pro', 'cat' => 'Electronics - Mobile phones', 'price' => 650, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1667554907869-79a0994d4d6a?w=800&q=80'],
    ['title' => 'OnePlus 10 Pro', 'cat' => 'Electronics - Mobile phones', 'price' => 450, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'],

    // Hobbies - Bicycles
    ['title' => 'Specialized Road Bike', 'cat' => 'Hobbies - Bicycles', 'price' => 1100, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'],
    ['title' => 'Cannondale Mountain Bike', 'cat' => 'Hobbies - Bicycles', 'price' => 850, 'cond' => 'Used - Fair', 'img' => 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80'],
    ['title' => 'Vintage Cruiser Bicycle', 'cat' => 'Hobbies - Bicycles', 'price' => 150, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80'],
    ['title' => 'Electric E-Bike', 'cat' => 'Hobbies - Bicycles', 'price' => 1200, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=800&q=80'],

    // Hobbies - Arts & Crafts
    ['title' => 'Professional Oil Paint Set', 'cat' => 'Hobbies - Arts & Crafts', 'price' => 40, 'cond' => 'New', 'img' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80'],
    ['title' => 'Wooden Easel Stand', 'cat' => 'Hobbies - Arts & Crafts', 'price' => 25, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'],
    ['title' => 'Singer Sewing Machine', 'cat' => 'Hobbies - Arts & Crafts', 'price' => 150, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1563213000-84c68832a829?w=800&q=80'],
    
    // Hobbies - Sports & Outdoors
    ['title' => 'Wilson Tennis Racket', 'cat' => 'Hobbies - Sports & Outdoors', 'price' => 60, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80'],
    ['title' => 'Titleist Golf Clubs Complete Set', 'cat' => 'Hobbies - Sports & Outdoors', 'price' => 300, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1593111774240-d529f12cb416?w=800&q=80'],
    ['title' => 'Coleman 6-Person Tent', 'cat' => 'Hobbies - Sports & Outdoors', 'price' => 120, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1504280390227-36109eb97bd4?w=800&q=80'],
    ['title' => 'Yeti Tundra 45 Cooler', 'cat' => 'Hobbies - Sports & Outdoors', 'price' => 250, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1623000958169-216e5f32eb45?w=800&q=80'],

    // Hobbies - Musical Instruments
    ['title' => 'Yamaha Acoustic Guitar', 'cat' => 'Hobbies - Musical Instruments', 'price' => 180, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80'],
    ['title' => 'Fender Stratocaster Electric Guitar', 'cat' => 'Hobbies - Musical Instruments', 'price' => 600, 'cond' => 'Used - Very Good', 'img' => 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&q=80'],
    ['title' => 'Casio Digital Keyboard', 'cat' => 'Hobbies - Musical Instruments', 'price' => 200, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&q=80'],
    ['title' => 'Pearl Drum Set', 'cat' => 'Hobbies - Musical Instruments', 'price' => 450, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80'],

    // Home & Garden - Furniture
    ['title' => 'L-Shaped Sectional Sofa', 'cat' => 'Home & Garden - Furniture', 'price' => 400, 'cond' => 'Used - Fair', 'img' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    ['title' => 'Mid-Century Modern Coffee Table', 'cat' => 'Home & Garden - Furniture', 'price' => 150, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80'],
    ['title' => 'Solid Oak Dining Table', 'cat' => 'Home & Garden - Furniture', 'price' => 300, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80'],
    ['title' => 'Ergonomic Office Chair', 'cat' => 'Home & Garden - Furniture', 'price' => 80, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'],

    // Home & Garden - Appliances
    ['title' => 'Breville Espresso Machine', 'cat' => 'Home & Garden - Appliances', 'price' => 350, 'cond' => 'Used - Very Good', 'img' => 'https://images.unsplash.com/photo-1585592186835-be021a812328?w=800&q=80'],
    ['title' => 'Dyson Pure Cool Air Purifier', 'cat' => 'Home & Garden - Appliances', 'price' => 200, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80'],
    ['title' => 'Vitamix Blender', 'cat' => 'Home & Garden - Appliances', 'price' => 250, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1589255850901-b3deecf4b8fa?w=800&q=80'],

    // Home & Garden - Tools
    ['title' => 'DeWalt 20V Max Drill Combo Kit', 'cat' => 'Home & Garden - Tools', 'price' => 120, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80'],
    ['title' => 'Craftsman 165-Piece Tool Set', 'cat' => 'Home & Garden - Tools', 'price' => 90, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80'],

    // Entertainment - Video Games
    ['title' => 'Xbox Series X 1TB Console', 'cat' => 'Entertainment - Video Games', 'price' => 450, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80'],
    ['title' => 'PlayStation VR2', 'cat' => 'Entertainment - Video Games', 'price' => 400, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80'],
    ['title' => 'Retro Super Nintendo Console', 'cat' => 'Entertainment - Video Games', 'price' => 80, 'cond' => 'Used - Fair', 'img' => 'https://images.unsplash.com/photo-1531525645387-7f14be1bfc75?w=800&q=80'],

    // Clothing & Accessories - Bags & Luggage
    ['title' => 'Samsonite Hard Shell Suitcase', 'cat' => 'Clothing & Accessories - Bags & Luggage', 'price' => 110, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&q=80'],
    ['title' => 'Leather Messenger Bag', 'cat' => 'Clothing & Accessories - Bags & Luggage', 'price' => 75, 'cond' => 'Used - Very Good', 'img' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],

    // Clothing & Accessories - Women's clothing & shoes
    ['title' => 'Nike Air Force 1 Women Size 7', 'cat' => 'Clothing & Accessories - Women\'s clothing & shoes', 'price' => 65, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
    ['title' => 'North Face Winter Coat Small', 'cat' => 'Clothing & Accessories - Women\'s clothing & shoes', 'price' => 120, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],

    // Clothing & Accessories - Men's clothing & shoes
    ['title' => 'Air Jordan 4 Retro Size 10', 'cat' => 'Clothing & Accessories - Men\'s clothing & shoes', 'price' => 250, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'],
    ['title' => 'Levi\'s Denim Jacket Medium', 'cat' => 'Clothing & Accessories - Men\'s clothing & shoes', 'price' => 45, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80'],

    // Clothing & Accessories - Jewelry & Accessories
    ['title' => 'Ray-Ban Wayfarer Sunglasses', 'cat' => 'Clothing & Accessories - Jewelry & Accessories', 'price' => 85, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'],
    ['title' => 'Fossil Chronograph Watch', 'cat' => 'Clothing & Accessories - Jewelry & Accessories', 'price' => 50, 'cond' => 'Used - Fair', 'img' => 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'],

    // Family - Toys & Games
    ['title' => 'Lego City Fire Station', 'cat' => 'Family - Toys & Games', 'price' => 40, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80'],
    ['title' => 'Nerf Gun Collection', 'cat' => 'Family - Toys & Games', 'price' => 30, 'cond' => 'Used - Fair', 'img' => 'https://images.unsplash.com/photo-1558231572-88fcfb567d02?w=800&q=80'],
    ['title' => 'Barbie Dreamhouse', 'cat' => 'Family - Toys & Games', 'price' => 100, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1595180053913-b565a5076cf4?w=800&q=80'],
    ['title' => 'Hot Wheels Track Builder', 'cat' => 'Family - Toys & Games', 'price' => 25, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1581458925576-0f81d1136b69?w=800&q=80'],
    
    // Additional items to reach exactly 50
    ['title' => 'GoPro Hero 10 Black', 'cat' => 'Electronics - Electronics & computers', 'price' => 250, 'cond' => 'Used - Like new', 'img' => 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80'],
    ['title' => 'Kindle Paperwhite 8GB', 'cat' => 'Electronics - Electronics & computers', 'price' => 70, 'cond' => 'Used - Good', 'img' => 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80'],
];

$users = User::take(50)->get();
$itemsToInsert = [];

foreach ($itemsData as $idx => $data) {
    $loc = $locations[array_rand($locations)];
    $randomUser = $users->random();
    
    $item = new BuySellItem();
    $item->user_id = $randomUser->id;
    $item->title = $data['title'];
    $item->category = $data['cat'];
    $item->price = $data['price'];
    $item->condition = $data['cond'];
    $item->description = "Selling my " . $data['title'] . ". Condition is " . $data['cond'] . ". Works perfectly, local pickup in " . $loc['city'] . " area. Please contact me if you are interested or have any questions!";
    $item->zipcode = $loc['zipcode'];
    $item->city = $loc['city'];
    $item->pictures = [$data['img']];
    $item->status = 'active';
    $item->save();
}

echo "Successfully seeded " . count($itemsData) . " postings in Southern California!";
