<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItTrainingRequirement extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $casts = [
        'prerequisites' => 'array',
        'materials_needed' => 'array',
        'tech_requirements' => 'array',
    ];
}
