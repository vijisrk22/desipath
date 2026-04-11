<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CarCondition extends Model {
    protected $table = 'car_conditions';
    protected $fillable = ['name'];
}
