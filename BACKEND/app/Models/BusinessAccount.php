<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_user_id',
        'business_name',
        'category',
        'owner_name',
        'address_line1',
        'email',
        'contact_person_name',
        'contact_person_email',
        'contact_person_phone',
        'phone',
        'city',
        'zipcode',
        'state_province',
        'country',
        'website_url',
        'bio',
        'logo_url',
        'account_status',
        'activated_at',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
    ];

    public function ads()
    {
        return $this->hasMany(LocalAd::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }
}
