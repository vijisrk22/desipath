<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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

        // Get 50 random users from the existing database to act as instructors
        $users = User::inRandomOrder()->limit(50)->get();
        if ($users->isEmpty()) {
            $this->command->error('No users found in database.');
            return;
        }

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
            "Senior IT Professional with 10+ years of expertise in large-scale system architecture and team mentorship.",
            "Passionate tech educator focused on bridging the gap between academia and industry requirements.",
            "Full-stack developer and consultant with a track record of delivering robust cloud-native applications.",
            "Expert trainer specializing in high-growth technologies and professional certification preparation.",
            "Technical lead with a deep understanding of modern software engineering practices and agile methodologies."
        ];

        $totalCoursesTarget = 100;
        $coursesCreated = 0;

        foreach ($users as $index => $user) {
            if ($coursesCreated >= $totalCoursesTarget) {
                break;
            }

            // Create Instructor Profile
            $instructorId = Str::uuid()->toString();
            $slug = Str::slug($user->name);
            
            // Handle slug uniqueness
            while (DB::table('it_instructors')->where('slug', $slug)->exists()) {
                $slug = Str::slug($user->name) . '-' . Str::random(4);
            }

            DB::table('it_instructors')->insert([
                'id' => $instructorId,
                'name' => $user->name,
                'slug' => $slug,
                'account_type' => 'individual',
                'email' => $user->email,
                'bio' => $bios[array_rand($bios)],
                'years_experience' => rand(5, 18),
                'phone' => '+1 408-' . rand(100, 999) . '-' . rand(1000, 9999),
                'city' => 'San Jose',
                'state' => 'California',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign 2 courses per instructor
            for ($i = 0; $i < 2; $i++) {
                if ($coursesCreated >= $totalCoursesTarget) {
                    break;
                }

                $cat = array_rand($categories);
                $sub = $categories[$cat][array_rand($categories[$cat])];
                
                $classId = Str::uuid()->toString();

                DB::table('it_training_classes')->insert([
                    'id' => $classId,
                    'instructor_id' => $instructorId,
                    'title' => $sub . " Certification Training",
                    'category' => $cat,
                    'subcategory' => $sub,
                    'level' => json_encode(['Intermediate', 'Advanced']),
                    'format' => json_encode(['Online', 'Live Interactive']),
                    'short_description' => "Get certified in " . $sub . " with industry-expert led training. Master the skills demanded by top employers.",
                    'training_covers' => "Comprehensive A-Z guide with real-world industry projects.",
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Overview
                DB::table('it_training_overview')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'detailed_description' => "This Edureka-style training covers everything from basics to advanced concepts. You will work on real-world projects, build a strong portfolio, and prepare for official certification exams.",
                    'who_is_it_for' => json_encode(['Software Engineers', 'IT Professionals', 'Tech Enthusiasts']),
                    'what_will_learn' => json_encode(['Industry Best Practices', 'Core Architecture', 'Certification Exam Prep']),
                    'highlights' => json_encode(['1-on-1 Mentorship', 'Job Referral Program', 'Lifetime Access', 'Industry Recognized Certificate']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Schedule
                DB::table('it_training_schedules')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'duration_label' => rand(4, 12) . ' Weeks',
                    'total_sessions' => rand(12, 36),
                    'session_length_minutes' => 120,
                    'days_of_week' => json_encode(['Saturday', 'Sunday']),
                    'time_start' => '10:00:00',
                    'time_end' => '12:00:00',
                    'batch_start_date' => now()->addDays(rand(5, 30))->format('Y-m-d'),
                    'online_platform' => 'Zoom',
                    'max_students' => rand(10, 30),
                    'trial_available' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Pricing
                DB::table('it_training_pricing')->insert([
                    'id' => Str::uuid()->toString(),
                    'class_id' => $classId,
                    'fee_amount' => rand(299, 1999),
                    'fee_type' => 'full_course',
                    'discount_label' => 'Limited Time 20% Off',
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
                    'tech_requirements' => json_encode(['Stable Internet connection', 'Webcam', 'Microphone']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Modules
                for ($m = 1; $m <= 5; $m++) {
                    DB::table('it_training_modules')->insert([
                        'id' => Str::uuid()->toString(),
                        'class_id' => $classId,
                        'sort_order' => $m,
                        'title' => "Module $m: Deep Dive into core concepts",
                        'description' => "Detailed curriculum covering essential industry topics with hands-on labs and practical implementations.",
                        'estimated_duration' => "2 Weeks",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                $coursesCreated++;
            }
        }
    }
}
