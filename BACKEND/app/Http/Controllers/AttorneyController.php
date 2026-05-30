<?php

namespace App\Http\Controllers;

use App\Models\Attorney;
use App\Models\UsaZipcode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AttorneyController extends Controller
{
    /**
     * Display a listing of attorneys for the public directory.
     */
    public function index(Request $request)
    {
        $term = $request->input('q');
        $practiceArea = $request->input('practice_area');
        $zip = $request->input('zip');
        $radius = $request->input('radius', 100);
        
        $language = $request->input('language');
        $federalCourt = $request->input('federal_court');
        $eoirAdmitted = $request->input('eoir_admitted');
        $usTaxCourt = $request->input('us_tax_court');
        $indiaBci = $request->input('india_bci');
        $freeConsultation = $request->input('free_consultation');
        $billingModel = $request->input('billing_model');
        $hasVideo = $request->input('has_video');
        $hasPublications = $request->input('has_publications');
        $acceptsLegalPlans = $request->input('accepts_legal_plans');
        $legalPlan = $request->input('legal_plan');
        $sabaMember = $request->input('saba_member');

        $query = Attorney::where('profile_status', 'active');

        // Text Search
        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('first_name', 'like', "%{$term}%")
                  ->orWhere('last_name', 'like', "%{$term}%")
                  ->orWhere('short_bio', 'like', "%{$term}%")
                  ->orWhere('full_biography', 'like', "%{$term}%")
                  ->orWhere('law_school', 'like', "%{$term}%")
                  ->orWhere('other_jurisdictions', 'like', "%{$term}%");
            });
        }

        // Filter by Practice Area
        if ($practiceArea && $practiceArea !== 'All') {
            $query->where(function($q) use ($practiceArea) {
                $q->whereJsonContains('practice_areas_json', $practiceArea);
            });
        }

        // Filter by Language
        if ($language) {
            $query->where(function($q) use ($language) {
                // Check if language matches in array of {language: "...", proficiency: "..."}
                $q->where(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(languages_json, '$[*].language'))"), 'like', "%{$language}%");
            });
        }

        // Jurisdictions & Bar Toggles
        if ($federalCourt) {
            $query->where(function($q) {
                $q->where('us_supreme_court', true)
                  ->orWhereNotNull('federal_courts_json')
                  ->orWhere(DB::raw("JSON_LENGTH(federal_courts_json)"), '>', 0);
            });
        }
        if ($eoirAdmitted) {
            $query->where('eoir_admitted', true);
        }
        if ($usTaxCourt) {
            $query->where('us_tax_court', true);
        }
        if ($indiaBci) {
            $query->where('india_bci', true);
        }

        // Free Consultation
        if ($freeConsultation) {
            $query->where(function($q) {
                $q->whereNull('consultation_fee_amount')
                  ->orWhere('consultation_fee_amount', 0)
                  ->orWhereNotNull('consultation_duration');
            });
        }

        // Billing Model
        if ($billingModel) {
            $query->whereJsonContains('billing_model_json', $billingModel);
        }

        // Has Video
        if ($hasVideo) {
            $query->whereNotNull('youtube_videos_json')
                  ->where(DB::raw("JSON_LENGTH(youtube_videos_json)"), '>', 0);
        }

        // Has Publications
        if ($hasPublications) {
            $query->whereNotNull('publications_json')
                  ->where(DB::raw("JSON_LENGTH(publications_json)"), '>', 0);
        }

        // Accepts Legal Plans / Specific legal plan
        if ($acceptsLegalPlans) {
            $query->where('accepts_legal_plans', true);
        }
        if ($legalPlan) {
            $query->where('accepts_legal_plans', true)
                  ->where(function($q) use ($legalPlan) {
                      // Check for a verified plan in legal_plans_json array
                      // Each entry: { plan_name, provider, badge_color, verified }
                      $q->where(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(legal_plans_json, '$[*].plan_name'))"), 'like', "%{$legalPlan}%")
                        ->where(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(legal_plans_json, '$[*].verified'))"), 'like', "%true%");
                  });
        }

        // SABA Member
        if ($sabaMember) {
            $query->where(function($q) {
                $q->where(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(associations_json, '$[*].name'))"), 'like', '%South Asian Bar Association%')
                  ->orWhere(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(associations_json, '$[*].name'))"), 'like', '%SABA%');
            });
        }

        // Radius search based on Zipcode
        if ($zip) {
            $zipData = UsaZipcode::where('zip', $zip)->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;

                // Bounding box optimization to reduce rows before expensive distance calculation
                $latRange = $radius / 69;
                $lngRange = $radius / (69 * cos(deg2rad($lat)));

                $query->whereBetween('office_address_lat', [$lat - $latRange, $lat + $latRange])
                      ->whereBetween('office_address_lng', [$lng - $lngRange, $lng + $lngRange]);

                // Haversine formula
                $query->whereRaw(
                    "(3959 * acos(cos(radians(?)) * cos(radians(office_address_lat)) * cos(radians(office_address_lng) - radians(?)) + sin(radians(?)) * sin(radians(office_address_lat)))) <= ?",
                    [$lat, $lng, $lat, $radius]
                );
            }
        }

        // Rank by profile completeness score and average rating
        $attorneys = $query->orderBy('profile_completeness', 'desc')
            ->orderBy('avg_rating', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attorneys
        ]);
    }

    /**
     * Display a specific attorney profile by slug.
     */
    public function show($slug)
    {
        $attorney = Attorney::where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $attorney
        ]);
    }

    /**
     * Store a newly created attorney profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:80',
            'last_name' => 'required|string|max:80',
            'short_bio' => 'required|string|max:300',
            'full_biography' => 'required|string',
            'email' => 'required|email|max:200',
        ]);

        $user = $request->user();

        // Autogenerate slug: {first-name}-{last-name}-{city}-{zipcode}
        $fnSlug = Str::slug($request->first_name);
        $lnSlug = Str::slug($request->last_name);
        $citySlug = Str::slug($request->office_address_city ?: 'city');
        $zipSlug = Str::slug($request->office_address_zip ?: 'zip');
        $slug = "{$fnSlug}-{$lnSlug}-{$citySlug}-{$zipSlug}";

        // Unique slug resolution
        $originalSlug = $slug;
        $counter = 1;
        while (Attorney::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        // Geocode coordinates from Zip
        $lat = null;
        $lng = null;
        if ($request->office_address_zip) {
            $zipData = UsaZipcode::where('zip', $request->office_address_zip)->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;
            }
        }

        $attorneyData = $request->all();
        $attorneyData['user_id'] = $user ? $user->id : null;
        $attorneyData['slug'] = $slug;
        $attorneyData['office_address_lat'] = $lat;
        $attorneyData['office_address_lng'] = $lng;
        $attorneyData['profile_status'] = 'pending'; // Always goes for admin approval

        // Parse JSON lists
        $this->parseJsonFields($attorneyData, $request);

        // Calculate completeness score
        $attorneyData['profile_completeness'] = $this->calculateCompleteness($attorneyData);

        $attorney = Attorney::create($attorneyData);

        return response()->json([
            'success' => true,
            'message' => 'Desi Attorney profile listing submitted successfully and is pending administrative approval.',
            'data' => $attorney
        ]);
    }

    /**
     * Update an attorney profile.
     */
    public function update(Request $request, $id)
    {
        $attorney = Attorney::findOrFail($id);

        $attorneyData = $request->all();
        
        // Geocode if zip code changed
        if ($request->has('office_address_zip') && $request->office_address_zip !== $attorney->office_address_zip) {
            $zipData = UsaZipcode::where('zip', $request->office_address_zip)->first();
            if ($zipData) {
                $attorneyData['office_address_lat'] = $zipData->lat;
                $attorneyData['office_address_lng'] = $zipData->lng;
            }
        }

        // Parse JSON fields
        $this->parseJsonFields($attorneyData, $request);

        // Recalculate completeness
        $merged = array_merge($attorney->toArray(), $attorneyData);
        $attorneyData['profile_completeness'] = $this->calculateCompleteness($merged);

        // Keep status pending or reset to pending on update to ensure moderation
        $attorneyData['profile_status'] = 'pending';

        $attorney->update($attorneyData);

        return response()->json([
            'success' => true,
            'message' => 'Attorney profile updated successfully and is pending administrative review.',
            'data' => $attorney
        ]);
    }

    /**
     * Delete an attorney listing.
     */
    public function destroy($id)
    {
        $attorney = Attorney::findOrFail($id);
        $attorney->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attorney listing deleted successfully.'
        ]);
    }

    /**
     * Retrieve user's own attorney listings.
     */
    public function getMyListings(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([], 401);
        }

        $listings = Attorney::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($listings);
    }

    /**
     * Retrieve user's attorney listing count.
     */
    public function getMyAdCount(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['count' => 0]);
        }

        $count = Attorney::where('user_id', $user->id)->count();
        return response()->json(['count' => $count]);
    }

    /**
     * Admin Index - fetch all listings for moderation.
     */
    public function adminIndex(Request $request)
    {
        $query = Attorney::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('office_address_city', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('profile_status', $request->status);
        }

        $results = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($results);
    }

    /**
     * Admin Approve or Revoke Toggle.
     */
    public function adminToggleApproval(Request $request, $id)
    {
        $attorney = Attorney::findOrFail($id);
        if ($attorney->profile_status === 'active') {
            $attorney->profile_status = 'pending';
        } else {
            $attorney->profile_status = 'active';
        }
        $attorney->save();

        return response()->json([
            'success' => true,
            'message' => 'Attorney listing approval status toggled successfully.',
            'profile_status' => $attorney->profile_status
        ]);
    }

    /**
     * Admin verify specific legal plan.
     */
    public function adminVerifyLegalPlan(Request $request, $id)
    {
        $attorney = Attorney::findOrFail($id);
        $planName = $request->input('plan_name');
        $verify = $request->boolean('verify', true);

        $plans = $attorney->legal_plans_json ?: [];
        foreach ($plans as &$plan) {
            if (isset($plan['plan_name']) && $plan['plan_name'] === $planName) {
                $plan['verified'] = $verify;
            }
        }
        $attorney->legal_plans_json = $plans;
        $attorney->save();

        return response()->json([
            'success' => true,
            'message' => 'Legal plan verification status updated successfully.',
            'data' => $attorney
        ]);
    }

    /**
     * Parse JSON request fields safely.
     */
    private function parseJsonFields(&$data, Request $request)
    {
        $jsonFields = [
            'multiple_offices_json' => 'multiple_offices',
            'consultation_types_json' => 'consultation_types',
            'featured_articles_json' => 'featured_articles',
            'youtube_videos_json' => 'youtube_videos',
            'additional_degrees_json' => 'additional_degrees',
            'federal_courts_json' => 'federal_courts',
            'appeals_circuits_json' => 'appeals_circuits',
            'legal_plans_json' => 'legal_plans',
            'billing_model_json' => 'billing_model',
            'flat_fees_json' => 'flat_fees',
            'payment_methods_json' => 'payment_methods',
            'languages_json' => 'languages',
            'associations_json' => 'associations',
            'awards_json' => 'awards',
            'publications_json' => 'publications',
            'practice_areas_json' => 'practice_areas',
            'services_offered_json' => 'services_offered',
            'locations_covered_json' => 'locations_covered',
            'states_licensed_json' => 'states_licensed'
        ];

        foreach ($jsonFields as $dbKey => $reqKey) {
            if ($request->has($reqKey)) {
                $val = $request->input($reqKey);
                $data[$dbKey] = is_string($val) ? json_decode($val, true) : $val;
            }
        }
    }

    /**
     * Calculate profile completeness score (0-100%).
     */
    private function calculateCompleteness($data)
    {
        $points = 0;

        // 1. Short Bio (10%)
        if (!empty($data['short_bio'])) {
            $points += 10;
        }

        // 2. Full Biography (10%)
        if (!empty($data['full_biography']) && str_word_count(strip_tags($data['full_biography'])) >= 100) {
            $points += 10;
        }

        // 3. NRI Client Statement (5%)
        if (!empty($data['nri_client_statement'])) {
            $points += 5;
        }

        // 4. Career Summary or Personal Note (5%)
        if (!empty($data['career_summary']) || !empty($data['personal_note'])) {
            $points += 5;
        }

        // 5. Contact Details (Email + at least one phone/address) (10%)
        if (!empty($data['email']) && (!empty($data['phone']) || !empty($data['office_address_street']))) {
            $points += 10;
        }

        // 6. Bar Admissions / States Licensed (at least 1) (15%)
        $states = $data['states_licensed_json'] ?? [];
        if (!empty($states) && count($states) > 0) {
            $points += 15;
        }

        // 7. Jurisdictions (Federal Courts, circuits, supreme, eoir, tax) (5%)
        $fed = $data['federal_courts_json'] ?? [];
        if (!empty($fed) || !empty($data['us_supreme_court']) || !empty($data['eoir_admitted']) || !empty($data['us_tax_court'])) {
            $points += 5;
        }

        // 8. Practice Areas (at least 3) (10%)
        $pas = $data['practice_areas_json'] ?? [];
        if (!empty($pas) && count($pas) >= 3) {
            $points += 10;
        }

        // 9. Fee Structure (billing model filled) (8%)
        $bm = $data['billing_model_json'] ?? [];
        if (!empty($bm) && count($bm) > 0) {
            $points += 8;
        }

        // 10. Legal Plans Accepted (at least 1) (2%)
        $lp = $data['legal_plans_json'] ?? [];
        if (!empty($lp) && count($lp) > 0 && !empty($data['accepts_legal_plans'])) {
            $points += 2;
        }

        // 11. Languages Spoken (at least 1) (5%)
        $langs = $data['languages_json'] ?? [];
        if (!empty($langs) && count($langs) > 0) {
            $points += 5;
        }

        // 12. Education (Law School + Degree) (10%)
        if (!empty($data['law_school']) && !empty($data['law_degree'])) {
            $points += 10;
        }

        // 13. Professional Associations (at least 1) (5%)
        $assocs = $data['associations_json'] ?? [];
        if (!empty($assocs) && count($assocs) > 0) {
            $points += 5;
        }

        // 14. Social Media (at least 2 platforms) (3%)
        $socials = 0;
        if (!empty($data['linkedin_url'])) $socials++;
        if (!empty($data['twitter_url'])) $socials++;
        if (!empty($data['facebook_url'])) $socials++;
        if (!empty($data['instagram_url'])) $socials++;
        if ($socials >= 2) {
            $points += 3;
        }

        // 15. Publications or Blog (at least 1) (4%)
        $pubs = $data['publications_json'] ?? [];
        if (!empty($pubs) || !empty($data['blog_url'])) {
            $points += 4;
        }

        // 16. YouTube Video (at least 1) (3%)
        $yt = $data['youtube_videos_json'] ?? [];
        if (!empty($yt) && count($yt) > 0) {
            $points += 3;
        }

        return min(100, $points);
    }
}
