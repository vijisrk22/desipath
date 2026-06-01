<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Photographer;
use App\Models\User;
use Faker\Factory as Faker;
use App\Models\UsaZipcode;

class PhotographerSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('en_US');
        $user = User::first();
        if (!$user) return;

        // Truncate existing data to avoid duplication on re-run
        // Photographer::truncate();

        $names = [
            'Arjun', 'Vikram', 'Ravi', 'Sanjay', 'Amit', 'Rahul', 'Vivek', 'Karthik', 'Nitin', 'Manoj',
            'Priya', 'Neha', 'Anjali', 'Kavya', 'Sneha', 'Meera', 'Riya', 'Aarti', 'Divya', 'Pooja',
            'Karan', 'Deepak', 'Suresh', 'Rajesh', 'Gaurav', 'Manish', 'Naveen', 'Ashish', 'Varun', 'Rohan',
            'Swati', 'Shruti', 'Anushka', 'Radhika', 'Priyanka', 'Simran', 'Tanvi', 'Ishita', 'Sakshi', 'Aditi',
            'Sameer', 'Tarun', 'Anand', 'Vishal', 'Ajay', 'Vikas', 'Prakash', 'Sunil', 'Yash', 'Sahil'
        ];
        
        $surnames = [
            'Patel', 'Sharma', 'Singh', 'Kumar', 'Reddy', 'Rao', 'Gupta', 'Desai', 'Joshi', 'Shah',
            'Mehta', 'Nair', 'Bose', 'Das', 'Chatterjee', 'Iyer', 'Menon', 'Verma', 'Chopra', 'Malhotra'
        ];

        // Fetch some real USA zipcodes to make radius search work
        $zipcodes = UsaZipcode::inRandomOrder()->limit(50)->get();
        if ($zipcodes->isEmpty()) {
            // Fallback zipcodes with coords
            $zipcodes = collect([
                (object)['zip' => '10001', 'city' => 'New York', 'state_id' => 'NY', 'lat' => 40.71, 'lng' => -74.00],
                (object)['zip' => '90001', 'city' => 'Los Angeles', 'state_id' => 'CA', 'lat' => 34.05, 'lng' => -118.24],
                (object)['zip' => '60601', 'city' => 'Chicago', 'state_id' => 'IL', 'lat' => 41.87, 'lng' => -87.62],
                (object)['zip' => '77001', 'city' => 'Houston', 'state_id' => 'TX', 'lat' => 29.76, 'lng' => -95.36],
                (object)['zip' => '85001', 'city' => 'Phoenix', 'state_id' => 'AZ', 'lat' => 33.44, 'lng' => -112.07],
            ]);
        }

        $servicesList = [
            'Photography Services' => ['Wedding Photography', 'Event Photography', 'Portrait Photography', 'Maternity Photography', 'Newborn Photography'],
            'Videography Services' => ['Wedding Videography', 'Cinematic Film', 'Event Videography', 'Drone Footage'],
            'Specialty Services' => ['Photo Editing / Retouching', 'Highlight Reel', 'Same Day Edit']
        ];

        $serviceTypes = ['Photographer', 'Videographer', 'Both'];

        for ($i = 0; $i < 50; $i++) {
            $firstName = $faker->randomElement($names);
            $lastName = $faker->randomElement($surnames);
            
            $gender = in_array($firstName, ['Priya', 'Neha', 'Anjali', 'Kavya', 'Sneha', 'Meera', 'Riya', 'Aarti', 'Divya', 'Pooja', 'Swati', 'Shruti', 'Anushka', 'Radhika', 'Priyanka', 'Simran', 'Tanvi', 'Ishita', 'Sakshi', 'Aditi']) ? 'women' : 'men';
            $faceId = $faker->numberBetween(1, 99);
            $profilePic = "https://randomuser.me/api/portraits/{$gender}/{$faceId}.jpg";

            $zipData = $zipcodes->random();

            $p = Photographer::create([
                'user_id' => $user->id,
                'title' => $firstName . ' ' . $lastName . ' Photography',
                'bio' => "Professional " . strtolower($faker->randomElement($serviceTypes)) . " specializing in South Asian weddings and events. " . $faker->paragraph(2),
                'service_type' => $faker->randomElement($serviceTypes),
                'experience_years' => $faker->numberBetween(2, 20),
                'languages' => $faker->randomElement(['English, Hindi', 'English, Gujarati', 'English, Tamil', 'English, Telugu, Hindi', 'English, Punjabi']),
                'services' => [
                    'Photography Services' => (array) $faker->randomElements($servicesList['Photography Services'], rand(1, 4)),
                    'Videography Services' => (array) $faker->randomElements($servicesList['Videography Services'], rand(1, 3)),
                    'Specialty Services' => (array) $faker->randomElements($servicesList['Specialty Services'], rand(1, 2))
                ],
                'status' => 'active',
                'profile_photo' => $profilePic,
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'open_to_travel' => $faker->boolean(70),
                'travel_policy' => 'Will travel up to 200 miles for events. Travel fees apply outside 50 miles.'
            ]);

            $p->packages()->create([
                'name' => 'Essential Package',
                'price' => $faker->numberBetween(800, 1500),
                'description' => '4 hours coverage, high-res digital images'
            ]);

            $p->packages()->create([
                'name' => 'Premium Package',
                'price' => $faker->numberBetween(2000, 4000),
                'description' => '8 hours coverage, 2 photographers, cinematic highlight film'
            ]);

            $p->locations()->create([
                'city' => $zipData->city ?? 'Unknown',
                'state' => $zipData->state_id ?? 'XX',
                'zipcode' => $zipData->zip ?? '00000',
                'lat' => $zipData->lat ?? 0,
                'lng' => $zipData->lng ?? 0
            ]);
        }
    }
}
