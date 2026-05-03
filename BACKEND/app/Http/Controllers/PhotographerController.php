<?php

namespace App\Http\Controllers;

use App\Models\Photographer;
use App\Models\PhotographerLocation;
use App\Models\PhotographerPackage;
use App\Models\UsaZipcode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhotographerController extends Controller
{
    /**
     * Display a listing of the photographers.
     */
    public function index(Request $request)
    {
        $term = $request->input('q');
        $type = $request->input('type'); // Photographer, Videographer, Both
        $zip = $request->input('zip');
        $radius = $request->input('radius', 100);

        $query = Photographer::with(['packages', 'locations'])
            ->where('status', 'active');

        if ($type && $type !== 'Both') {
            $query->where(function ($q) use ($type) {
                $q->where('service_type', $type)->orWhere('service_type', 'Both');
            });
        }

        if ($term) {
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('bio', 'like', "%{$term}%")
                    ->orWhere('languages', 'like', "%{$term}%");
            });
        }

        if ($zip) {
            $zipData = UsaZipcode::where('zip', $zip)->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;

                // Haversine formula for radius in miles
                $query->whereHas('locations', function ($q) use ($lat, $lng, $radius) {
                    $q->whereRaw("(3959 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?", [
                        $lat, $lng, $lat, $radius
                    ]);
                });
            }
        }

        $photographers = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $photographers
        ]);
    }

    /**
     * Store a newly created photographer in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'bio' => 'required|string',
            'service_type' => 'required|in:Photographer,Videographer,Both',
            'experience_years' => 'required|integer',
            'languages' => 'nullable|string',
            'services' => 'nullable|array',
            'video_url' => 'nullable|string',
            'open_to_travel' => 'nullable',
            'travel_policy' => 'nullable|string',
            'packages' => 'required|array|min:1',
            'packages.*.name' => 'required|string',
            'packages.*.price' => 'required|numeric',
            'packages.*.description' => 'nullable|string',
            'locations' => 'required|array|min:1',
            'locations.*.address' => 'nullable|string',
            'locations.*.city' => 'required|string',
            'locations.*.state' => 'required|string',
            'locations.*.zipcode' => 'required|string',
        ]);

        // Handle boolean from FormData
        if (isset($data['open_to_travel'])) {
            $data['open_to_travel'] = ($data['open_to_travel'] === 'true' || $data['open_to_travel'] === true || $data['open_to_travel'] === 1 || $data['open_to_travel'] === '1');
        }

        try {
            DB::beginTransaction();

            $photographer = new Photographer($data);
            $photographer->user_id = $user->id;
            $photographer->status = 'active'; // Default to active for now

            if ($request->hasFile('profile_photo')) {
                $path = $request->file('profile_photo')->store('photography/profiles', 'public');
                $photographer->profile_photo = $path;
            }

            if ($request->hasFile('backdrop_photo')) {
                $path = $request->file('backdrop_photo')->store('photography/backdrops', 'public');
                $photographer->backdrop_photo = $path;
            }

            $photographer->save();

            // Save Packages
            foreach ($data['packages'] as $pkg) {
                $photographer->packages()->create($pkg);
            }

            // Save Locations
            foreach ($data['locations'] as $loc) {
                $zipData = UsaZipcode::where('zip', $loc['zipcode'])->first();
                if ($zipData) {
                    $loc['lat'] = $zipData->lat;
                    $loc['lng'] = $zipData->lng;
                }
                $photographer->locations()->create($loc);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Listing created successfully',
                'data' => $photographer->load(['packages', 'locations'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified photographer.
     */
    public function show($id)
    {
        $photographer = Photographer::with(['packages', 'locations', 'user'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $photographer
        ]);
    }

    /**
     * Update the specified photographer in storage.
     */
    public function update(Request $request, $id)
    {
        $photographer = Photographer::findOrFail($id);
        
        // Validate and update... similar to store but with partial updates
        // For brevity, keeping it simple
        $photographer->update($request->all());
        
        return response()->json(['success' => true, 'data' => $photographer]);
    }

    /**
     * Remove the specified photographer from storage.
     */
    public function destroy($id)
    {
        $photographer = Photographer::findOrFail($id);
        $photographer->delete();
        return response()->json(['success' => true, 'message' => 'Deleted successfully']);
    }

    /**
     * Get count of listings for current user
     */
    public function myCount(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['success' => false, 'count' => 0]);
        
        $count = Photographer::where('user_id', $user->id)->count();
        return response()->json(['success' => true, 'count' => $count]);
    }

    /**
     * Get listings for current user
     */
    public function myListings(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        
        $listings = Photographer::with(['packages', 'locations'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($listings);
    }

    /**
     * Toggle status active/inactive
     */
    public function toggleStatus($id)
    {
        $photographer = Photographer::findOrFail($id);
        $photographer->status = $photographer->status === 'active' ? 'inactive' : 'active';
        $photographer->save();
        return response()->json(['success' => true, 'status' => $photographer->status]);
    }
}
