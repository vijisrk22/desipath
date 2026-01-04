<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsaZipcode extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'zip',
        'lat',
        'lng',
        'city',
        'state_id',
        'state_name',
        'timezone',
    ];
}
