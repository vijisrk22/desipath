<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BuySellItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class BuySellItemsRealisticSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('en_US');
        
        $categories = [
            "Home & Garden - Tools" => ["keyword" => "tools", "items" => ["Power Drill Set", "Lawn Mower", "Screwdriver Kit", "Table Saw", "Leaf Blower"]],
            "Home & Garden - Furniture" => ["keyword" => "furniture", "items" => ["Vintage Oak Dining Table", "IKEA Ektorp Sofa", "Queen Size Bed Frame", "Recliner Chair", "Bookshelf"]],
            "Home & Garden - Household" => ["keyword" => "home", "items" => ["Set of 4 Curtains", "Vacuum Cleaner", "Area Rug 5x8", "Wall Mirror", "Floor Lamp"]],
            "Home & Garden - Garden" => ["keyword" => "garden", "items" => ["Patio Umbrella", "Garden Hose 50ft", "Set of Planters", "Wheelbarrow", "Outdoor Seating Set"]],
            "Home & Garden - Appliances" => ["keyword" => "appliance", "items" => ["Stainless Steel Microwave", "Mini Fridge", "Toaster Oven", "Coffee Maker", "Washing Machine"]],
            "Entertainment - Video Games" => ["keyword" => "videogames", "items" => ["PlayStation 5 Console", "Nintendo Switch OLED", "Xbox Series X", "Collection of PS4 Games", "Gaming Headset"]],
            "Entertainment - Books, Movies & Music" => ["keyword" => "books", "items" => ["Harry Potter Hardcover Set", "Vinyl Record Collection", "Electric Keyboard", "Acoustic Guitar", "Lord of the Rings BluRay Set"]],
            "Clothing & Accessories - Bags & Luggage" => ["keyword" => "luggage", "items" => ["Samsonite Suitcase", "Leather Tote Bag", "Hiking Backpack", "Carry-on Luggage", "Designer Handbag"]],
            "Clothing & Accessories - Women's clothing & shoes" => ["keyword" => "dress", "items" => ["Zara Winter Coat", "Nike Running Shoes Women", "Floral Summer Dress", "Designer Heels", "Leather Jacket"]],
            "Clothing & Accessories - Men's clothing & shoes" => ["keyword" => "mensclothing", "items" => ["Levi's Denim Jacket", "Adidas Ultraboost Men", "Tailored Suit", "Winter Parka", "Leather Boots"]],
            "Clothing & Accessories - Jewelry & Accessories" => ["keyword" => "jewelry", "items" => ["Silver Necklace", "Gold Plated Watch", "Ray-Ban Aviator Sunglasses", "Diamond Earrings", "Leather Wallet"]],
            "Family - Health & beauty" => ["keyword" => "makeup", "items" => ["Unused Eyeshadow Palette", "Dyson Hair Dryer", "Perfume Gift Set", "Curling Iron", "Skincare Bundle"]],
            "Family - Pet Supplies" => ["keyword" => "pets", "items" => ["Large Dog Crate", "Cat Tree Tower", "Automatic Pet Feeder", "Aquarium 20 Gallon", "Dog Travel Bag"]],
            "Family - Baby & kids" => ["keyword" => "baby", "items" => ["Baby Stroller", "High Chair", "Crib with Mattress", "Baby Monitor", "Toddler Car Seat"]],
            "Family - Toys & Games" => ["keyword" => "toys", "items" => ["Lego Star Wars Set", "Barbie Dreamhouse", "Board Game Bundle", "Remote Control Car", "Nerf Blaster"]],
            "Electronics - Electronics & computers" => ["keyword" => "laptop", "items" => ["MacBook Pro 16", "Dell XPS 13", "iPad Pro 12.9", "Samsung 4K Monitor", "Logitech Wireless Mouse"]],
            "Electronics - Mobile phones" => ["keyword" => "smartphone", "items" => ["iPhone 14 Pro Max", "Samsung Galaxy S23 Ultra", "Google Pixel 7", "OnePlus 11", "iPhone 13 Unlocked"]],
            "Hobbies - Bicycles" => ["keyword" => "bicycle", "items" => ["Trek Mountain Bike", "Road Bike Shimano", "Kids BMX Bike", "Electric E-Bike", "Foldable City Bike"]],
            "Hobbies - Arts & Crafts" => ["keyword" => "art", "items" => ["Easel and Canvas Set", "Sewing Machine", "Oil Paint Set", "Sketching Pencils", "Cricut Maker"]],
            "Hobbies - Sports & Outdoors" => ["keyword" => "sports", "items" => ["TaylorMade Golf Clubs", "Tennis Racket Pro", "Camping Tent 4-Person", "Snowboard with Bindings", "Dumbbell Set 50lbs"]],
            "Hobbies - Auto parts" => ["keyword" => "carparts", "items" => ["Set of 4 Winter Tires", "Car Battery 12V", "Roof Rack Cargo Box", "WeatherTech Floor Mats", "LED Headlight Bulbs"]],
            "Hobbies - Musical Instruments" => ["keyword" => "guitar", "items" => ["Fender Stratocaster", "Yamaha Acoustic Guitar", "Roland Electronic Drum Kit", "Violin with Bow", "Korg Synthesizer"]]
        ];

        $conditions = ["New", "Used - Like new", "Used - Good", "Used - Fair"];

        // Top US cities and zipcodes
        $locations = [
            ['city' => 'New York', 'zip' => '10001'],
            ['city' => 'Los Angeles', 'zip' => '90001'],
            ['city' => 'Chicago', 'zip' => '60601'],
            ['city' => 'Houston', 'zip' => '77001'],
            ['city' => 'Phoenix', 'zip' => '85001'],
            ['city' => 'Philadelphia', 'zip' => '19101'],
            ['city' => 'San Antonio', 'zip' => '78201'],
            ['city' => 'San Diego', 'zip' => '92101'],
            ['city' => 'Dallas', 'zip' => '75201'],
            ['city' => 'San Jose', 'zip' => '95101'],
            ['city' => 'Austin', 'zip' => '73301'],
            ['city' => 'Jacksonville', 'zip' => '32099'],
            ['city' => 'Fort Worth', 'zip' => '76101'],
            ['city' => 'Columbus', 'zip' => '43085'],
            ['city' => 'San Francisco', 'zip' => '94101'],
            ['city' => 'Charlotte', 'zip' => '28201'],
            ['city' => 'Indianapolis', 'zip' => '46201'],
            ['city' => 'Seattle', 'zip' => '98101'],
            ['city' => 'Denver', 'zip' => '80201'],
            ['city' => 'Washington', 'zip' => '20001']
        ];

        // Fetch the existing 200 users created recently or all active users.
        // We'll just fetch the latest 200 users to ensure we hit the ones just created.
        $users = User::latest()->take(200)->get();
        
        $userIds = $users->pluck('id')->toArray();

        if (count($userIds) < 1) {
            $this->command->error('No users found in database. Cannot seed BuySellItems.');
            return;
        }

        $itemsToCreate = [];
        $categoriesKeys = array_keys($categories);

        for ($i = 0; $i < 200; $i++) {
            $catKey = $categoriesKeys[array_rand($categoriesKeys)];
            $catData = $categories[$catKey];
            
            $title = $catData["items"][array_rand($catData["items"])] . " " . $faker->optional(0.5, "")->word;
            $title = trim($title);
            
            $keyword = $catData["keyword"];
            
            // Generate realistic prices depending on condition
            $cond = $conditions[array_rand($conditions)];
            $price = $faker->randomFloat(2, 10, 800);
            if ($cond === 'Used - Fair') {
                $price = $price * 0.4;
            } elseif ($cond === 'New') {
                $price = $price * 1.5;
            }
            
            $loc = $locations[array_rand($locations)];
            
            $numImages = rand(1, 4);
            $pictures = [];
            for ($img = 0; $img < $numImages; $img++) {
                // Using loremflickr with a keyword and random lock to avoid browser cache issues
                $randomHash = rand(1000, 99999);
                $pictures[] = "https://loremflickr.com/640/480/{$keyword}?lock={$randomHash}";
            }

            // Random user assignment
            $userId = $userIds[array_rand($userIds)];

            $itemsToCreate[] = [
                'user_id' => $userId,
                'title' => $title,
                'category' => $catKey,
                'price' => round($price, 2),
                'condition' => $cond,
                'description' => $faker->paragraphs(rand(1, 3), true),
                'zipcode' => $loc['zip'],
                'city' => $loc['city'],
                'status' => 'active',
                'pictures' => json_encode($pictures),
                'created_at' => now()->subDays(rand(0, 30)),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($itemsToCreate, 50) as $chunk) {
            BuySellItem::insert($chunk);
        }
        
        $this->command->info('200 realistic Buy/Sell Items created successfully!');
    }
}
