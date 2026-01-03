<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        $this->call([
            AstrologyAdsSeeder::class,
            BuySellCarsSeeder::class,
            BuySellHomesSeeder::class,
            ClassesForKidsAdsSeeder::class,
            RentalHomesSeeder::class,
            RoomMatesSeeder::class,
            TrainingAdsSeeder::class,
            TravelCompanionsSeeder::class,
            LocationStateCityZipSeeder::class
        ]);
    }
}
