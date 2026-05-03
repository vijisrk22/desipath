<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Photographer;
use App\Models\User;

class PhotographerSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        if (!$user) return;

        $p = Photographer::create([
            'user_id' => $user->id,
            'title' => 'Henry George Studio',
            'bio' => 'Professional wedding and event photographer with 10 years of experience. Capturing moments that last a lifetime.',
            'service_type' => 'Both',
            'experience_years' => 10,
            'languages' => 'English, Hindi',
            'services' => [
                'Photography Services' => ['Wedding Photography', 'Event Photography', 'Portrait Photography'],
                'Videography Services' => ['Wedding Videography', 'Cinematic Film'],
                'Specialty Services' => ['Photo Editing / Retouching', 'Highlight Reel']
            ],
            'status' => 'active',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        ]);

        $p->packages()->create([
            'name' => 'Silver',
            'price' => 1200,
            'description' => '4 hours coverage, 200 edited photos'
        ]);

        $p->packages()->create([
            'name' => 'Gold',
            'price' => 2500,
            'description' => '8 hours coverage, 400 photos, highlight reel'
        ]);

        $p->locations()->create([
            'city' => 'Houston',
            'state' => 'TX',
            'zipcode' => '77002',
            'lat' => 29.7523,
            'lng' => -95.367
        ]);
    }
}
