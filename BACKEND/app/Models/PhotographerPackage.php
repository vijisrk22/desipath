<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotographerPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'photographer_id',
        'name',
        'price',
        'description'
    ];

    public function photographer()
    {
        return $this->belongsTo(Photographer::class);
    }
}
