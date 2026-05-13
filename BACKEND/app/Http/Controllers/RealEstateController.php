<?php

namespace App\Http\Controllers;

use App\Models\RealEstateAd;
use App\Models\RealEstateImage;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RealEstateController extends Controller
{
    public function index(Request $request)
    {
        $query = RealEstateAd::with('galleryImages');

        // Search Filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('agent_company', 'like', "%{$search}%");
            });
        }

        // Country Filter
        if ($request->has('country')) {
            $query->where('country', $request->country);
        }

        // Property Type Filter
        if ($request->has('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        // Price Filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
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
            case 'size_desc':
                $query->orderBy('area_sqft', 'desc');
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
        return RealEstateAd::with('galleryImages')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getMyAdCount(Request $request)
    {
        return RealEstateAd::where('user_id', $request->user()->id)->count();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'property_type' => 'required|string',
            'country' => 'required|string',
            'city' => 'required|string',
            'state' => 'nullable|string',
            'address' => 'nullable|string',
            'price' => 'required|numeric',
            'currency' => 'required|string',
            'area_sqft' => 'nullable|integer',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'agent_name' => 'nullable|string',
            'agent_company' => 'nullable|string',
            'agent_phone' => 'nullable|string',
            'agent_email' => 'nullable|email',
            'main_image' => 'nullable|string',
            'video_url' => 'nullable|string',
            'features' => 'nullable|array',
            'slug' => 'nullable|string|unique:real_estate_ads,slug',
            'gallery' => 'nullable|array',
            'floor_plans' => 'nullable|array',
        ]);

        $data['user_id'] = $request->user()->id;
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(5);
        }

        $property = RealEstateAd::create($data);

        if (isset($data['gallery']) && is_array($data['gallery'])) {
            foreach ($data['gallery'] as $imgPath) {
                $property->galleryImages()->create(['image_path' => $imgPath]);
            }
        }

        if (isset($data['floor_plans']) && is_array($data['floor_plans'])) {
            foreach ($data['floor_plans'] as $plan) {
                $property->floorPlans()->create($plan);
            }
        }

        return response()->json(['message' => 'Property submitted for review', 'data' => $property->load('galleryImages')], 201);
    }

    public function show($idOrSlug)
    {
        $property = RealEstateAd::with(['galleryImages', 'user', 'floorPlans', 'projectVideos', 'landmarks'])
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json($property);
    }

    public function update(Request $request, $id)
    {
        $property = RealEstateAd::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'property_type' => 'sometimes|string',
            'country' => 'sometimes|string',
            'city' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'status' => 'nullable|string',
            'gallery' => 'nullable|array',
        ]);

        $property->update($data);

        if (isset($data['gallery']) && is_array($data['gallery'])) {
            $property->galleryImages()->delete();
            foreach ($data['gallery'] as $imgPath) {
                $property->galleryImages()->create(['image_path' => $imgPath]);
            }
        }

        return response()->json(['message' => 'Property updated successfully', 'data' => $property->load('galleryImages')]);
    }

    public function destroy($id)
    {
        $property = RealEstateAd::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }
        $property->delete();
        return response()->json(['message' => 'Property deleted successfully']);
    }

    public function getExchangeRates()
    {
        return response()->json(Currency::all());
    }
}
