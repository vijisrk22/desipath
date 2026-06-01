<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItJob extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'company_name',
        'description',
        'skills',
        'visa_requirements',
        'job_types',
        'h1b_transfer_available',
        'city',
        'state',
        'zipcode',
        'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'visa_requirements' => 'array',
        'job_types' => 'array',
        'h1b_transfer_available' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
