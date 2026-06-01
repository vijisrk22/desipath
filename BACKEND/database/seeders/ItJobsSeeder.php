<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItJobsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::inRandomOrder()->limit(100)->get();
        
        $titles = ['Senior Java Developer', 'Full Stack React Developer', 'Cloud Architect (AWS)', 'Data Engineer', 'DevOps Engineer', 'Python Backend Developer', 'Machine Learning Engineer', 'Scrum Master', 'Salesforce Developer', 'SAP Consultant', 'Cybersecurity Analyst', 'UI/UX Designer', 'Mobile App Developer (iOS/Android)', 'QA Automation Engineer', 'Site Reliability Engineer'];
        
        $companies = ['Tech Solutions Inc.', 'Global IT Consult', 'Innovate Systems', 'CloudScale Partners', 'DataCore Logic', 'NextGen Soft', 'Alpha Technologies', 'Beta Innovations', 'Omega Systems', 'Quantum IT'];
        
        $skillsList = ['Java', 'Spring Boot', 'React', 'Angular', 'Node.js', 'Python', 'Django', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'MongoDB', 'C#', '.NET', 'Kafka', 'Spark', 'Hadoop', 'Salesforce', 'SAP', 'Tableau', 'PowerBI', 'Jenkins', 'Git', 'Linux'];
        
        $visaOptions = ["H1B", "H4 EAD", "GC", "USC", "OPT/CPT", "TN"];
        $jobTypes = ["C2C", "W2-Contract", "W2-full time"];
        
        $locations = [
            ['city' => 'New York', 'state' => 'NY', 'zipcode' => '10001'],
            ['city' => 'San Francisco', 'state' => 'CA', 'zipcode' => '94105'],
            ['city' => 'Austin', 'state' => 'TX', 'zipcode' => '73301'],
            ['city' => 'Seattle', 'state' => 'WA', 'zipcode' => '98101'],
            ['city' => 'Chicago', 'state' => 'IL', 'zipcode' => '60601'],
            ['city' => 'Boston', 'state' => 'MA', 'zipcode' => '02108'],
            ['city' => 'Dallas', 'state' => 'TX', 'zipcode' => '75201'],
            ['city' => 'Atlanta', 'state' => 'GA', 'zipcode' => '30303'],
            ['city' => 'Denver', 'state' => 'CO', 'zipcode' => '80202'],
            ['city' => 'Charlotte', 'state' => 'NC', 'zipcode' => '28202'],
            ['city' => 'Phoenix', 'state' => 'AZ', 'zipcode' => '85001'],
            ['city' => 'Edison', 'state' => 'NJ', 'zipcode' => '08817'],
            ['city' => 'Irving', 'state' => 'TX', 'zipcode' => '75014'],
            ['city' => 'San Jose', 'state' => 'CA', 'zipcode' => '95113'],
        ];

        foreach ($users as $user) {
            $title = $titles[array_rand($titles)];
            $company = $companies[array_rand($companies)];
            $location = $locations[array_rand($locations)];
            
            // Random skills (2 to 5)
            $skillsCount = rand(2, 5);
            $randomSkills = array_rand(array_flip($skillsList), $skillsCount);
            if (!is_array($randomSkills)) $randomSkills = [$randomSkills];
            
            // Random visas (1 to 3)
            $visaCount = rand(1, 3);
            $randomVisas = array_rand(array_flip($visaOptions), $visaCount);
            if (!is_array($randomVisas)) $randomVisas = [$randomVisas];
            
            // Random job types (1 to 2)
            $typeCount = rand(1, 2);
            $randomTypes = array_rand(array_flip($jobTypes), $typeCount);
            if (!is_array($randomTypes)) $randomTypes = [$randomTypes];
            
            \App\Models\ItJob::create([
                'user_id' => $user->id,
                'title' => $title,
                'company_name' => $company,
                'description' => "We are looking for a $title to join our team at $company. You will be responsible for developing high-quality software solutions and working with a dynamic team. Strong experience in " . implode(", ", $randomSkills) . " is required. We offer a competitive salary and great benefits.",
                'skills' => $randomSkills,
                'visa_requirements' => $randomVisas,
                'job_types' => $randomTypes,
                'h1b_transfer_available' => (bool)rand(0, 1),
                'city' => $location['city'],
                'state' => $location['state'],
                'zipcode' => $location['zipcode'],
                'status' => 'active'
            ]);
        }
    }
}
