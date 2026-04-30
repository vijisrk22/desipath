<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItTrainingClass extends Model
{
    use HasUuids;
    protected $guarded = [];

    protected $casts = [
        'level' => 'array',
        'format' => 'array',
        'tags' => 'array',
    ];

    public function instructor()
    {
        return $this->belongsTo(ItInstructor::class, 'instructor_id');
    }

    public function overview()
    {
        return $this->hasOne(ItTrainingOverview::class, 'class_id');
    }

    public function schedule()
    {
        return $this->hasOne(ItTrainingSchedule::class, 'class_id');
    }

    public function pricing()
    {
        return $this->hasOne(ItTrainingPricing::class, 'class_id');
    }

    public function requirements()
    {
        return $this->hasOne(ItTrainingRequirement::class, 'class_id');
    }

    public function modules()
    {
        return $this->hasMany(ItTrainingModule::class, 'class_id');
    }
}
