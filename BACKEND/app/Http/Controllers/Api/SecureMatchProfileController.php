<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SecureMatchProfile;
use App\Models\SecureMatchPhoto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SecureMatchProfileController extends Controller
{
    public function index(Request $request)
    {
        $viewerId = Auth::guard('sanctum')->id();
        $query = SecureMatchProfile::with('photos')->where('status', 'active');

        // Enforce opposite gender view
        if ($viewerId) {
            $myProfile = SecureMatchProfile::where('user_id', $viewerId)->first();
            if ($myProfile && $myProfile->gender) {
                if (strtolower($myProfile->gender) === 'male') {
                    $query->where(function($q) use ($viewerId) {
                        $q->where('gender', 'Female')->orWhere('user_id', $viewerId);
                    });
                } else if (strtolower($myProfile->gender) === 'female') {
                    $query->where(function($q) use ($viewerId) {
                        $q->where('gender', 'Male')->orWhere('user_id', $viewerId);
                    });
                }
            }
        }

        // Apply filters
        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }
        if ($request->has('residency_tier')) {
            $query->where('residency_tier', $request->residency_tier);
        }
        if ($request->has('community')) {
            $query->where('community', $request->community);
        }
        if ($request->has('religion')) {
            $query->where('religion', $request->religion);
        }

        $profiles = $query->paginate(20);

        // Sanitize for anonymous viewing
        $profiles->getCollection()->transform(function ($profile) use ($viewerId) {
            return $this->sanitizeProfileForViewer($profile, $viewerId);
        });

        return response()->json($profiles);
    }

    public function myProfile()
    {
        $profile = SecureMatchProfile::with('photos')->where('user_id', Auth::id())->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        return response()->json($profile);
    }

    public function show($id)
    {
        $profile = SecureMatchProfile::with('photos')->findOrFail($id);
        
        // Allow full access if it's the user's own profile
        if (Auth::check() && $profile->user_id == Auth::id()) {
            return response()->json($profile);
        }

        // Otherwise sanitize based on consent
        $sanitized = $this->sanitizeProfileForViewer($profile, Auth::id());
        return response()->json($sanitized);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'display_name' => 'nullable|string',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'community' => 'nullable|string',
            'religion' => 'nullable|string',
            'education' => 'nullable|string',
            'profession' => 'nullable|string',
            'company_name' => 'nullable|string',
            'languages_spoken' => 'nullable|array',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'residency_tier' => 'nullable|string',
            'about_me' => 'nullable|string',
            'family_details' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|string',
            'food_preference' => 'nullable|string',
            'linkedin_url' => 'nullable|string',
            'created_by_relative' => 'boolean',
            'ref1_name' => 'nullable|string',
            'ref1_location' => 'nullable|string',
            'ref1_profession' => 'nullable|string',
            'ref1_contact_number' => 'nullable|string',
            'ref1_contact_no' => 'nullable|string',
            'ref2_name' => 'nullable|string',
            'ref2_location' => 'nullable|string',
            'ref2_profession' => 'nullable|string',
            'ref2_contact_number' => 'nullable|string',
            'ref2_contact_no' => 'nullable|string',
        ]);

        if (!empty($data['ref1_contact_no']) && empty($data['ref1_contact_number'])) {
            $data['ref1_contact_number'] = $data['ref1_contact_no'];
        }
        unset($data['ref1_contact_no']);

        if (!empty($data['ref2_contact_no']) && empty($data['ref2_contact_number'])) {
            $data['ref2_contact_number'] = $data['ref2_contact_no'];
        }
        unset($data['ref2_contact_no']);

        $profile = SecureMatchProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        if ($request->hasFile('profile_pic')) {
            SecureMatchPhoto::where('profile_id', $profile->id)->where('is_primary', true)->delete();
            $photo = $request->file('profile_pic');
            $path = $photo->store('securematch/photos', 'public');
            SecureMatchPhoto::create([
                'profile_id' => $profile->id,
                'photo_url' => '/storage/' . $path,
                'is_primary' => true,
                'order_index' => 0
            ]);
        }

        if ($request->hasFile('album_photos')) {
            // Count existing non-primary photos to continue the order_index
            $existingCount = SecureMatchPhoto::where('profile_id', $profile->id)->where('is_primary', false)->count();
            foreach ($request->file('album_photos') as $index => $photo) {
                $path = $photo->store('securematch/photos', 'public');
                SecureMatchPhoto::create([
                    'profile_id' => $profile->id,
                    'photo_url' => '/storage/' . $path,
                    'is_primary' => false,
                    'order_index' => $existingCount + $index + 1
                ]);
            }
        }

        return response()->json($profile->load('photos'), 201);
    }

    public function deletePhoto($photoId)
    {
        $photo = SecureMatchPhoto::findOrFail($photoId);
        $profile = SecureMatchProfile::findOrFail($photo->profile_id);

        if ($profile->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $path = str_replace('/storage/', '', $photo->photo_url);
        Storage::disk('public')->delete($path);
        
        $photo->delete();

        return response()->json(['message' => 'Photo deleted']);
    }

    private function sanitizeProfileForViewer($profile, $viewerId)
    {
        // Check interest status between profile owner and viewer
        $interestStatus = 'none'; 
        
        if ($viewerId) {
            $interest = \App\Models\SecureMatchInterest::where(function($q) use ($viewerId, $profile) {
                $q->where('sender_id', $viewerId)->where('receiver_id', $profile->user_id);
            })->orWhere(function($q) use ($viewerId, $profile) {
                $q->where('sender_id', $profile->user_id)->where('receiver_id', $viewerId);
            })->first();

            if ($interest) {
                $interestStatus = $interest->status;
            }
        }
        
        $sanitized = [
            'id' => $profile->id,
            'is_mine' => $viewerId && $viewerId === $profile->user_id,
            'interest_status' => $interestStatus,
            'interest_id' => isset($interest) ? $interest->id : null,
            'age' => $profile->dob ? \Carbon\Carbon::parse($profile->dob)->age : null,
            'gender' => $profile->gender,
            'community' => $profile->community,
            'religion' => $profile->religion,
            'education' => $profile->education,
            'profession' => $profile->profession,
            'company_name' => $profile->company_name,
            'languages_spoken' => $profile->languages_spoken,
            'city' => $profile->city,
            'country' => $profile->country,
            'residency_tier' => $profile->residency_tier,
            'food_preference' => $profile->food_preference,
            'linkedin_url' => $profile->linkedin_url,
            'created_by_relative' => $profile->created_by_relative,
            'about_me' => $profile->about_me,
            'trust_score' => $profile->trust_score,
            'status' => $profile->status,
        ];

        // Progressive unlock logic based on 2-step accept or own profile
        if ($interestStatus === 'accepted_step1' || $interestStatus === 'accepted_step2' || ($viewerId && $viewerId === $profile->user_id)) {
            $sanitized['display_name'] = $profile->display_name;
            $sanitized['family_details'] = $profile->family_details;
            $sanitized['contact_phone'] = $profile->contact_phone;
            $sanitized['contact_email'] = $profile->contact_email;
            $sanitized['ref1_name'] = $profile->ref1_name;
            $sanitized['ref1_location'] = $profile->ref1_location;
            $sanitized['ref1_profession'] = $profile->ref1_profession;
            $sanitized['ref1_contact_number'] = $profile->ref1_contact_number;
            $sanitized['ref2_name'] = $profile->ref2_name;
            $sanitized['ref2_location'] = $profile->ref2_location;
            $sanitized['ref2_profession'] = $profile->ref2_profession;
            $sanitized['ref2_contact_number'] = $profile->ref2_contact_number;
        }

        if ($interestStatus === 'accepted_step2' || ($viewerId && $viewerId === $profile->user_id)) {
            $albumUnlocked = false;
            if ($viewerId && $interest) {
                if ($interest->sender_id == $viewerId) {
                    $albumUnlocked = $interest->receiver_album_unlocked;
                    $sanitized['album_unlocked'] = $interest->receiver_album_unlocked;
                    $sanitized['requested_album'] = $interest->sender_requested_album;
                    $sanitized['they_requested_album'] = $interest->receiver_requested_album;
                    $sanitized['i_unlocked_album'] = $interest->sender_album_unlocked;
                } else {
                    $albumUnlocked = $interest->sender_album_unlocked;
                    $sanitized['album_unlocked'] = $interest->sender_album_unlocked;
                    $sanitized['requested_album'] = $interest->receiver_requested_album;
                    $sanitized['they_requested_album'] = $interest->sender_requested_album;
                    $sanitized['i_unlocked_album'] = $interest->receiver_album_unlocked;
                }
            }

            if ($albumUnlocked || $sanitized['is_mine']) {
                $sanitized['photos'] = $profile->photos;
            } else {
                $sanitized['photos'] = $profile->photos->where('is_primary', true)->values();
            }
        } else {
            $sanitized['photos'] = []; // Hidden photos
        }

        return $sanitized;
    }
}
