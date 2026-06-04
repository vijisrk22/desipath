<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorAffiliation;
use App\Models\DoctorAward;
use App\Models\UsaZipcode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors for the public directory.
     */
    public function index(Request $request)
    {
        $term = $request->input('q');
        $specialty = $request->input('specialty');
        $zip = $request->input('zip');
        $radius = $request->input('radius', 100);
        $indianHealth = $request->input('indian_health');

        $query = Doctor::with(['affiliations', 'awards'])
            ->where('profile_status', 'active');

        // Text Search (Name, bio, practice_name)
        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('first_name', 'like', "%{$term}%")
                  ->orWhere('last_name', 'like', "%{$term}%")
                  ->orWhere('practice_name', 'like', "%{$term}%")
                  ->orWhere('headline', 'like', "%{$term}%")
                  ->orWhere('bio', 'like', "%{$term}%");
            });
        }

        // Filter by Specialty
        if ($specialty && $specialty !== 'All') {
            $query->where(function($q) use ($specialty) {
                $q->where('primary_specialty', $specialty)
                  ->orWhereJsonContains('subspecialties_json', $specialty);
            });
        }

        // Filter by Indian Health Specialisations
        if ($indianHealth) {
            $query->whereJsonContains('indian_health_specialisations_json', $indianHealth);
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

                $query->whereBetween('primary_address_lat', [$lat - $latRange, $lat + $latRange])
                      ->whereBetween('primary_address_lng', [$lng - $lngRange, $lng + $lngRange]);

                // Haversine formula (3959 miles = radius of Earth in miles)
                $query->whereRaw(
                    "(3959 * acos(cos(radians(?)) * cos(radians(primary_address_lat)) * cos(radians(primary_address_lng) - radians(?)) + sin(radians(?)) * sin(radians(primary_address_lat)))) <= ?",
                    [$lat, $lng, $lat, $radius]
                );
            }
        }

        $doctors = $query->orderBy('avg_rating', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }

    /**
     * Display a specific doctor profile by slug.
     */
    public function show($slug)
    {
        $doctor = Doctor::with(['affiliations', 'awards'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $doctor
        ]);
    }

    /**
     * Store a newly created doctor profile ad.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:80',
            'last_name' => 'required|string|max:80',
            'primary_specialty' => 'required|string|max:80',
            'credential' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:200',
            'npi_number' => 'nullable|string|size:10',
            'primary_address_street' => 'required|string|max:200',
            'primary_address_city' => 'required|string|max:80',
            'primary_address_state' => 'required|string|size:2',
            'primary_address_zip' => 'required|string|max:10',
        ]);

        $user = $request->user();

        // Autogenerate slug: {first-name}-{last-name}-{city}-{state}-{zipcode}
        $fnSlug = Str::slug($request->first_name);
        $lnSlug = Str::slug($request->last_name);
        $citySlug = Str::slug($request->primary_address_city ?: 'city');
        $stateSlug = Str::slug($request->primary_address_state ?: 'state');
        $zipSlug = Str::slug($request->primary_address_zip ?: 'zip');
        $slug = "{$fnSlug}-{$lnSlug}-{$citySlug}-{$stateSlug}-{$zipSlug}";

        // Ensure unique slug
        $originalSlug = $slug;
        $counter = 1;
        while (Doctor::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        // Try to geocode coordinates from zip using UsaZipcode
        $lat = null;
        $lng = null;
        $zipData = UsaZipcode::where('zip', $request->primary_address_zip)->first();
        if ($zipData) {
            $lat = $zipData->lat;
            $lng = $zipData->lng;
        }

        // Create the doctor listing with 'pending' status as requested ("all the posting needs approval")
        $doctor = Doctor::create([
            'user_id' => $user ? $user->id : null,
            'slug' => $slug,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'credential' => $request->credential ?: 'MD',
            'gender' => $request->gender ?: 'male',
            'npi_number' => $request->npi_number,
            'npi_verified' => $request->npi_number ? true : false,
            'npi_verified_at' => $request->npi_number ? now() : null,
            'phone' => $request->phone,
            'email' => $request->email,
            'headline' => $request->headline,
            'bio' => $request->bio,
            'primary_specialty' => $request->primary_specialty,
            'practice_name' => $request->practice_name,
            'practice_type' => $request->practice_type ?: 'solo',
            'primary_address_street' => $request->primary_address_street,
            'primary_address_city' => $request->primary_address_city,
            'primary_address_state' => $request->primary_address_state,
            'primary_address_zip' => $request->primary_address_zip,
            'primary_address_lat' => $lat,
            'primary_address_lng' => $lng,
            'fax' => $request->fax,
            'website_url' => $request->website_url,
            'appointment_booking_url' => $request->appointment_booking_url,
            'telehealth_available' => $request->boolean('telehealth_available'),
            'visiting_parents_care' => $request->boolean('visiting_parents_care'),
            'medical_proxy_assistance' => $request->boolean('medical_proxy_assistance'),
            'nri_specialist' => $request->boolean('nri_specialist'),
            'is_desi_doctor' => true,
            'cultural_background' => $request->cultural_background,
            'india_medical_training' => $request->india_medical_training,
            'india_medical_college' => $request->india_medical_college,
            'nri_specialist_statement' => $request->nri_specialist_statement,
            'subspecialties_json' => $request->subspecialties ? json_decode($request->subspecialties, true) : [],
            'board_certifications_json' => $request->board_certifications ? json_decode($request->board_certifications, true) : [],
            'conditions_treated_json' => $request->conditions_treated ? json_decode($request->conditions_treated, true) : [],
            'procedures_json' => $request->procedures ? json_decode($request->procedures, true) : [],
            'indian_health_specialisations_json' => $request->indian_health_specialisations ? json_decode($request->indian_health_specialisations, true) : [],
            'insurance_plans_json' => $request->insurance_plans ? json_decode($request->insurance_plans, true) : [],
            'additional_locations_json' => $request->additional_locations ? json_decode($request->additional_locations, true) : [],
            'languages_json' => $request->languages ? json_decode($request->languages, true) : [['language' => 'English', 'proficiency' => 'Fluent']],
            'office_hours_json' => $request->office_hours ? json_decode($request->office_hours, true) : [
                ['day' => 'Monday', 'open_time' => '09:00 AM', 'close_time' => '05:00 PM', 'closed' => false],
                ['day' => 'Tuesday', 'open_time' => '09:00 AM', 'close_time' => '05:00 PM', 'closed' => false],
                ['day' => 'Wednesday', 'open_time' => '09:00 AM', 'close_time' => '05:00 PM', 'closed' => false],
                ['day' => 'Thursday', 'open_time' => '09:00 AM', 'close_time' => '05:00 PM', 'closed' => false],
                ['day' => 'Friday', 'open_time' => '09:00 AM', 'close_time' => '05:00 PM', 'closed' => false],
                ['day' => 'Saturday', 'open_time' => '', 'close_time' => '', 'closed' => true],
                ['day' => 'Sunday', 'open_time' => '', 'close_time' => '', 'closed' => true]
            ],
            'profile_photo_url' => $request->profile_photo_url ?: null,
            'profile_status' => 'pending', // Postings need approval by default
        ]);

        // Add seeded hospital affiliations if provided
        if ($request->has('affiliations')) {
            $affs = json_decode($request->affiliations, true) ?: [];
            foreach ($affs as $aff) {
                DoctorAffiliation::create([
                    'doctor_id' => $doctor->doctor_id,
                    'facility_name' => $aff['facility_name'],
                    'facility_type' => $aff['facility_type'] ?: 'hospital',
                    'affiliation_type' => $aff['affiliation_type'] ?: 'affiliated',
                    'cms_star_rating' => $aff['cms_star_rating'] ?: 4.0,
                    'phone' => $aff['phone'] ?: $doctor->phone
                ]);
            }
        }

        // Add awards if provided
        if ($request->has('awards')) {
            $awards = json_decode($request->awards, true) ?: [];
            foreach ($awards as $aw) {
                DoctorAward::create([
                    'doctor_id' => $doctor->doctor_id,
                    'award_name' => $aw['award_name'],
                    'awarding_org' => $aw['awarding_org'],
                    'years_json' => $aw['years_json'] ?: [date('Y')]
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Desi Doctor listing submitted successfully and is pending administrative approval.',
            'data' => $doctor
        ]);
    }

    /**
     * Admin Index - fetch all doctor postings (active, pending, suspended).
     */
    public function adminIndex(Request $request)
    {
        $query = Doctor::with(['affiliations', 'awards']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('primary_specialty', 'like', "%{$search}%")
                  ->orWhere('practice_name', 'like', "%{$search}%");
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
        $doctor = Doctor::findOrFail($id);
        if ($doctor->profile_status === 'active') {
            $doctor->profile_status = 'pending'; // Revoke approval
        } else {
            $doctor->profile_status = 'active';  // Approve
        }
        $doctor->save();

        return response()->json([
            'success' => true,
            'message' => 'Doctor listing approval status toggled successfully.',
            'profile_status' => $doctor->profile_status
        ]);
    }

    /**
     * Update doctor profile details.
     */
    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $doctor->update([
            'first_name' => $request->first_name ?: $doctor->first_name,
            'last_name' => $request->last_name ?: $doctor->last_name,
            'credential' => $request->credential ?: $doctor->credential,
            'gender' => $request->gender ?: $doctor->gender,
            'headline' => $request->headline ?: $doctor->headline,
            'bio' => $request->bio ?: $doctor->bio,
            'primary_specialty' => $request->primary_specialty ?: $doctor->primary_specialty,
            'practice_name' => $request->practice_name ?: $doctor->practice_name,
            'phone' => $request->phone ?: $doctor->phone,
            'email' => $request->email ?: $doctor->email,
            'npi_number' => $request->npi_number ?: $doctor->npi_number,
            'primary_address_street' => $request->primary_address_street ?: $doctor->primary_address_street,
            'primary_address_city' => $request->primary_address_city ?: $doctor->primary_address_city,
            'primary_address_state' => $request->primary_address_state ?: $doctor->primary_address_state,
            'primary_address_zip' => $request->primary_address_zip ?: $doctor->primary_address_zip,
            'website_url' => $request->website_url ?: $doctor->website_url,
            'appointment_booking_url' => $request->appointment_booking_url ?: $doctor->appointment_booking_url,
            'telehealth_available' => $request->has('telehealth_available') ? $request->boolean('telehealth_available') : $doctor->telehealth_available,
            'visiting_parents_care' => $request->has('visiting_parents_care') ? $request->boolean('visiting_parents_care') : $doctor->visiting_parents_care,
            'medical_proxy_assistance' => $request->has('medical_proxy_assistance') ? $request->boolean('medical_proxy_assistance') : $doctor->medical_proxy_assistance,
            'nri_specialist' => $request->has('nri_specialist') ? $request->boolean('nri_specialist') : $doctor->nri_specialist,
            'cultural_background' => $request->cultural_background ?: $doctor->cultural_background,
            'india_medical_training' => $request->india_medical_training ?: $doctor->india_medical_training,
            'india_medical_college' => $request->india_medical_college ?: $doctor->india_medical_college,
            'nri_specialist_statement' => $request->nri_specialist_statement ?: $doctor->nri_specialist_statement,
            'profile_photo_url' => $request->profile_photo_url ?: $doctor->profile_photo_url,
        ]);

        if ($request->has('subspecialties')) {
            $doctor->subspecialties_json = json_decode($request->subspecialties, true);
        }
        if ($request->has('board_certifications')) {
            $doctor->board_certifications_json = json_decode($request->board_certifications, true);
        }
        if ($request->has('conditions_treated')) {
            $doctor->conditions_treated_json = json_decode($request->conditions_treated, true);
        }
        if ($request->has('procedures')) {
            $doctor->procedures_json = json_decode($request->procedures, true);
        }
        if ($request->has('indian_health_specialisations')) {
            $doctor->indian_health_specialisations_json = json_decode($request->indian_health_specialisations, true);
        }
        if ($request->has('insurance_plans')) {
            $doctor->insurance_plans_json = json_decode($request->insurance_plans, true);
        }
        if ($request->has('languages')) {
            $doctor->languages_json = json_decode($request->languages, true);
        }
        if ($request->has('office_hours')) {
            $doctor->office_hours_json = json_decode($request->office_hours, true);
        }
        if ($request->has('additional_locations')) {
            $doctor->additional_locations_json = json_decode($request->additional_locations, true);
        }
        $doctor->save();

        if ($request->has('awards')) {
            $doctor->awards()->delete();
            $awards = json_decode($request->awards, true) ?: [];
            foreach ($awards as $aw) {
                DoctorAward::create([
                    'doctor_id' => $doctor->doctor_id,
                    'award_name' => $aw['award_name'],
                    'awarding_org' => $aw['awarding_org'],
                    'years_json' => $aw['years_json'] ?: [date('Y')]
                ]);
            }
        }

        if ($request->has('affiliations')) {
            $doctor->affiliations()->delete();
            $affs = json_decode($request->affiliations, true) ?: [];
            foreach ($affs as $aff) {
                DoctorAffiliation::create([
                    'doctor_id' => $doctor->doctor_id,
                    'facility_name' => $aff['facility_name'],
                    'facility_type' => $aff['facility_type'] ?? 'hospital',
                    'affiliation_type' => $aff['affiliation_type'] ?? 'affiliated',
                    'cms_star_rating' => $aff['cms_star_rating'] ?? 4.0,
                    'phone' => $aff['phone'] ?? $doctor->phone
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Doctor profile updated successfully.',
            'data' => $doctor
        ]);
    }

    /**
     * Delete a doctor listing.
     */
    public function destroy($id)
    {
        $doctor = Doctor::findOrFail($id);
        $doctor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doctor profile deleted successfully.'
        ]);
    }

    /**
     * Retrieve user's own doctor listings.
     */
    public function getMyListings(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([], 401);
        }

        $listings = Doctor::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($listings);
    }

    /**
     * Retrieve user's doctor listing count.
     */
    public function getMyAdCount(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['count' => 0]);
        }

        $count = Doctor::where('user_id', $user->id)->count();
        return response()->json(['count' => $count]);
    }
}
