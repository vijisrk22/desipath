<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Google\Client as GoogleClient;
use Mockery;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_login_returns_401_for_invalid_token()
    {
        $response = $this->postJson('/api/auth/google', [
            'token' => 'invalid-token-format',
        ]);

        $response->assertStatus(401);
        $response->assertJsonStructure(['error']);
    }
}
