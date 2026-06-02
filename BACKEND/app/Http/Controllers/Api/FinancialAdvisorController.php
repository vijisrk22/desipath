<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FinancialAdvisor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FinancialAdvisorController extends Controller
{
    /**
     * Get a listing of verified financial advisors
     */
    public function index(Request $request)
    {
        try {
            $query = FinancialAdvisor::with('user:id,name,profile_photo')->where('profile_status', 'active');
            
            // Text search
            if ($request->has('query') && !empty($request->input('query'))) {
                $q = $request->input('query');
                $query->where(function($qBuilder) use ($q) {
                    $qBuilder->whereHas('user', function($u) use ($q) {
                        $u->where('name', 'like', "%{$q}%");
                    })
                    ->orWhere('firm_name', 'like', "%{$q}%")
                    ->orWhere('primary_city', 'like', "%{$q}%")
                    ->orWhere('nri_specialist_statement', 'like', "%{$q}%");
                });
            }
            
            // NRI Service Toggles
            if ($request->boolean('pfic_advisory')) {
                $query->where('pfic_advisory', true);
            }
            if ($request->boolean('fbar_fatca_advisory')) {
                $query->where('fbar_fatca_advisory', true);
            }
            if ($request->boolean('dtaa_optimization')) {
                $query->where('dtaa_optimization', true);
            }
            
            // Fee Structure
            if ($request->has('fee_structure') && !empty($request->input('fee_structure'))) {
                $query->whereIn('fee_structure_type', explode(',', $request->input('fee_structure')));
            }
            
            // Service Category (stored in JSON services column)
            if ($request->has('category') && !empty($request->input('category'))) {
                $query->whereJsonContains('services', $request->input('category'));
            }
            
            $advisors = $query->orderBy('created_at', 'desc')->paginate(15);
            return response()->json($advisors);
            
        } catch (\Exception $e) {
            Log::error("Error fetching financial advisors: " . $e->getMessage());
            return response()->json(['message' => 'Error fetching financial advisors'], 500);
        }
    }

    /**
     * Get specific advisor profile by slug
     */
    public function show($slug)
    {
        try {
            $advisor = FinancialAdvisor::with('user:id,name,profile_photo,email,phone_number')
                        ->where('slug', $slug)
                        ->firstOrFail();
            return response()->json($advisor);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Advisor not found'], 404);
        }
    }

    /**
     * Store new advisor profile
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validated = $request->validate([
                'firm_name' => 'nullable|string',
                'consultant_name' => 'nullable|string',
                'years_experience' => 'integer|min:0',
                'nri_specialist_statement' => 'nullable|string',
                'fee_structure_type' => 'required|string',
                'minimum_investment' => 'nullable|numeric',
                'primary_city' => 'required|string',
                'state' => 'nullable|string',
                'finra_crd_number' => 'nullable|string',
                'qualifications' => 'nullable|string',
                'accreditations' => 'nullable|string',
                'contact_email' => 'nullable|email',
                'contact_phone' => 'nullable|string',
                'website' => 'nullable|string',
                'free_consultation' => 'nullable|string',
                'advisor_profile_image' => 'nullable|image|max:2048',
                'cover_image' => 'nullable|image|max:2048',
            ]);
            
            // Basic slug generation from user's name or consultant name
            $nameForSlug = $request->input('consultant_name') ?: $user->name;
            $slug = FinancialAdvisor::generateSlug($nameForSlug);
            
            $advisor = new FinancialAdvisor($validated);
            $advisor->user_id = $user->id;
            $advisor->slug = $slug;
            
            // Handle File Uploads
            if ($request->hasFile('advisor_profile_image')) {
                $path = $request->file('advisor_profile_image')->store('advisor_profiles', 'public');
                $advisor->advisor_profile_image = $path;
            }
            if ($request->hasFile('cover_image')) {
                $path = $request->file('cover_image')->store('advisor_covers', 'public');
                $advisor->cover_image = $path;
            }
            
            // Additional JSON / boolean fields from request
            if ($request->has('services')) $advisor->services = json_decode($request->input('services', '[]'), true) ?: $request->input('services');
            if ($request->has('states_licensed')) $advisor->states_licensed = json_decode($request->input('states_licensed', '[]'), true) ?: $request->input('states_licensed');
            
            // Map booleans
            $advisor->fbar_fatca_advisory = $request->boolean('fbar_fatca_advisory');
            $advisor->pfic_advisory = $request->boolean('pfic_advisory');
            $advisor->dtaa_optimization = $request->boolean('dtaa_optimization');
            $advisor->virtual_consultation = $request->boolean('virtual_consultation', true);
            
            $advisor->save();
            
            return response()->json([
                'message' => 'Profile created successfully!',
                'data' => $advisor
            ], 201);
            
        } catch (\Exception $e) {
            Log::error("Error creating financial advisor profile: " . $e->getMessage());
            return response()->json(['message' => 'Error creating profile: ' . $e->getMessage()], 500);
        }
    }

    public function myListings()
    {
        try {
            $user = Auth::user();
            $advisors = FinancialAdvisor::where('user_id', $user->id)->get();
            return response()->json($advisors);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching your listings'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $advisor = FinancialAdvisor::where('advisor_id', $id)->where('user_id', $user->id)->firstOrFail();
            
            $advisor->fill($request->except(['advisor_profile_image', 'cover_image', 'services', 'states_licensed']));
            
            // Handle File Uploads
            if ($request->hasFile('advisor_profile_image')) {
                $path = $request->file('advisor_profile_image')->store('advisor_profiles', 'public');
                $advisor->advisor_profile_image = $path;
            }
            if ($request->hasFile('cover_image')) {
                $path = $request->file('cover_image')->store('advisor_covers', 'public');
                $advisor->cover_image = $path;
            }
            
            // JSON Arrays
            if ($request->has('services')) $advisor->services = json_decode($request->input('services', '[]'), true) ?: $request->input('services');
            if ($request->has('states_licensed')) $advisor->states_licensed = json_decode($request->input('states_licensed', '[]'), true) ?: $request->input('states_licensed');
            
            // Map booleans
            if ($request->has('fbar_fatca_advisory')) $advisor->fbar_fatca_advisory = $request->boolean('fbar_fatca_advisory');
            if ($request->has('pfic_advisory')) $advisor->pfic_advisory = $request->boolean('pfic_advisory');
            if ($request->has('dtaa_optimization')) $advisor->dtaa_optimization = $request->boolean('dtaa_optimization');
            
            $advisor->save();

            return response()->json(['message' => 'Profile updated successfully']);
        } catch (\Exception $e) {
            Log::error("Error updating profile: " . $e->getMessage());
            return response()->json(['message' => 'Error updating profile'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $advisor = FinancialAdvisor::where('advisor_id', $id)->where('user_id', $user->id)->firstOrFail();
            $advisor->delete();
            return response()->json(['message' => 'Profile deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting profile'], 500);
        }
    }
}
