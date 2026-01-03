<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAd extends Model
{
    use HasFactory;

    protected $table = 'TrainingAds';

    protected $fillable = [
        'user_id', 'course_title', 'course_fee', 'agenda',
        'image_1', 'image_2', 'image_3', 'contact_form',
        'timestamp'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
