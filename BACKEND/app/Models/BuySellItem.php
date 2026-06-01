<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuySellItem extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'category',
        'price',
        'condition',
        'description',
        'zipcode',
        'city',
        'pictures',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'pictures' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
