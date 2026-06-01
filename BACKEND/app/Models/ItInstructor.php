<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItInstructor extends Model
{
    use HasUuids;
    protected $guarded = [];

    public function classes()
    {
        return $this->hasMany(ItTrainingClass::class, 'instructor_id');
    }
}
