<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalJob extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'category',
        'description',
        'city',
        'state',
        'zipcode',
        'pay_rate',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
