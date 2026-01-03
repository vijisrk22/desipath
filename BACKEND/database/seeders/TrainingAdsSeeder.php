<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TrainingAdsSeeder extends Seeder
{
    public function run()
    {
        DB::table('TrainingAds')->insert([
            [
                'user_id' => 1,
                'course_title' => 'Full Stack Web Development',
                'course_fee' => 500.00,
                'agenda' => 'Introduction to web development, HTML, CSS, JavaScript, React, Node.js',
                'image_1' => 'fullstack_image1.jpg',
                'image_2' => 'fullstack_image2.jpg',
                'image_3' => 'fullstack_image3.jpg',
                'contact_form' => 'contact@webdev.com',
                'timestamp' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'user_id' => 2,
                'course_title' => 'Data Science and Machine Learning',
                'course_fee' => 750.00,
                'agenda' => 'Python, Data Analysis, Machine Learning Algorithms, Data Visualization',
                'image_1' => 'datascience_image1.jpg',
                'image_2' => 'datascience_image2.jpg',
                'image_3' => 'datascience_image3.jpg',
                'contact_form' => 'contact@datascience.com',
                'timestamp' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Add more entries as needed
        ]);
    }
}
