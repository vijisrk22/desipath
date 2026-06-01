<?php

namespace App\Http\Controllers;

use App\Models\TravelRequest;
use App\Models\VolunteerPost;
use App\Models\TravelMatch;
use App\Models\ModerationReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\TravelPostPublished;

class TravelCompanionController extends Controller
{
    /**
     * Create or update a travel request.
     */
    public function storeRequest(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), [
            'traveler_relation' => 'required|in:parents,spouse,friend,other',
            'travel_direction' => 'required|in:india_to_usa_canada,usa_canada_to_india',
            'route_legs' => 'required|array|min:2',
            'languages' => 'nullable|array',
            'travel_date' => 'nullable|date',
            'gift_card_offer' => 'required|in:0,50,100',
            'comments' => 'nullable|string|max:300',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'traveler_relation', 'traveler_age', 'special_needs', 'comfortable_helping',
            'travel_direction', 'route_legs', 'travel_date_confirmed', 'travel_date',
            'travel_month_from', 'travel_month_to', 'languages', 'language_flexible',
            'gift_card_offer', 'comments'
        ]);
        $data['user_id'] = $request->user()->id;
        
        // Automated expiry: 7 days after travel date if confirmed, else 3 months after creation
        if ($request->filled('travel_date')) {
            $data['expires_at'] = \Carbon\Carbon::parse($request->travel_date)->addDays(7);
        } else {
            $data['expires_at'] = now()->addMonths(3);
        }

        $travelRequest = TravelRequest::updateOrCreate(
            ['id' => $id ?: $request->id, 'user_id' => $request->user()->id],
            $data
        );

        // Send confirmation email
        try {
            Mail::to($request->user()->email)->send(new TravelPostPublished($travelRequest->load('user'), 'request'));
        } catch (\Exception $e) {
            \Log::error("Failed to send travel post email: " . $e->getMessage());
        }

        return response()->json($travelRequest);
    }

    /**
     * Create or update a volunteer post.
     */
    public function storeVolunteerPost(Request $request, $id = null)
    {
        $validator = Validator::make($request->all(), [
            'travelling_as' => 'required|in:individual,couple,family',
            'travel_direction' => 'required|in:india_to_usa_canada,usa_canada_to_india',
            'route_legs' => 'required|array|min:2',
            'languages' => 'nullable|array',
            'gift_card_preference' => 'required|in:free,50,100',
            'comments' => 'nullable|string|max:300',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'travelling_as', 'prior_experience', 'comfortable_helping', 'special_needs',
            'travel_direction', 'route_legs', 'travel_date_confirmed', 'travel_date',
            'travel_month_from', 'travel_month_to', 'languages', 'language_flexible',
            'gift_card_preference', 'comments'
        ]);
        $data['user_id'] = $request->user()->id;
        
        if ($request->filled('travel_date')) {
            $data['expires_at'] = \Carbon\Carbon::parse($request->travel_date)->addDays(7);
        } else {
            $data['expires_at'] = now()->addMonths(3);
        }

        $volunteerPost = VolunteerPost::updateOrCreate(
            ['id' => $id ?: $request->id, 'user_id' => $request->user()->id],
            $data
        );

        // Send confirmation email
        try {
            Mail::to($request->user()->email)->send(new TravelPostPublished($volunteerPost->load('user'), 'volunteer post'));
        } catch (\Exception $e) {
            \Log::error("Failed to send travel post email: " . $e->getMessage());
        }

        return response()->json($volunteerPost);
    }

    /**
     * Browse volunteer posts.
     */
    public function browseVolunteers(Request $request)
    {
        $query = VolunteerPost::with('user')->where('status', 'active');

        if ($request->filled('direction')) {
            $query->where('travel_direction', $request->direction);
        }

        if ($request->filled('from_date')) {
            $query->where('travel_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->where('travel_date', '<=', $request->to_date);
        }

        if ($request->filled('from_iata')) {
            $iata = strtoupper($request->from_iata);
            $query->whereJsonContains('route_legs', ['iata_code' => $iata, 'leg_type' => 'departure']);
        }

        if ($request->filled('to_iata')) {
            $iata = strtoupper($request->to_iata);
            $query->whereJsonContains('route_legs', ['iata_code' => $iata, 'leg_type' => 'destination']);
        }

        // Fallback for simple IATA search if needed (legacy or broad)
        if ($request->filled('iata') && !$request->filled('from_iata') && !$request->filled('to_iata')) {
            $iata = strtoupper($request->iata);
            $query->where('route_legs', 'like', '%"iata_code":"' . $iata . '"%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(12));
    }

    /**
     * Browse travel requests.
     */
    public function browseRequests(Request $request)
    {
        $query = TravelRequest::with('user')->where('status', 'active');

        if ($request->filled('direction')) {
            $query->where('travel_direction', $request->direction);
        }

        if ($request->filled('from_date')) {
            $query->where('travel_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->where('travel_date', '<=', $request->to_date);
        }

        if ($request->filled('from_iata')) {
            $iata = strtoupper($request->from_iata);
            $query->whereJsonContains('route_legs', ['iata_code' => $iata, 'leg_type' => 'departure']);
        }

        if ($request->filled('to_iata')) {
            $iata = strtoupper($request->to_iata);
            $query->whereJsonContains('route_legs', ['iata_code' => $iata, 'leg_type' => 'destination']);
        }

        if ($request->filled('iata') && !$request->filled('from_iata') && !$request->filled('to_iata')) {
            $iata = strtoupper($request->iata);
            $query->where('route_legs', 'like', '%"iata_code":"' . $iata . '"%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(12));
    }

    /**
     * Get user's own posts.
     */
    public function myPosts(Request $request)
    {
        $requests = TravelRequest::where('user_id', $request->user()->id)->get();
        $volunteers = VolunteerPost::where('user_id', $request->user()->id)->get();

        return response()->json([
            'requests' => $requests,
            'volunteers' => $volunteers
        ]);
    }

    /**
     * Submit a report.
     */
    public function report(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reported_user_id' => 'required|exists:users,id',
            'reason_code' => 'required|in:fake_profile,money_request,inappropriate,pii_sharing,fraud,other',
            'details' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $report = ModerationReport::create([
            'reporter_id' => $request->user()->id,
            'reported_user_id' => $request->reported_user_id,
            'post_id' => $request->post_id,
            'reason_code' => $request->reason_code,
            'details' => $request->details,
        ]);

        return response()->json($report, 201);
    }
}
