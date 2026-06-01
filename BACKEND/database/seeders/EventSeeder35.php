<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class EventSeeder35 extends Seeder
{
    public function run()
    {
        $userIds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        $users = User::whereIn('id', $userIds)->get();
        
        if ($users->isEmpty()) {
            echo "No users found. Please check IDs.\n";
            return;
        }

        $zipcodes = DB::table('usa_zipcodes')->inRandomOrder()->limit(35)->get();
        if ($zipcodes->isEmpty()) {
            echo "No zipcodes found.\n";
            return;
        }
        
        $categories = ['Sports', 'Parties', 'Arts & Crafts', 'Workshops', 'Comedy Shows', 'Music Shows', 'Kids', 'Meetups', 'Performances', 'Conferences', 'Exhibitions', 'Screening', 'Talks'];
        $types = ['Music', 'Diwali', 'Dance', 'Bollywood', 'Cultural', 'Standup Comedy'];
        $languages = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
        
        $eventNames = [
            'Ganesh Chaturthi Celebration', 'Diwali Lights Night', 'Holi Rangotsav', 'Pongal Festival 2026',
            'Bollywood Dance Workshop', 'Carnatic Music Night', 'Classical Dance Performance', 'Indian Food Fest',
            'Startup Networking Meet', 'Tech Talk: Future of AI', 'Cricket Match Screening', 'Yoga and Wellness Retreat',
            'Indian Standup Comedy Night', 'Magic Show for Kids', 'Art Exhibition: Colors of India', 'Sitar Recital',
            'Mehndi and Sangeet Workshop', 'Garba Night 2026', 'Cultural Parade', 'Desi Movie Premiere',
            'Entrepreneurship Workshop', 'Photography Walk', 'Cooking Class: Authentic Biryani', 'Chess Tournament',
            'Poetry Slam', 'Live Band: Desi Rock', 'Spiritual Discourse', 'Meditation Session',
            'Community Volunteering Day', 'Charity Gala Dinner', 'Folk Music Festival', 'Theatre Play: Ramayana',
            'Youth Summit 2026', 'Health and Wellness Fair', 'Night Market: Indian Bazaar'
        ];

        $files = Storage::disk('public')->files('events');
        $images = array_map(function($file) {
            return 'storage/' . $file;
        }, $files);

        if (empty($images)) {
            $images = ['/img/events/eventSmpl1.png'];
        }

        for ($i = 0; $i < 35; $i++) {
            $user = $users->random();
            $zip = $zipcodes[$i % count($zipcodes)];
            
            Event::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_type' => 'Owner',
                'event_name' => $eventNames[$i % count($eventNames)],
                'address' => rand(100, 9999) . ' Main St, ' . $zip->city,
                'state_city_zipcode' => $zip->city . ', ' . $zip->state_id . ', ' . $zip->zip,
                'location_city' => $zip->city,
                'location_state' => $zip->state_id,
                'location_zipcode' => $zip->zip,
                'latitude' => $zip->lat,
                'longitude' => $zip->lng,
                'from_date' => Carbon::now()->addDays(rand(1, 60))->addHours(rand(0, 23)),
                'language' => $languages[rand(0, count($languages) - 1)],
                'event_type' => $types[rand(0, count($types) - 1)],
                'description' => "Join us for a wonderful " . strtolower($eventNames[$i % count($eventNames)]) . " hosted by " . $user->name . ". It will be an evening filled with joy, culture, and great memories. desipath events are always exciting!",
                'ticket_price' => rand(0, 1) ? 'Free' : (string)rand(10, 150),
                'cover_images' => [$images[rand(0, count($images) - 1)]],
                'poster_images' => [$images[rand(0, count($images) - 1)]],
                'duration_hours' => (string)rand(2, 5),
                'min_age_limit' => rand(0, 1) ? 'All Ages' : (string)rand(12, 18),
                'organizer_name' => $user->name,
                'organizer_contact' => '555-' . rand(100, 999) . '-' . rand(1000, 9999),
                'timezone' => 'PST',
                'country' => 'USA',
                'rules_regulations' => "No outside food allowed. Please bring your digital ticket. No alcohol permitted.",
                'tags' => ['Culture', 'India', 'Community', 'Desi'],
                'event_category' => [$categories[rand(0, count($categories) - 1)]],
                'is_sold' => false
            ]);
        }
        echo "Created 35 events successfully.\n";
    }
}
