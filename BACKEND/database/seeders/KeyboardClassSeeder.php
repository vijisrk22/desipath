<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Instructor;
use App\Models\KidsClass;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class KeyboardClassSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Vivek', 'email' => 'vivek@test.com'],
            ['name' => 'Vijay', 'email' => 'vijay@test.com'],
            ['name' => 'Vikram', 'email' => 'vikram123@sharklasers.com'],
            ['name' => 'Rita', 'email' => 'rita123@sharklasers.com'],
            ['name' => 'Ram', 'email' => 'ram@sharklasers.com'],
        ];

        foreach ($users as $userData) {
            // Create or Update User
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('12345678'),
                    'role' => 'instructor', // Assuming there's an instructor role or it's a category
                    'status' => 'active'
                ]
            );

            // Create Instructor Profile
            $instructor = Instructor::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $userData['name'],
                    'account_type' => 'individual',
                    'bio' => 'Experienced keyboard instructor looking to share the joy of music.',
                    'years_experience' => 5,
                ]
            );

            // Post Keyboard Class
            KidsClass::create([
                'id' => (string) Str::uuid(),
                'instructor_id' => $instructor->id,
                'title' => 'Beginning Keyboard for Kids by ' . $userData['name'],
                'category' => 'music',
                'subcategory' => 'keyboard',
                'level' => json_encode(['beginner']),
                'format' => json_encode(['online']),
                'short_description' => 'Learn the basics of keyboard in a fun, interactive setting.',
                'long_description' => 'This class covers basic music theory, finger positioning, and playing simple songs. Perfect for kids aged 5-12.',
                'status' => 'active',
                'visibility' => 'public',
                'age_group_min' => 5,
                'age_group_max' => 12,
            ]);
        }
    }
}
