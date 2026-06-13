<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecureMatchPhoto extends Model
{
    protected $table = 'sm_photos';

    protected $fillable = [
        'profile_id', 'photo_url', 'is_primary', 'order_index'
    ];

    public function profile()
    {
        return $this->belongsTo(SecureMatchProfile::class, 'profile_id');
    }
}
