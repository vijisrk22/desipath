<?php
return [
    'paths' => ['api/*', 'auth/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Allow only the origins you need
    // 'allowed_origins' => [
    //     'http://localhost:3000',
    //     'http://localhost:8000',
    //     'http://localhost:5173',
    //     'https://happy-pebble-0f4bc7310.6.azurestaticapps.net',
    //     'https://desipathdev.azurewebsites.net'
    // ],
    // 'allowed_origins' => ['*'], // allow all domains
    // 'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8000',
        'http://localhost:5173',
        'http://localhost:4173',
        'https://jolly-island-01b6ff91e.1.azurestaticapps.net',
        'https://happy-pebble-0f4bc7310.6.azurestaticapps.net',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
