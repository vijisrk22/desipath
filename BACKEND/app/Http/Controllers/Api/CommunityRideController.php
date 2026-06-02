<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CommunityRide;
use Illuminate\Support\Str;

class CommunityRideController extends Controller
{
    public function index(Request $request)
    {
        $query = CommunityRide::with('poster:id,name,profile_photo')->active();

        if ($request->has('ride_type')) {
            $query->where('ride_type', $request->ride_type);
        }
        if ($request->has('post_type')) {
            $query->where('post_type', $request->post_type);
        }

        $rides = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($rides);
    }

    public function show($identifier)
    {
        $ride = CommunityRide::with('poster:id,name,profile_photo,created_at')
            ->where('slug', $identifier)
            ->orWhere('ride_id', $identifier)
            ->firstOrFail();
        return response()->json($ride);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ride_type' => 'required|in:commute,event,intercity',
            'post_type' => 'required|in:offering,seeking',
            'title' => 'required|string|max:80',
            'from_location_text' => 'required|string|max:150',
            'from_city' => 'required|string|max:80',
            'from_state' => 'nullable|string|max:2',
            'to_location_text' => 'required|string|max:150',
            'to_city' => 'required|string|max:80',
            'to_state' => 'nullable|string|max:2',
            'seats' => 'required|integer|min:1|max:6',
            'fuel_sharing' => 'required|in:yes,no,flexible',
            'contact_preference' => 'required|in:desipath_only,whatsapp_only,both',
            'whatsapp_number' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:300',
            'trip_date' => 'nullable|date',
            'departure_time' => 'nullable',
            'event_name' => 'nullable|string|max:100',
            'event_category' => 'nullable|in:temple,festival,cultural,sports,community,other',
            'schedule_days_json' => 'nullable|array',
        ]);

        $validated['poster_user_id'] = $request->user()->id;
        $validated['slug_id'] = Str::random(6);
        $validated['slug'] = $validated['ride_type'] . '-' . Str::slug($validated['from_city']) . '-to-' . Str::slug($validated['to_city']) . '-' . $validated['slug_id'];
        
        $ride = CommunityRide::create($validated);
        return response()->json($ride, 201);
    }

    public function myListings(Request $request)
    {
        $rides = CommunityRide::where('poster_user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($rides);
    }

    public function update(Request $request, $id)
    {
        $ride = CommunityRide::findOrFail($id);
        
        if ($ride->poster_user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Handle simple status toggle if only status is sent
        if ($request->has('status') && count($request->all()) === 1) {
            $ride->update(['status' => $request->status]);
            return response()->json($ride);
        }

        $validated = $request->validate([
            'ride_type' => 'required|in:commute,event,intercity',
            'post_type' => 'required|in:offering,seeking',
            'title' => 'required|string|max:80',
            'from_location_text' => 'required|string|max:150',
            'from_city' => 'required|string|max:80',
            'from_state' => 'nullable|string|max:2',
            'to_location_text' => 'required|string|max:150',
            'to_city' => 'required|string|max:80',
            'to_state' => 'nullable|string|max:2',
            'seats' => 'required|integer|min:1|max:6',
            'fuel_sharing' => 'required|in:yes,no,flexible',
            'contact_preference' => 'required|in:desipath_only,whatsapp_only,both',
            'whatsapp_number' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:300',
            'trip_date' => 'nullable|date',
            'departure_time' => 'nullable',
            'event_name' => 'nullable|string|max:100',
            'event_category' => 'nullable|in:temple,festival,cultural,sports,community,other',
            'schedule_days_json' => 'nullable|array',
        ]);

        $ride->update($validated);
        return response()->json($ride);
    }

    public function destroy(Request $request, $id)
    {
        $ride = CommunityRide::findOrFail($id);
        
        if ($ride->poster_user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ride->delete();
        return response()->json(['message' => 'Ride deleted']);
    }
}
