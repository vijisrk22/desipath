<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attorney extends Model
{
    use HasFactory;

    protected $primaryKey = 'attorney_id';

    protected $fillable = [
        'user_id',
        'slug',
        'first_name',
        'last_name',
        'gender',
        'profile_photo_url',
        'short_bio',
        'full_biography',
        'career_summary',
        'nri_client_statement',
        'personal_note',
        'nri_specialisation',
        'india_law_knowledge',
        'email',
        'phone',
        'office_address_street',
        'office_address_city',
        'office_address_state',
        'office_address_zip',
        'office_address_lat',
        'office_address_lng',
        'multiple_offices_json',
        'consultation_types_json',
        'website_url',
        'blog_url',
        'blog_platform',
        'blog_description',
        'featured_articles_json',
        'linkedin_url',
        'twitter_url',
        'facebook_url',
        'instagram_url',
        'youtube_videos_json',
        'law_school',
        'law_degree',
        'graduation_year',
        'law_school_honours',
        'additional_degrees_json',
        'undergraduate_institution',
        'undergraduate_degree',
        'undergraduate_year',
        'federal_courts_json',
        'appeals_circuits_json',
        'us_supreme_court',
        'eoir_admitted',
        'us_tax_court',
        'india_bci',
        'india_bci_details',
        'other_jurisdictions',
        'accepts_legal_plans',
        'legal_plans_json',
        'legal_plans_note',
        'consultation_fee_amount',
        'consultation_duration',
        'billing_model_json',
        'flat_fees_json',
        'retainer_details',
        'payment_methods_json',
        'fee_note',
        'languages_json',
        'associations_json',
        'awards_json',
        'publications_json',
        'practice_areas_json',
        'services_offered_json',
        'locations_covered_json',
        'states_licensed_json',
        'profile_completeness',
        'profile_status',
        'avg_rating',
        'review_count',
    ];

    protected $casts = [
        'nri_specialisation' => 'boolean',
        'india_law_knowledge' => 'boolean',
        'us_supreme_court' => 'boolean',
        'eoir_admitted' => 'boolean',
        'us_tax_court' => 'boolean',
        'india_bci' => 'boolean',
        'accepts_legal_plans' => 'boolean',
        
        'multiple_offices_json' => 'array',
        'consultation_types_json' => 'array',
        'featured_articles_json' => 'array',
        'youtube_videos_json' => 'array',
        'additional_degrees_json' => 'array',
        
        'federal_courts_json' => 'array',
        'appeals_circuits_json' => 'array',
        'legal_plans_json' => 'array',
        'billing_model_json' => 'array',
        'flat_fees_json' => 'array',
        'payment_methods_json' => 'array',
        
        'languages_json' => 'array',
        'associations_json' => 'array',
        'awards_json' => 'array',
        'publications_json' => 'array',
        
        'practice_areas_json' => 'array',
        'services_offered_json' => 'array',
        'locations_covered_json' => 'array',
        'states_licensed_json' => 'array',
        
        'consultation_fee_amount' => 'decimal:2',
        'avg_rating' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
