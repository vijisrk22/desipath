<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CarTransmission extends Model {
    protected $table = 'car_transmissions';
    protected $fillable = ['name'];
}
