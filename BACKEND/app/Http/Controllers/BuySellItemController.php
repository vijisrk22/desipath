<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuySellItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BuySellItemController extends Controller
{
    public function index(Request $request)
    {
        $query = BuySellItem::query()
            ->select('buy_sell_items.*')
            ->addSelect(['state' => \DB::table('usa_zipcodes')
                ->select('state_id')
                ->whereColumn('zip', 'buy_sell_items.zipcode')
                ->limit(1)
            ])
            ->with('user:id,name,email,profile_photo')
            ->where('buy_sell_items.status', 'active');

        $zipcode = trim($request->zipcode);
        $city = trim($request->city);
        $radius = 100; // Miles

        $centerPoint = null;

        if (!empty($zipcode)) {
            $centerPoint = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
        } else if (!empty($city)) {
            $centerPoint = \DB::table('usa_zipcodes')->where('city', 'like', '%' . $city . '%')->first();
        }

        if ($centerPoint && $centerPoint->lat && $centerPoint->lng) {
            $lat = $centerPoint->lat;
            $lng = $centerPoint->lng;
            
            // Bounding box to reduce distance calculation overhead
            $latRange = $radius / 69;
            $lngRange = $radius / (69 * cos(deg2rad($lat)));

            // Use a subquery to calculate minimum distance for the item's city/state
            $query->selectSub(function ($subquery) use ($lat, $lng, $latRange, $lngRange) {
                $subquery->selectRaw("MIN(3959 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat))))", [$lat, $lng, $lat])
                    ->from('usa_zipcodes')
                    ->whereColumn('usa_zipcodes.city', 'buy_sell_items.city')
                    ->whereBetween('usa_zipcodes.lat', [$lat - $latRange, $lat + $latRange])
                    ->whereBetween('usa_zipcodes.lng', [$lng - $lngRange, $lng + $lngRange]);
            }, 'distance')
            ->havingRaw('distance <= ?', [$radius])
            ->orderBy('distance', 'asc');
        } else {
            // Fallback
            if (!empty($city)) {
                $query->where('buy_sell_items.city', 'like', '%' . $city . '%');
            }
            $query->latest();
        }

        if ($request->has('category') && $request->category !== 'All Categories' && !empty($request->category)) {
            $query->where('buy_sell_items.category', $request->category);
        }

        if ($request->has('min_price') && is_numeric($request->min_price)) {
            $query->where('buy_sell_items.price', '>=', $request->min_price);
        }

        if ($request->has('max_price') && is_numeric($request->max_price)) {
            $query->where('buy_sell_items.price', '<=', $request->max_price);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'nullable|numeric',
            'condition' => 'nullable|string',
            'description' => 'nullable|string',
            'zipcode' => 'nullable|string',
            'city' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $item = new BuySellItem();
        $item->user_id = Auth::id() ?: 1; // Fallback
        $item->title = $request->title;
        $item->category = $request->category;
        $item->price = $request->price;
        $item->condition = $request->condition;
        $item->description = $request->description;
        $item->zipcode = $request->zipcode;
        $item->city = $request->city;
        $item->status = 'active';

        $pictures = [];
        if ($request->hasFile('images')) {
            $files = array_slice($request->file('images'), 0, 5);
            foreach ($files as $file) {
                $path = $file->store('buysellitems', 'public');
                $pictures[] = '/storage/' . $path;
            }
        }
        $item->pictures = $pictures;
        $item->save();

        return response()->json($item, 201);
    }

    public function show($id)
    {
        $item = BuySellItem::with('user:id,name,email,profile_photo')->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = BuySellItem::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'nullable|numeric',
            'condition' => 'nullable|string',
            'description' => 'nullable|string',
            'zipcode' => 'nullable|string',
            'city' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        $item->title = $request->title;
        $item->category = $request->category;
        $item->price = $request->price;
        $item->condition = $request->condition;
        $item->description = $request->description;
        $item->zipcode = $request->zipcode;
        $item->city = $request->city;

        $pictures = $item->pictures ?? [];

        if ($request->has('removed_images')) {
            $removedImages = json_decode($request->removed_images, true);
            if (is_array($removedImages)) {
                $pictures = array_values(array_diff($pictures, $removedImages));
            }
        }

        if ($request->hasFile('images')) {
            $slotsLeft = 5 - count($pictures);
            if ($slotsLeft > 0) {
                $files = array_slice($request->file('images'), 0, $slotsLeft);
                foreach ($files as $file) {
                    $path = $file->store('buysellitems', 'public');
                    $pictures[] = '/storage/' . $path;
                }
            }
        }
        $item->pictures = $pictures;
        $item->save();

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = BuySellItem::findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
