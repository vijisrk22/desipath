<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BuySellItem;
use App\Models\User;

class BuySellItemsSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create();
        }

        $locations = [
            ['city' => 'Edison', 'zipcode' => '08817'],
            ['city' => 'Edison', 'zipcode' => '08820'],
            ['city' => 'Iselin', 'zipcode' => '08830'],
            ['city' => 'Jersey City', 'zipcode' => '07302'],
            ['city' => 'Jersey City', 'zipcode' => '07306'],
            ['city' => 'Newark', 'zipcode' => '07102'],
            ['city' => 'Parsippany', 'zipcode' => '07054'],
            ['city' => 'Cherry Hill', 'zipcode' => '08003'],
            ['city' => 'Princeton', 'zipcode' => '08540'],
            ['city' => 'Hoboken', 'zipcode' => '07030'],
        ];

        $categories = [
            'Electronics' => [
                ['title' => 'iPhone 13 Pro 256GB', 'price' => 500, 'condition' => 'Used - Like New'],
                ['title' => 'Samsung 4K TV 65"', 'price' => 350, 'condition' => 'Used - Good'],
                ['title' => 'MacBook Air M1 2020', 'price' => 600, 'condition' => 'Used - Very Good'],
                ['title' => 'Sony PlayStation 5 Console', 'price' => 400, 'condition' => 'Used - Like New'],
                ['title' => 'Nintendo Switch OLED', 'price' => 250, 'condition' => 'Used - Good'],
            ],
            'Furniture' => [
                ['title' => 'IKEA Kivik Sofa', 'price' => 200, 'condition' => 'Used - Good'],
                ['title' => 'Solid Wood Dining Table Set', 'price' => 450, 'condition' => 'Used - Very Good'],
                ['title' => 'Queen Size Bed Frame', 'price' => 150, 'condition' => 'Used - Like New'],
                ['title' => 'Office Desk with Chair', 'price' => 120, 'condition' => 'Used - Good'],
            ],
            'Home & Kitchen' => [
                ['title' => 'KitchenAid Stand Mixer', 'price' => 250, 'condition' => 'Used - Like New'],
                ['title' => 'Dyson V11 Vacuum Cleaner', 'price' => 300, 'condition' => 'Used - Good'],
                ['title' => 'Ninja Air Fryer', 'price' => 80, 'condition' => 'Used - Very Good'],
            ],
            'Sports & Outdoors' => [
                ['title' => 'Trek Mountain Bike', 'price' => 350, 'condition' => 'Used - Good'],
                ['title' => 'Golf Clubs Set with Bag', 'price' => 150, 'condition' => 'Used - Fair'],
                ['title' => 'Camping Tent 4-Person', 'price' => 60, 'condition' => 'Used - Like New'],
            ],
            'Toys & Games' => [
                ['title' => 'Lego Star Wars Set', 'price' => 45, 'condition' => 'New'],
                ['title' => 'Board Games Bundle', 'price' => 30, 'condition' => 'Used - Good'],
            ],
            'Clothing & Accessories' => [
                ['title' => 'Men\'s Winter Jacket', 'price' => 50, 'condition' => 'Used - Very Good'],
                ['title' => 'Women\'s Designer Handbag', 'price' => 120, 'condition' => 'Used - Like New'],
                ['title' => 'Vintage Ray-Ban Sunglasses', 'price' => 80, 'condition' => 'Used - Good'],
            ]
        ];

        $items = [];
        foreach ($categories as $category => $products) {
            foreach ($products as $product) {
                $loc = $locations[array_rand($locations)];
                $items[] = [
                    'user_id' => $user->id,
                    'title' => $product['title'],
                    'category' => $category,
                    'price' => $product['price'],
                    'condition' => $product['condition'],
                    'description' => "Selling my {$product['title']}. It is in {$product['condition']} condition. Available for pickup in {$loc['city']}, NJ. Message me for more details.",
                    'zipcode' => $loc['zipcode'],
                    'city' => $loc['city'],
                    'pictures' => json_encode([]),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Shuffle and take exactly 20 items
        shuffle($items);
        $itemsToInsert = array_slice($items, 0, 20);

        BuySellItem::insert($itemsToInsert);
    }
}
