<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItTrainingSchedule extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = [
        'days_of_week' => 'array',
    ];
}
