<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarMakeModel extends Model
{
    use HasFactory;

    protected $table = 'car_makes_models';
    
    protected $fillable = ['make', 'model'];
}
