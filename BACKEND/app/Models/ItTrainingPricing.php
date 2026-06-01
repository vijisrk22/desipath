<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ItTrainingPricing extends Model
{
    use HasUuids;
    protected $table = 'it_training_pricing';
    protected $guarded = [];
}
