<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FinancialAdvisor extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'financial_advisors';
    protected $primaryKey = 'advisor_id';

    protected $fillable = [
        'user_id',
        'consultant_name',
        'advisor_profile_image',
        'cover_image',
        'qualifications',
        'accreditations',
        'slug',
        'firm_name',
        'years_experience',
        'nri_specialist_statement',
        'accepting_new_clients',
        'profile_status',
        'fbar_fatca_advisory',
        'pfic_advisory',
        'dtaa_optimization',
        'return_to_india_planning',
        'india_investments',
        'finra_crd_number',
        'sec_ria_registration',
        'sebi_registration',
        'disciplinary_history',
        'services',
        'credentials',
        'fee_structure_type',
        'minimum_investment',
        'aum_fee_percentage',
        'hourly_rate',
        'primary_city',
        'state',
        'states_licensed',
        'zip_code',
        'languages',
        'virtual_consultation',
        'india_time_zone_consultation',
        'contact_email',
        'contact_phone',
        'website',
        'free_consultation',
    ];

    protected $casts = [
        'accepting_new_clients' => 'boolean',
        'fbar_fatca_advisory' => 'boolean',
        'pfic_advisory' => 'boolean',
        'dtaa_optimization' => 'boolean',
        'return_to_india_planning' => 'boolean',
        'india_investments' => 'boolean',
        'disciplinary_history' => 'boolean',
        'virtual_consultation' => 'boolean',
        'india_time_zone_consultation' => 'boolean',
        'services' => 'array',
        'credentials' => 'array',
        'languages' => 'array',
        'states_licensed' => 'array',
        'minimum_investment' => 'decimal:2',
        'aum_fee_percentage' => 'decimal:2',
        'hourly_rate' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function generateSlug($name)
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (self::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
