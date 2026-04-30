<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocalAd extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_account_id',
        'title',
        'description',
        'tags',
        'category',
        'poster_urls',
        'location_city',
        'location_state',
        'country',
        'website_url',
        'status',
        'rejection_reason',
        'approved_at',
        'expires_at',
        'renewed_at',
        'view_count',
        'popup_open_count',
        'message_click_count',
    ];

    protected $casts = [
        'tags' => 'array',
        'poster_urls' => 'array',
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
        'renewed_at' => 'datetime',
    ];

    public function businessAccount()
    {
        return $this->belongsTo(BusinessAccount::class);
    }
}
