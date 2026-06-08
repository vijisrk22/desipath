<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemEmailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::table('system_emails')->updateOrInsert(
            ['purpose' => 'report_listing'],
            [
                'email_address' => 'desipathsupport@sharklasers.com',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
