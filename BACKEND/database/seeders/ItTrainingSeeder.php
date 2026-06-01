<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class ItTrainingSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Truncate existing data to start fresh and avoid duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('it_training_pricing')->truncate();
        DB::table('it_training_schedules')->truncate();
        DB::table('it_training_overview')->truncate();
        DB::table('it_training_modules')->truncate();
        DB::table('it_training_requirements')->truncate();
        DB::table('it_training_classes')->truncate();
        DB::table('it_instructors')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $userData = [
            ['name' => 'Vijay Sam', 'email' => 'Vijay123@sharklasers.com'],
            ['name' => 'Sam Rajesh', 'email' => 'Sam123@sharklasers.com'],
            ['name' => 'Ram Kumar', 'email' => 'Ram123@sharklasers.com'],
            ['name' => 'Binoy Varghese', 'email' => 'binoy123@sharklasers.com'],
            ['name' => 'Hilton Kumar', 'email' => 'Hilton123@sharklasers.com'],
            ['name' => 'Muthu Kumar', 'email' => 'Muthu123@sharklasers.com'],
            ['name' => 'Ferry Sam', 'email' => 'Ferry123@sharklasers.com'],
            ['name' => 'Henry George', 'email' => 'Henry123@sharklasers.com'],
            ['name' => 'George John', 'email' => 'George123@sharklasers.com'],
            ['name' => 'Uma Desai', 'email' => 'uma123@sharklasers.com'],
            ['name' => 'Paul Kumar', 'email' => 'paul123@sharklasers.com'],
            ['name' => 'Wisley Kutty', 'email' => 'wisley123@sharkalasers.com'],
            ['name' => 'Cathey Tommy', 'email' => 'tommy123@sharklasers.com'],
            ['name' => 'Daniel Shankar', 'email' => 'daniel123@sharklasers.com'],
        ];

        // MUST MATCH marketplace_categories and marketplace_subcategories EXACTLY
        $categories = [
            'Programming & Software Development' => [
                'Full Stack Development', 
                'Java (Core, Spring Boot)', 
                'JavaScript (React, Angular, Vue, Node.js)', 
                'Python development'
            ],
            'Data Science & Artificial Intelligence' => [
                'Artificial Intelligence (Generative AI, LLMs)', 
                'Data Science & Analytics', 
                'Machine Learning & Deep Learning', 
                'Business Intelligence (Tableau, Power BI)'
            ],
            'Cloud & DevOps' => [
                'AWS (Amazon Web Services)', 
                'DevOps Engineering', 
                'Microsoft Azure', 
                'CI/CD Pipelines'
            ],
            'Cybersecurity' => [
                'Ethical Hacking & Penetration Testing', 
                'Network Security', 
                'SOC Analyst Training', 
                'Cloud Security'
            ],
            'Software Testing & Quality Assurance' => [
                'Automation Testing (Selenium, Playwright, Cypress)', 
                'API Testing (Postman)', 
                'Manual Testing', 
                'Performance Testing (JMeter)'
            ]
        ];

        $bios = [
            "Senior IT Professional with expertise in large-scale system architecture and team mentorship.",
            "Passionate tech educator focused on bridging the gap between academia and industry requirements.",
            "Full-stack developer and consultant with a track record of delivering robust cloud-native applications.",
            "Expert trainer specializing in high-growth technologies and professional certification preparation.",
            "Technical lead with a deep understanding of modern software engineering practices and agile methodologies."
        ];

        foreach ($userData as $u) {
            // 1. Ensure User Exists
            $user = User::where('email', $u['email'])->first();
            if (!$user) {
                $user = User::create([
                    'id' => Str::uuid(),
                    'name' => $u['name'],
                    'email' => $u['email'],
                    'password' => Hash::make('Test123*'),
                ]);
            }

            // 2. Create Instructor Profile
            $instructorId = Str::uuid()->toString();
            $slug = Str::slug($u['name']);
            
            DB::table('it_instructors')->insert([
                'id' => $instructorId,
                'name' => $u['name'],
                'slug' => $slug,
                'account_type' => 'individual',
                'email' => $u['email'],
                'bio' => $bios[array_rand($bios)],
                'years_experience' => rand(5, 18),
                'phone' => '+1 408-' . rand(100, 999) . '-' . rand(1000, 9999),
                'city' => 'San Jose',
                'state' => 'California',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Create 3 Classes in different subcategories
            $allCats = array_keys($categories);
            shuffle($allCats);
            $selectedCats = array_slice($allCats, 0, 3);

            foreach ($selectedCats as $cat) {
                $sub = $categories[$cat][array_rand($categories[$cat])];
                $classId = Str::uuid()->toString();

                DB::table('it_training_classes')->insert([
                    'id' => $classId,
                    'instructor_id' => $instructorId,
                    'title' => "Master " . $sub . " Bootcamp",
                    'category' => $cat,
                    'subcategory' => $sub,
                    'level' => json_encode(['Intermediate', 'Advanced']),
                    'format' => json_encode(['Online', 'Live Interactive']),
                    'short_description' => "Level up your skills with this industry-leading training on " . $sub . ".",
                    'training_covers' => "Comprehensive A-Z guide to " . $sub . " with projects.",
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Overview
                DB::table('it_training_overview')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'detailed_description' => "This course covers everything from basics to advanced concepts in " . $sub . ". You will work on real-world projects and build a portfolio.",
                    'who_is_it_for' => json_encode(['Software Engineers', 'IT Graduates', 'Tech Enthusiasts']),
                    'what_will_learn' => json_encode(['Industry Best Practices', 'Core Architecture', 'Deployment Strategies']),
                    'highlights' => json_encode(['1-on-1 Mentorship', 'Job Referral Program', 'Lifetime Access']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Schedule
                DB::table('it_training_schedules')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'duration_label' => '12 Weeks',
                    'total_sessions' => 24,
                    'session_length_minutes' => 120,
                    'days_of_week' => json_encode(['Saturday', 'Sunday']),
                    'time_start' => '10:00:00',
                    'time_end' => '12:00:00',
                    'batch_start_date' => now()->addDays(rand(10, 45))->format('Y-m-d'),
                    'online_platform' => 'Microsoft Teams',
                    'max_students' => 15,
                    'trial_available' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Pricing
                DB::table('it_training_pricing')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'fee_amount' => rand(499, 1499),
                    'fee_type' => 'full_course',
                    'discount_label' => 'Early Bird 20% Off',
                    'certificate_provided' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Requirements
                DB::table('it_training_requirements')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'prerequisites' => json_encode(['Basic IT Knowledge', 'High-speed Internet']),
                    'materials_needed' => json_encode(['Laptop with 16GB RAM', 'Required Software installed']),
                    'tech_requirements' => json_encode(['Stable Internet connection', 'Webcam']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Modules
                for ($m = 1; $m <= 4; $m++) {
                    DB::table('it_training_modules')->insert([
                        'id' => Str::uuid()->toString(),
                        'class_id' => $classId,
                        'sort_order' => $m,
                        'title' => "Module $m: Deep Dive into " . $sub,
                        'description' => "Core concepts and practical implementations of " . $sub,
                        'estimated_duration' => "3 Weeks",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
