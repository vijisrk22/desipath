<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Currency;

class SyncExchangeRates extends Command
{
    protected $signature = 'currency:sync';
    protected $description = 'Fetch latest exchange rates from external API and update the database';

    public function handle()
    {
        $this->info('Starting currency sync...');

        // Open ExchangeRate API is free and supports AED
        $response = Http::withoutVerifying()->get('https://open.er-api.com/v6/latest/USD');

        if ($response->successful()) {
            $rates = $response->json()['rates'];
            
            // 1. Update USD (Base)
            Currency::updateOrCreate(
                ['code' => 'USD'],
                ['name' => 'US Dollar', 'symbol' => '$', 'rate_to_usd' => 1.0]
            );

            // 2. Update INR
            Currency::updateOrCreate(
                ['code' => 'INR'],
                ['name' => 'Indian Rupee', 'symbol' => '₹', 'rate_to_usd' => $rates['INR']]
            );

            // 3. Update AED
            Currency::updateOrCreate(
                ['code' => 'AED'],
                ['name' => 'UAE Dirham', 'symbol' => 'د.إ', 'rate_to_usd' => $rates['AED']]
            );

            $this->info('Exchange rates updated successfully:');
            $this->line("INR: {$rates['INR']}");
            $this->line("AED: {$rates['AED']}");
        } else {
            $this->error('Failed to fetch exchange rates from API.');
        }

        return 0;
    }
}
