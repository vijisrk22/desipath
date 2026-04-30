<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MarketplaceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $kidsCategories = [
            [
                'name' => 'Indian Languages',
                'slug' => 'indian-languages',
                'icon' => '🗣',
                'color' => 'bg-orange-50 border-orange-200 text-orange-900 border',
                'accent' => 'bg-orange-100 text-orange-600',
                'subcategories' => ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi']
            ],
            [
                'name' => 'Classical Arts-Dance',
                'slug' => 'classical-arts-dance',
                'icon' => '💃',
                'color' => 'bg-pink-50 border-pink-200 text-pink-900 border',
                'accent' => 'bg-pink-100 text-pink-600',
                'subcategories' => ['Bharatanatyam', 'Kathak', 'Bollywood Dance']
            ],
            [
                'name' => 'Music',
                'slug' => 'music',
                'icon' => '🎵',
                'color' => 'bg-purple-50 border-purple-200 text-purple-900 border',
                'accent' => 'bg-purple-100 text-purple-600',
                'subcategories' => ['Carnatic Vocal', 'Hindustani Vocal', 'Veena', 'Keyboard', 'Mridangam', 'Tabla']
            ],
            [
                'name' => 'Academic Classes',
                'slug' => 'academic-classes',
                'icon' => '📚',
                'color' => 'bg-blue-50 border-blue-200 text-blue-900 border',
                'accent' => 'bg-blue-100 text-blue-600',
                'subcategories' => ['Online Chess', 'Online English', 'Maths Class', 'Computer Programming']
            ],
            [
                'name' => 'Spiritual & Cultural',
                'slug' => 'spiritual-cultural',
                'icon' => '🕉',
                'color' => 'bg-yellow-50 border-yellow-200 text-yellow-900 border',
                'accent' => 'bg-yellow-100 text-yellow-700',
                'subcategories' => ['Sloka Chanting', 'Vedic Math', 'Shlokas w/ Meaning']
            ],
            [
                'name' => 'Mythology Storytelling',
                'slug' => 'mythology-storytelling',
                'icon' => '📜',
                'color' => 'bg-red-50 border-red-200 text-red-900 border',
                'accent' => 'bg-red-100 text-red-600',
                'subcategories' => ['Ramayana', 'Mahabharata', 'Panchatantra']
            ],
        ];

        $itCategories = [
            "Programming & Software Development" => ["Python development", "Java (Core, Spring Boot)", "C++ / C# programming", "JavaScript (React, Angular, Vue, Node.js)", "Mobile App Development (Swift, Kotlin, Flutter, React Native)", "Backend Engineering", "Full Stack Development", "Low-code / No-code development", "Game Development", "Software Architecture & Design Patterns", "API Development & Microservices"],
            "Data Science & Artificial Intelligence" => ["Data Science & Analytics", "Machine Learning & Deep Learning", "Artificial Intelligence (Generative AI, LLMs)", "Big Data (Hadoop, Spark)", "Data Engineering", "Business Intelligence (Tableau, Power BI)", "Statistics for Data Science", "Natural Language Processing (NLP)"],
            "Cloud & DevOps" => ["AWS (Amazon Web Services)", "Microsoft Azure", "Google Cloud Platform (GCP)", "DevOps Engineering", "Kubernetes & Docker (Containerization)", "Infrastructure as Code (Terraform, Ansible)", "CI/CD Pipelines", "Cloud Security", "Site Reliability Engineering (SRE)"],
            "Cybersecurity" => ["Ethical Hacking & Penetration Testing", "Network Security", "Information Security Management", "Cyber Forensics", "Cloud Security", "Governance, Risk & Compliance (GRC)", "SOC Analyst Training"],
            "Networking & Infrastructure" => ["Networking Basics (CCNA, CCNP)", "System Administration (Linux, Windows Server)", "Virtualization (VMware, Hyper-V)", "Database Administration (SQL, Oracle, MongoDB)", "Enterprise Resource Planning (ERP)"],
            "Software Testing & Quality Assurance" => ["Manual Testing", "Automation Testing (Selenium, Playwright, Cypress)", "Performance Testing (JMeter)", "Security Testing", "API Testing (Postman)"],
            "Digital Marketing & Design" => ["UI/UX Design", "Graphic Design", "Search Engine Optimization (SEO)", "Search Engine Marketing (SEM / Google Ads)", "Social Media Marketing", "Content Marketing & Strategy", "Video Editing & Motion Graphics"],
            "Business, Management & Soft Skills" => ["Project Management (PMP, Prince2)", "Agile & Scrum (CSM)", "Product Management", "Business Analysis (CBAP)", "IT Service Management (ITIL)", "Leadership & Communication for IT Professionals"],
            "Emerging & Specialized Technologies" => ["Blockchain development", "Solidity & smart contracts", "IoT (Internet of Things)", "Embedded systems", "Raspberry Pi / Arduino", "Augmented reality (AR) / VR development", "Unity 3D game development", "Unreal Engine", "Robotics & RPA (UiPath, Automation Anywhere)", "SAP", "Salesforce development", "ServiceNow", "Snowflake", "Microsoft Power Platform", "Low-code / No-code platforms (Bubble, OutSystems)", "API integrations & Zapier", "Quantum computing basics", "Edge computing"]
        ];

        // Seed Kids Class Categories
        foreach ($kidsCategories as $cat) {
            $catId = DB::table('marketplace_categories')->insertGetId([
                'module' => 'kids_class',
                'name' => $cat['name'],
                'slug' => $cat['slug'],
                'icon' => $cat['icon'],
                'color' => $cat['color'],
                'accent' => $cat['accent'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($cat['subcategories'] as $sub) {
                DB::table('marketplace_subcategories')->insert([
                    'category_id' => $catId,
                    'name' => $sub,
                    'slug' => Str::slug($sub),
                    'icon' => '🔹',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Seed IT Training Categories
        $itStyling = [
            "Programming & Software Development" => ['color' => "bg-blue-50 border-blue-200 text-blue-900 border", 'accent' => "bg-blue-100 text-blue-600", 'icon' => "💻"],
            "Data Science & Artificial Intelligence" => ['color' => "bg-purple-50 border-purple-200 text-purple-900 border", 'accent' => "bg-purple-100 text-purple-600", 'icon' => "🧠"],
            "Cloud & DevOps" => ['color' => "bg-indigo-50 border-indigo-200 text-indigo-900 border", 'accent' => "bg-indigo-100 text-indigo-600", 'icon' => "☁️"],
            "Cybersecurity" => ['color' => "bg-red-50 border-red-200 text-red-900 border", 'accent' => "bg-red-100 text-red-600", 'icon' => "🛡️"],
            "Networking & Infrastructure" => ['color' => "bg-slate-50 border-slate-200 text-slate-900 border", 'accent' => "bg-slate-100 text-slate-600", 'icon' => "🌐"],
            "Software Testing & Quality Assurance" => ['color' => "bg-green-50 border-green-200 text-green-900 border", 'accent' => "bg-green-100 text-green-600", 'icon' => "🧪"],
            "Digital Marketing & Design" => ['color' => "bg-pink-50 border-pink-200 text-pink-900 border", 'accent' => "bg-pink-100 text-pink-600", 'icon' => "🎨"],
            "Business, Management & Soft Skills" => ['color' => "bg-orange-50 border-orange-200 text-orange-900 border", 'accent' => "bg-orange-100 text-orange-600", 'icon' => "💼"],
            "Emerging & Specialized Technologies" => ['color' => "bg-yellow-50 border-yellow-200 text-yellow-900 border", 'accent' => "bg-yellow-100 text-yellow-700", 'icon' => "🚀"]
        ];

        foreach ($itCategories as $catName => $subs) {
            $styling = $itStyling[$catName] ?? ['color' => null, 'accent' => null, 'icon' => '📘'];
            $catId = DB::table('marketplace_categories')->insertGetId([
                'module' => 'it_training',
                'name' => $catName,
                'slug' => Str::slug($catName),
                'icon' => $styling['icon'],
                'color' => $styling['color'],
                'accent' => $styling['accent'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($subs as $sub) {
                DB::table('marketplace_subcategories')->insert([
                    'category_id' => $catId,
                    'name' => $sub,
                    'slug' => Str::slug($sub),
                    'icon' => '🔹',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
