<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotographerLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_id',
        'address',
        'city',
        'state',
        'zipcode',
        'lat',
        'lng'
    ];

    public function photographer()
    {
        return $this->belongsTo(Photographer::class);
    }
}
