<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // protected $fillable = [
    //         'name', 'email', 'password', 'role',
    //     ];

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'phone_number',
        'country_code',
        'status',
        'profile_photo',
        'otp',
        'otp_expires_at',
        'location',
        'last_login_at',
        'business_name',
        'business_phone',
        'business_location',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
        ];
    }
    
    /**
     * Generate a unique username from first and last name.
     * Format: firstnamelastname + 3-digit number (e.g., viveksmith123)
     */
    public static function generateUniqueUsername(string $firstName, string $lastName): string
    {
        // Normalize: lowercase + strip non-alpha characters
        $base = strtolower(preg_replace('/[^a-zA-Z]/', '', $firstName . $lastName));

        if (empty($base)) {
            $base = 'user';
        }

        // Try 100–999 suffixes first for a nice 3-digit number
        $suffix = rand(100, 999);
        $attempts = 0;
        $maxAttempts = 50;

        while ($attempts < $maxAttempts) {
            $candidate = $base . $suffix;
            if (!self::where('username', $candidate)->exists()) {
                return $candidate;
            }
            $suffix = rand(100, 999);
            $attempts++;
        }

        // Ultimate fallback: append timestamp fragment
        return $base . substr(time(), -3);
    }

    public function isBusinessUser()
    {
        return $this->role === 'business';
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isRegularUser()
    {
        return $this->role === 'user';
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function secureMatchProfile()
    {
        return $this->hasOne(SecureMatchProfile::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }
}
