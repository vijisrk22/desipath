<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorAffiliation extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'facility_name',
        'facility_type',
        'affiliation_type',
        'address_street',
        'address_city',
        'address_state',
        'address_zip',
        'lat',
        'lng',
        'phone',
        'cms_star_rating',
        'awards_json',
        'cms_provider_id',
        'sort_order',
    ];

    protected $casts = [
        'awards_json' => 'array',
        'cms_star_rating' => 'decimal:1',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }
}
