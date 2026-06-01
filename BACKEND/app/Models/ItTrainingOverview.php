<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItTrainingOverview extends Model
{
    use HasUuids;
    protected $table = 'it_training_overview';
    protected $guarded = [];
    protected $casts = [
        'who_is_it_for' => 'array',
        'what_will_learn' => 'array',
        'highlights' => 'array',
    ];
}
