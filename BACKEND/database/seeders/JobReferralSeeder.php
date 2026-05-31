<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobReferral;
use App\Models\User;
use Faker\Factory as Faker;

class JobReferralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        $users = User::all();
        if ($users->count() === 0) {
            $this->command->info('No users found in database. Skipping JobReferralSeeder.');
            return;
        }

        $companies = [
            'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 
            'Uber', 'Airbnb', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 
            'Adobe', 'PayPal', 'LinkedIn', 'Twitter', 'Snap', 'Spotify', 'Stripe'
        ];

        $roles = [
            'Software Engineer', 'Senior Software Engineer', 'Data Scientist', 
            'Product Manager', 'UX Designer', 'DevOps Engineer', 'Cloud Architect', 
            'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer',
            'Full Stack Developer', 'Engineering Manager', 'QA Engineer', 'Security Analyst'
        ];

        $locations = [
            ['city' => 'San Francisco', 'state' => 'CA', 'zipcode' => '94105'],
            ['city' => 'San Jose', 'state' => 'CA', 'zipcode' => '95113'],
            ['city' => 'New York', 'state' => 'NY', 'zipcode' => '10001'],
            ['city' => 'Seattle', 'state' => 'WA', 'zipcode' => '98101'],
            ['city' => 'Austin', 'state' => 'TX', 'zipcode' => '78701'],
            ['city' => 'Chicago', 'state' => 'IL', 'zipcode' => '60601'],
            ['city' => 'Boston', 'state' => 'MA', 'zipcode' => '02108'],
            ['city' => 'Atlanta', 'state' => 'GA', 'zipcode' => '30303'],
            ['city' => 'Denver', 'state' => 'CO', 'zipcode' => '80202'],
            ['city' => 'Dallas', 'state' => 'TX', 'zipcode' => '75201']
        ];

        $descriptions = [
            "I have a strong background in scalable systems and looking to join an innovative team.",
            "Passionate about building intuitive user experiences. Would love a referral to the frontend team.",
            "Experienced with cloud migrations and AWS/Azure. Seeking opportunities in a fast-paced environment.",
            "Looking to transition into a product role. Have 5+ years of engineering experience to back it up.",
            "Recent grad looking for entry-level opportunities. Strong foundation in algorithms and web dev.",
            "Highly experienced data professional looking to lead data science initiatives.",
            "I have been working with distributed systems for the last 4 years. Seeking a senior engineering role."
        ];

        $offerDescriptions = [
            "We are hiring across multiple teams. Happy to refer strong candidates!",
            "My team is looking for talented engineers. DM me your resume if interested.",
            "Lots of open positions in the cloud division. Let's chat before I refer you.",
            "We have remote openings for senior roles. Reach out with your background.",
            "I can refer for product and engineering roles. Please have a solid resume ready.",
            "Looking to refer diverse talent for our upcoming hiring drive.",
            "Our start-up is scaling fast. Looking for proactive folks to join us!"
        ];

        // Create 50 Requests
        for ($i = 0; $i < 50; $i++) {
            $loc = $faker->randomElement($locations);
            JobReferral::create([
                'user_id' => $users->random()->id,
                'type' => 'requesting_referral',
                'company_name' => $faker->randomElement($companies),
                'role_title' => $faker->randomElement($roles),
                'description' => $faker->randomElement($descriptions),
                'resume_url' => 'https://linkedin.com/in/' . strtolower($faker->firstName . $faker->lastName),
                'city' => $loc['city'],
                'state' => $loc['state'],
                'zipcode' => $loc['zipcode'],
                'status' => 'active',
            ]);
        }

        // Create 50 Offers
        for ($i = 0; $i < 50; $i++) {
            $loc = $faker->randomElement($locations);
            JobReferral::create([
                'user_id' => $users->random()->id,
                'type' => 'offering_referral',
                'company_name' => $faker->randomElement($companies),
                'role_title' => $faker->randomElement($roles),
                'description' => $faker->randomElement($offerDescriptions),
                'resume_url' => 'https://careers.' . strtolower($faker->word) . '.com',
                'city' => $loc['city'],
                'state' => $loc['state'],
                'zipcode' => $loc['zipcode'],
                'status' => 'active',
            ]);
        }
    }
}
