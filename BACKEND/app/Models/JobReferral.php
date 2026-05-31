<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobReferral extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'company_name',
        'role_title',
        'description',
        'resume_url',
        'city',
        'state',
        'zipcode',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
