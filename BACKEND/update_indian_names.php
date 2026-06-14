<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$male_first = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Rohan', 'Krish', 'Ishaan', 'Shaurya', 'Atharv', 'Kabir', 'Ayaan', 'Dhruv', 'Karan', 'Rahul', 'Vikram', 'Rajesh', 'Suresh', 'Amit', 'Anil', 'Sunil', 'Vijay', 'Vivek', 'Sanjay', 'Rohit', 'Gaurav', 'Manish', 'Nitin', 'Tarun'];
$female_first = ['Aadhya', 'Diya', 'Ananya', 'Saanvi', 'Kiara', 'Aaradhya', 'Priya', 'Neha', 'Sneha', 'Riya', 'Pooja', 'Anjali', 'Kavya', 'Shruti', 'Nidhi', 'Aditi', 'Divya', 'Swati', 'Preeti', 'Jyoti', 'Shikha', 'Asha', 'Deepa', 'Meena', 'Geeta', 'Sita', 'Anita', 'Sunita', 'Rekha', 'Kiran'];
$last_names = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Jain', 'Verma', 'Reddy', 'Rao', 'Shah', 'Nair', 'Das', 'Bose', 'Mukherjee', 'Banerjee', 'Chopra', 'Kapoor', 'Malhotra', 'Bhatia', 'Thakur', 'Garg', 'Agarwal', 'Srivastava', 'Yadav', 'Tiwari', 'Mishra', 'Pandey', 'Dubey', 'Mehta', 'Desai'];

$profiles = DB::table('sm_profiles')->get();

foreach ($profiles as $profile) {
    // If gender is missing or not Male/Female, default to something. But DB likely has 'Male' or 'Female'.
    $isMale = (strtolower($profile->gender) === 'male');
    $first = $isMale ? $male_first[array_rand($male_first)] : $female_first[array_rand($female_first)];
    $last = $last_names[array_rand($last_names)];
    
    $display_name = $first . ' ' . $last;
    
    DB::table('sm_profiles')->where('id', $profile->id)->update(['display_name' => $display_name]);
    echo "Updated profile {$profile->id} to: {$display_name}\n";
}

echo "All profiles updated successfully.\n";
