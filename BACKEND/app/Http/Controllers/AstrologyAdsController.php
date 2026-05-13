<?php

namespace App\Http\Controllers;

use App\Models\AstrologyAd;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use OpenApi\Annotations as OA;

/**
* @OA\Schema(
    *     schema="AstrologyAd",
    *     @OA\Property(property="astrologer_type", type="string", example="Vedic"),
    *     @OA\Property(property="address", type="string", example="456 Spiritual Ave"),
    *     @OA\Property(property="state", type="string", example="Tamil Nadu"),
    *     @OA\Property(property="city", type="string", example="Chennai"),
    *     @OA\Property(property="description", type="string", example="Expert in Vedic Astrology with 10+ years of experience."),
    *     @OA\Property(property="image", type="string", example="astrologer.jpg"),
    *     @OA\Property(property="price", type="number", format="decimal", example=300.00),
    *     @OA\Property(property="language_specific", type="boolean", example=true),
    *     @OA\Property(property="language", type="array", @OA\Items(type="string"), example={"Tamil", "English"}),
    *     @OA\Property(property="contact_form", type="string", example="Contact via email or phone."),
    *     @OA\Property(property="user_id", type="integer", example=1)
    * )
    */
class AstrologyAdsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/astrologyads",
     *     summary="Get list of astrology ads",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of astrology ads")
     * )
     */
    public function index(Request $request)
    {
        $query = AstrologyAd::with('packages');

        // Search Filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('display_name', 'like', "%{$search}%")
                  ->orWhere('astrologer_type', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Location/Country Filter
        if ($request->has('country')) {
            $query->where('country', $request->country);
        }

        // Service Type Filter
        if ($request->has('service_type')) {
            $service = $request->service_type;
            $query->where(function($q) use ($service) {
                $q->whereJsonContains('services_json', $service)
                  ->orWhere('astrologer_type', $service);
            });
        }

        // Language Filter
        if ($request->has('language')) {
            $lang = $request->language;
            $query->where(function($q) use ($lang) {
                $q->whereJsonContains('languages_json', $lang)
                  ->orWhere('language', 'like', "%{$lang}%");
            });
        }

        // Status Filter
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'approved');
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'exp_desc':
                $query->orderBy('experience_years', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('display_name', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate(15);
    }

    public function getMyListings(Request $request)
    {
        $user = $request->user();
        return AstrologyAd::with('packages')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function dummyInsert()
    {
        $faker = Faker::create();

        $dummyData = [
            'user_id' => $faker->numberBetween(1, 10),
            'display_name' => $faker->name,
            'experience_years' => $faker->numberBetween(1, 30),
            'tagline' => $faker->sentence(6),
            'astrologer_type' => $faker->randomElement(['Vedic', 'Western', 'Numerology', 'Tarot']),
            'address' => $faker->address,
            'state' => $faker->state,
            'city' => $faker->city,
            'country' => $faker->randomElement(['USA', 'India', 'UAE', 'Singapore', 'Australia']),
            'phone' => $faker->phoneNumber,
            'email' => $faker->safeEmail,
            'description' => $faker->paragraph(3),
            'certifications' => $faker->sentence,
            'price' => $faker->randomFloat(2, 50, 500),
            'language_specific' => true,
            'languages_json' => $faker->randomElements(['English', 'Hindi', 'Tamil', 'Telugu'], 2),
            'services_json' => $faker->randomElements(['Vedic Astrology', 'Palm Reading', 'Tarot Reading', 'Numerology'], 3),
            'consultation_modes' => $faker->randomElements(['Phone', 'Video', 'Chat'], 2),
            'status' => 'approved',
        ];

        $astrologyAd = AstrologyAd::create($dummyData);

        // Add dummy packages
        foreach (['Basic', 'Standard', 'Premium'] as $pName) {
            $astrologyAd->packages()->create([
                'name' => "$pName Consultation",
                'duration' => $faker->randomElement(['30 min', '60 min', '90 min']),
                'price' => $faker->randomFloat(2, 20, 300),
                'description' => $faker->sentence,
                'is_popular' => $pName === 'Standard',
            ]);
        }

        return response()->json([
            'message' => 'Dummy astrology ad V2 added successfully',
            'data' => $astrologyAd->load('packages')
        ], 201);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'display_name' => 'required|string|max:255',
            'astrologer_type' => 'required|string|max:255',
            'experience_years' => 'nullable|integer',
            'tagline' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'description' => 'nullable|string',
            'certifications' => 'nullable|string',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'languages_json' => 'nullable|array',
            'services_json' => 'nullable|array',
            'consultation_modes' => 'nullable|array',
            'locations_served' => 'nullable|array',
            'packages' => 'nullable|array',
        ]);

        if (!isset($data['user_id'])) {
            $data['user_id'] = $request->user()->id;
        }

        $astrologyAd = AstrologyAd::create($data);

        if (isset($data['packages']) && is_array($data['packages'])) {
            foreach ($data['packages'] as $package) {
                $astrologyAd->packages()->create($package);
            }
        }

        return response()->json(['message' => 'Astrology ad submitted for review', 'data' => $astrologyAd->load('packages')], 201);
    }

    public function show($idOrSlug)
    {
        $astrologyAd = AstrologyAd::with('packages', 'user')
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        return response()->json($astrologyAd);
    }

    public function update(Request $request, $id)
    {
        $astrologyAd = AstrologyAd::find($id);

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        $data = $request->validate([
            'display_name' => 'sometimes|string|max:255',
            'astrologer_type' => 'sometimes|string|max:255',
            'experience_years' => 'nullable|integer',
            'tagline' => 'nullable|string|max:255',
            'address' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'country' => 'sometimes|string|max:100',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'description' => 'nullable|string',
            'certifications' => 'nullable|string',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'languages_json' => 'nullable|array',
            'services_json' => 'nullable|array',
            'consultation_modes' => 'nullable|array',
            'locations_served' => 'nullable|array',
            'packages' => 'nullable|array',
            'status' => 'nullable|string',
        ]);

        $astrologyAd->update($data);

        if (isset($data['packages']) && is_array($data['packages'])) {
            $astrologyAd->packages()->delete();
            foreach ($data['packages'] as $package) {
                $astrologyAd->packages()->create($package);
            }
        }

        return response()->json(['message' => 'Astrology ad updated successfully', 'data' => $astrologyAd->load('packages')]);
    }

    public function destroy($id)
    {
        $astrologyAd = AstrologyAd::find($id);

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        $astrologyAd->delete();

        return response()->json(['message' => 'Astrology ad deleted successfully']);
    }
}
