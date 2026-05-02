<?php

namespace App\Http\Controllers;

use App\Models\LocalAd;
use App\Models\BusinessAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class LocalAdsController extends Controller
{
    /**
     * Get public feed of approved ads
     */
    public function index(Request $request)
    {
        $query = LocalAd::with('businessAccount')
            ->where('status', 'approved')
            ->where('expires_at', '>', Carbon::now());

        if ($request->has('category') && $request->category !== 'All' && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('city') && $request->city !== 'All' && !empty($request->city)) {
            $query->where('location_city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhereHas('businessAccount', function($sq) use ($search) {
                      $sq->where('business_name', 'like', "%{$search}%");
                  });
            });
        }

        $ads = $query->orderBy('approved_at', 'desc')->paginate(10);
        return response()->json($ads);
    }

    /**
     * Get ads for the logged-in business account
     */
    public function myAds(Request $request)
    {
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();
        
        if (!$businessAccount) {
            return response()->json(['message' => 'No business account found'], 404);
        }

        $ads = LocalAd::where('business_account_id', $businessAccount->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ads);
    }

    /**
     * Store a new ad
     */
    public function store(Request $request)
    {
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();
        
        if (!$businessAccount) {
            return response()->json(['message' => 'Business account not active or found'], 403);
        }

        // Check active ad limit (3)
        $activeCount = LocalAd::where('business_account_id', $businessAccount->id)
            ->whereIn('status', ['approved', 'pending'])
            ->count();
        
        if ($activeCount >= 3) {
            return response()->json(['message' => 'Maximum limit of 3 active ads reached'], 422);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:80',
            'description' => 'required|string|max:500',
            'category' => 'required|string',
            'location_city' => 'required|string',
            'location_state' => 'nullable|string',
            'zipcode' => 'nullable|string',
            'country' => 'required|string',
            'website_url' => 'nullable|url',
            'tags' => 'nullable|array',
            'images' => 'required|array|min:1|max:5',
            'images.*' => 'string', // Base64 strings
            
            // Display & Contact Overrides
            'display_phone' => 'nullable|string',
            'display_email' => 'nullable|email',
            'is_contact_person_different' => 'boolean',
            'ad_contact_name' => 'nullable|string',
            'ad_contact_email' => 'nullable|email',
            'ad_contact_phone' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'title', 'description', 'category', 'location_city', 'location_state', 
            'country', 'website_url', 'tags', 'display_phone', 'display_email',
            'is_contact_person_different', 'ad_contact_name', 'ad_contact_email', 'ad_contact_phone'
        ]);
        
        $data['business_account_id'] = $businessAccount->id;
        $data['status'] = 'pending';

        // Update business account info if provided in Step 1
        if ($request->has('business_address')) {
            $businessAccount->update([
                'address_line1' => $request->business_address,
                'zipcode' => $request->zipcode,
                'contact_person_name' => $request->contact_person_name,
                'contact_person_email' => $request->contact_person_email,
                'contact_person_phone' => $request->contact_person_phone,
            ]);
        }

        // Handle Image Uploads
        $posterUrls = [];
        foreach ($request->images as $base64Image) {
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                $image = substr($base64Image, strpos($base64Image, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, etc

                if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png', 'webp'])) {
                    continue;
                }

                $image = base64_decode($image);
                $filename = uniqid() . '.' . $type;
                
                Storage::disk('public')->put('localads/' . $filename, $image);
                $posterUrls[] = 'storage/localads/' . $filename;
            } else {
                // If it's already a URL (e.g. during edit)
                $posterUrls[] = $base64Image;
            }
        }
        $data['poster_urls'] = $posterUrls;

        $ad = LocalAd::create($data);
        return response()->json(['message' => 'Ad submitted for review', 'data' => $ad], 201);
    }

    /**
     * Update an existing ad
     */
    public function update(Request $request, $id)
    {
        $ad = LocalAd::findOrFail($id);
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();

        if ($ad->business_account_id !== $businessAccount->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Live ads cannot be edited directly; must be set to draft/pending
        $data = $request->only(['title', 'description', 'category', 'location_city', 'location_state', 'country', 'website_url', 'tags']);
        
        if ($request->has('images')) {
            $posterUrls = [];
            foreach ($request->images as $img) {
                if (strpos($img, 'data:image') === 0) {
                    preg_match('/^data:image\/(\w+);base64,/', $img, $type);
                    $image = substr($img, strpos($img, ',') + 1);
                    $type = strtolower($type[1]);
                    $image = base64_decode($image);
                    $filename = uniqid() . '.' . $type;
                    Storage::disk('public')->put('localads/' . $filename, $image);
                    $posterUrls[] = 'storage/localads/' . $filename;
                } else {
                    $posterUrls[] = $img;
                }
            }
            $data['poster_urls'] = $posterUrls;
        }

        // Reset to pending review if edited
        $data['status'] = 'pending';
        $ad->update($data);

        return response()->json(['message' => 'Ad updated and resubmitted for review', 'data' => $ad]);
    }

    /**
     * Delete an ad
     */
    public function destroy($id)
    {
        $ad = LocalAd::findOrFail($id);
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();

        if ($ad->business_account_id !== $businessAccount->id && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ad->delete();
        return response()->json(['message' => 'Ad deleted successfully']);
    }

    /**
     * Admin: Approve or Reject ad
     */
    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected,suspended',
            'rejection_reason' => 'required_if:status,rejected'
        ]);

        $ad = LocalAd::findOrFail($id);
        $ad->status = $request->status;
        
        if ($request->status === 'approved') {
            $ad->approved_at = Carbon::now();
            $ad->expires_at = Carbon::now()->addDays(15);
            $ad->rejection_reason = null;
        } else {
            $ad->rejection_reason = $request->rejection_reason;
        }

        $ad->save();
        return response()->json(['message' => 'Ad status updated to ' . $request->status, 'data' => $ad]);
    }

    /**
     * Admin: Get all ads for review
     */
    public function adminIndex(Request $request)
    {
        try {
            if (!Auth::check()) {
                \Log::warning('Admin Index: User not authenticated');
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            \Log::info('Admin Index Called', [
                'user_id' => Auth::id(),
                'role' => Auth::user() ? Auth::user()->role : 'N/A',
                'status' => $request->status
            ]);

            if (Auth::user()->role !== 'admin') {
                \Log::warning('Admin Index: Unauthorized access attempt', ['user_id' => Auth::id()]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $query = LocalAd::with('businessAccount')->orderBy('created_at', 'desc');

            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            $result = $query->paginate(20);
            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Admin Index Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }
    /**
     * Get count of ads for the logged-in user's business account
     */
    public function getMyAdCount(Request $request)
    {
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();
        if (!$businessAccount) return response()->json(0);

        $count = LocalAd::where('business_account_id', $businessAccount->id)->count();
        return response()->json($count);
    }

    /**
     * Show a specific ad (for editing)
     */
    public function show($id)
    {
        $ad = LocalAd::with('businessAccount')->findOrFail($id);
        
        // Security: only owner or admin can see full details for edit
        $businessAccount = BusinessAccount::where('owner_user_id', Auth::id())->first();
        if (Auth::user()->role !== 'admin' && (!$businessAccount || $ad->business_account_id !== $businessAccount->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($ad);
    }
}
