<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SecureMatchProfile;
use App\Models\SecureMatchPhoto;
use Faker\Factory as Faker;

class SecureMatchProfileSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Get 15 users who don't already have a profile
        $users = User::doesntHave('secureMatchProfile')->take(15)->get();
        
        if ($users->isEmpty()) {
            $this->command->info('No eligible users found to seed profiles. Ensure there are users without profiles in the database.');
            return;
        }

        $communities = ['Telugu', 'Tamil', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Hindi', 'Malayali'];
        $religions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain'];
        $educations = ['MS in Computer Science', 'MBA', 'B.Tech', 'Ph.D', 'M.Tech', 'Medical Degree'];
        $professions = ['Software Engineer', 'Data Scientist', 'Business Analyst', 'Product Manager', 'Physician', 'Financial Analyst', 'Consultant'];
        $cities = ['San Francisco', 'New York', 'Chicago', 'Austin', 'Dallas', 'Seattle', 'Atlanta', 'Boston'];
        $residencyTiers = ['Citizen', 'PR', 'H1B', 'Student'];

        $count = 0;
        foreach ($users as $user) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $isMale = $gender === 'Male';
            
            $profile = SecureMatchProfile::create([
                'user_id' => $user->id,
                'display_name' => $isMale ? $faker->firstNameMale : $faker->firstNameFemale,
                'dob' => $faker->dateTimeBetween('-40 years', '-22 years')->format('Y-m-d'),
                'gender' => $gender,
                'community' => $faker->randomElement($communities),
                'religion' => $faker->randomElement($religions),
                'education' => $faker->randomElement($educations),
                'profession' => $faker->randomElement($professions),
                'company_name' => $faker->company,
                'languages_spoken' => [$faker->randomElement(['English', 'Hindi']), $faker->randomElement($communities)],
                'city' => $faker->randomElement($cities),
                'country' => 'USA',
                'residency_tier' => $faker->randomElement($residencyTiers),
                'food_preference' => $faker->randomElement(['Vegetarian', 'Non-Vegetarian', 'Eggetarian']),
                'about_me' => "I am a working professional based in the US. " . $faker->realText(100),
                'family_details' => "We are a well-educated family from India. " . $faker->sentence(10),
                'contact_phone' => $faker->phoneNumber,
                'contact_email' => $faker->safeEmail,
                'created_by_relative' => $faker->boolean(20),
                'status' => 'active',
                'trust_score' => $faker->numberBetween(70, 100),
            ]);

            // Add primary photo
            $photoIndex = $faker->numberBetween(1, 99);
            $photoUrl = $isMale 
                ? "https://randomuser.me/api/portraits/men/{$photoIndex}.jpg"
                : "https://randomuser.me/api/portraits/women/{$photoIndex}.jpg";

            SecureMatchPhoto::create([
                'profile_id' => $profile->id,
                'photo_url' => $photoUrl,
                'is_primary' => true,
                'order_index' => 0
            ]);

            // Optional: Add some secondary album photos
            for ($i = 1; $i <= $faker->numberBetween(1, 3); $i++) {
                $albumPhotoIndex = $faker->numberBetween(1, 99);
                $albumPhotoUrl = $isMale 
                    ? "https://randomuser.me/api/portraits/men/{$albumPhotoIndex}.jpg"
                    : "https://randomuser.me/api/portraits/women/{$albumPhotoIndex}.jpg";

                SecureMatchPhoto::create([
                    'profile_id' => $profile->id,
                    'photo_url' => $albumPhotoUrl,
                    'is_primary' => false,
                    'order_index' => $i
                ]);
            }

            $count++;
        }

        $this->command->info("Successfully seeded {$count} SecureMatch profiles with realistic data and photos!");
    }
}
