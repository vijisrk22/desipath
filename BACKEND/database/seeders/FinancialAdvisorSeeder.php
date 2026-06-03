<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FinancialAdvisor;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class FinancialAdvisorSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        
        // Get up to 100 users, or create them if they don't exist
        $users = User::inRandomOrder()->limit(100)->get();
        if ($users->count() < 100) {
            for ($i = 0; $i < 100 - $users->count(); $i++) {
                User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => bcrypt('password123'),
                ]);
            }
            $users = User::inRandomOrder()->limit(100)->get();
        }

        $services = ['401k', 'Annuity', 'Health Insurance', 'Life Insurance', 'Travel Insurance', 'Retirement Planning', 'Tax Optimization', 'Wealth Management', 'Cross-Border Planning'];
        $credentials = ['CFP', 'CFA', 'CPA', 'ChFC', 'RIA'];
        $languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Gujarati', 'Punjabi', 'Malayalam'];
        
        foreach ($users as $user) {
            $name = $faker->name;
            $slug = FinancialAdvisor::generateSlug($name);
            
            FinancialAdvisor::create([
                'user_id' => $user->id,
                'consultant_name' => $name,
                'advisor_profile_image' => 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&background=random',
                'cover_image' => 'https://source.unsplash.com/random/800x400/?finance,office',
                'qualifications' => 'MBA, ' . $faker->randomElement(['Finance', 'Economics', 'Business']),
                'accreditations' => $faker->randomElement(['Certified Financial Planner', 'Registered Investment Advisor']),
                'slug' => $slug,
                'firm_name' => $faker->company . ' Financial LLC',
                'years_experience' => $faker->numberBetween(3, 30),
                'nri_specialist_statement' => 'Specializing in cross-border tax issues and NRI wealth management for over ' . $faker->numberBetween(3, 20) . ' years.',
                'accepting_new_clients' => $faker->boolean(80),
                'profile_status' => 'active',
                'fbar_fatca_advisory' => $faker->boolean(70),
                'pfic_advisory' => $faker->boolean(60),
                'dtaa_optimization' => $faker->boolean(80),
                'return_to_india_planning' => $faker->boolean(90),
                'india_investments' => $faker->boolean(85),
                'finra_crd_number' => $faker->numerify('#######'),
                'sec_ria_registration' => $faker->boolean(50) ? $faker->numerify('SEC-####') : null,
                'sebi_registration' => $faker->boolean(40) ? $faker->numerify('SEBI-####') : null,
                'disciplinary_history' => $faker->boolean(5),
                'services' => $faker->randomElements($services, $faker->numberBetween(2, 5)),
                'credentials' => $faker->randomElements($credentials, $faker->numberBetween(1, 3)),
                'fee_structure_type' => $faker->randomElement(['fee-only', 'fee-based', 'commission', 'hybrid']),
                'minimum_investment' => $faker->randomElement([0, 50000, 100000, 250000, 500000]),
                'aum_fee_percentage' => $faker->randomFloat(2, 0.5, 2.0),
                'hourly_rate' => $faker->randomElement([150, 200, 250, 300, 400]),
                'primary_city' => $faker->city,
                'state' => $faker->stateAbbr,
                'states_licensed' => $faker->randomElements(['CA', 'TX', 'NY', 'NJ', 'FL', 'IL', 'WA', 'VA'], $faker->numberBetween(1, 5)),
                'zip_code' => $faker->postcode,
                'languages' => $faker->randomElements($languages, $faker->numberBetween(1, 4)),
                'virtual_consultation' => $faker->boolean(95),
                'india_time_zone_consultation' => $faker->boolean(75),
                'contact_email' => $faker->companyEmail,
                'contact_phone' => $faker->phoneNumber,
                'website' => $faker->url,
                'free_consultation' => $faker->boolean(70),
            ]);
        }
    }
}
