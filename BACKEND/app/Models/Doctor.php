<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $primaryKey = 'doctor_id';

    protected $fillable = [
        'user_id',
        'slug',
        'slug_customised',
        'slug_customised_at',
        'npi_number',
        'npi_verified',
        'npi_verified_at',
        'credential',
        'first_name',
        'last_name',
        'gender',
        'profile_photo_url',
        'nri_specialist_statement',
        'headline',
        'bio',
        'primary_specialty',
        'subspecialties_json',
        'board_certifications_json',
        'conditions_treated_json',
        'procedures_json',
        'indian_health_specialisations_json',
        'practice_name',
        'practice_type',
        'primary_address_street',
        'primary_address_city',
        'primary_address_state',
        'primary_address_zip',
        'primary_address_lat',
        'primary_address_lng',
        'fax',
        'phone',
        'email',
        'website_url',
        'appointment_booking_url',
        'office_hours_json',
        'additional_locations_json',
        'telehealth_available',
        'telehealth_states_json',
        'accepting_new_patients',
        'same_day_available',
        'insurance_plans_json',
        'self_pay_accepted',
        'self_pay_fee_min',
        'self_pay_fee_max',
        'medicaid_accepted',
        'languages_json',
        'office_languages_json',
        'cultural_background',
        'india_medical_training',
        'india_medical_college',
        'visiting_parents_care',
        'medical_proxy_assistance',
        'is_desi_doctor',
        'nri_specialist',
        'metro_tags_json',
        'medical_school',
        'medical_school_year',
        'residency_program',
        'residency_hospital',
        'residency_year',
        'fellowships_json',
        'linkedin_url',
        'youtube_videos_json',
        'blog_url',
        'subscription_plan',
        'verified_badge_level',
        'avg_rating',
        'review_count',
        'profile_completeness',
        'profile_status',
    ];

    protected $casts = [
        'slug_customised' => 'boolean',
        'slug_customised_at' => 'datetime',
        'npi_verified' => 'boolean',
        'npi_verified_at' => 'datetime',
        'subspecialties_json' => 'array',
        'board_certifications_json' => 'array',
        'conditions_treated_json' => 'array',
        'procedures_json' => 'array',
        'indian_health_specialisations_json' => 'array',
        'office_hours_json' => 'array',
        'additional_locations_json' => 'array',
        'telehealth_available' => 'boolean',
        'telehealth_states_json' => 'array',
        'accepting_new_patients' => 'boolean',
        'same_day_available' => 'boolean',
        'insurance_plans_json' => 'array',
        'self_pay_accepted' => 'boolean',
        'medicaid_accepted' => 'boolean',
        'languages_json' => 'array',
        'office_languages_json' => 'array',
        'visiting_parents_care' => 'boolean',
        'medical_proxy_assistance' => 'boolean',
        'is_desi_doctor' => 'boolean',
        'nri_specialist' => 'boolean',
        'metro_tags_json' => 'array',
        'fellowships_json' => 'array',
        'youtube_videos_json' => 'array',
        'avg_rating' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function affiliations()
    {
        return $this->hasMany(DoctorAffiliation::class, 'doctor_id', 'doctor_id');
    }

    public function awards()
    {
        return $this->hasMany(DoctorAward::class, 'doctor_id', 'doctor_id');
    }
}
