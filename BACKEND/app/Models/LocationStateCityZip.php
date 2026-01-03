<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationStateCityZip extends Model
{
    // If your table name doesn't follow Laravel's naming convention (like plural), set it explicitly
    protected $table = 'locationstatecityzip';

    // Primary key
    protected $primaryKey = 'id';

    // If you don't use timestamps in the table, you can disable them
    public $timestamps = true;

    // Mass assignable attributes
    protected $fillable = [
        'zip',
        'city',
        'state_id',
        'state_name',
        'stateID_state_name',
        'timezone',
        'lat',
        'lng',
        'country',
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
    ];
}
