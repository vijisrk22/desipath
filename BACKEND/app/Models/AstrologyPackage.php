<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AstrologyPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'astrology_ad_id',
        'name',
        'duration',
        'price',
        'currency',
        'description',
        'is_popular',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function astrologyAd()
    {
        return $this->belongsTo(AstrologyAd::class, 'astrology_ad_id');
    }
}
