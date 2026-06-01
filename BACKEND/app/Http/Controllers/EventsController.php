<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\User;

class EventsController extends Controller
{
    public function adminIndex(Request $request)
    {
        $query = Event::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('event_name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('state_city_zipcode', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $results = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($results);
    }

    public function adminToggleStatus(Request $request, $id)
    {
        $item = Event::findOrFail($id);
        $item->status = ($item->status === 'active' || $item->status === 'approved') ? 'pending' : 'active';
        $item->save();
        return response()->json(['success' => true, 'status' => $item->status]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Event::query()->where('status', 'active');

        // Admin search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('event_name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('state_city_zipcode', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        $events = $query->orderBy('created_at', 'desc')->paginate(100);
        
        // Transform to match frontend expectations
        $events->getCollection()->transform(function($event) {
            // Parse datetime to extract time
            $dateTime = new \DateTime($event->from_date);
            
            return [
                'id' => $event->id,
                'title' => $event->event_name,
                'location' => $event->state_city_zipcode,
                'date' => $dateTime->format('Y-m-d\TH:i:s'), // ISO format with time
                'image' => !empty($event->cover_images) && is_array($event->cover_images) && count($event->cover_images) > 0 
                    ? $event->cover_images[0] 
                    : '/img/events/eventSmpl1.png',
                'ticketPrice' => is_numeric($event->ticket_price) 
                    ? '$' . number_format($event->ticket_price, 0) 
                    : $event->ticket_price,
                // Pass raw data for admin editing if needed
                'address' => $event->address,
                'event_type' => $event->event_type,
            ];
        });
        
        return response()->json($events);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'details' => 'required|array',
            'ticketPrice' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $details = $request->input('details');
        $imgs = $request->input('imgs', []);
        
        $processImages = function($images) {
            $processed = [];
            if (!is_array($images)) return [];
            $disk = env('FILESYSTEM_DISK', 'public');
            foreach ($images as $img) {
                if (is_string($img) && preg_match('/^data:image\/(\w+);base64,/', $img, $type)) {
                    $data = substr($img, strpos($img, ',') + 1);
                    $data = base64_decode($data);
                    
                    if ($data === false) continue;

                    $extension = strtolower($type[1]);
                    $filename = Str::random(20) . '.' . $extension;
                    $path = 'events/' . $filename;
                    
                    \Illuminate\Support\Facades\Storage::disk($disk)->put($path, $data);
                    
                    $processed[] = $disk === 'public' ? 'storage/' . $path : \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
                }
            }
            return $processed;
        };

        $storedImages = $processImages($imgs);

        $eventDateStr = $details['Event Date and Time'] ?? $details['Event Date'] ?? null;
        $eventDate = now();
        if ($eventDateStr) {
            try {
                if (str_contains($eventDateStr, ' at ')) {
                    $cleanedDate = str_replace(' at ', ' ', $eventDateStr);
                    $eventDate = \Carbon\Carbon::createFromFormat('d-m-Y g:i A', $cleanedDate);
                } else {
                    $eventDate = \Carbon\Carbon::parse($eventDateStr);
                }
            } catch (\Exception $e) {
                \Log::warning('Date parsing failed', ['date' => $eventDateStr, 'error' => $e->getMessage()]);
            }
        }

        // Sync coordinates
        $locStr = $details['State, City, Zipcode'] ?? $details['Location'] ?? '';
        $city = ''; $state = ''; $zipcode = '';
        if ($locStr) {
            $parts = array_map('trim', explode(',', $locStr));
            if (count($parts) >= 3) {
                $city = $parts[0];
                $state = $parts[1];
                $zipcode = $parts[2];
            }
        }

        $lat = null; $lng = null;
        if ($zipcode) {
            $zipData = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
            if ($zipData) {
                $lat = $zipData->lat;
                $lng = $zipData->lng;
                $city = $zipData->city;
                $state = $zipData->state_id;
            }
        }

        try {
            $rawPrice = $request->input('ticketPrice', '0');

            $event = Event::create([
                'event_name' => $details['Event Name'] ?? 'Untitled Event',
                'address' => $details['Address'] ?? '',
                'state_city_zipcode' => $locStr,
                'location_city' => $city,
                'location_state' => $state,
                'location_zipcode' => $zipcode,
                'latitude' => $lat,
                'longitude' => $lng,
                'from_date' => $eventDate,
                'language' => $details['Language Specific'] ?? 'English',
                'duration_hours' => $details['Duration'] ?? null,
                'min_age_limit' => $details['Age Limit'] ?? null,
                'organizer_name' => $details['Organizer Name'] ?? null,
                'organizer_contact' => $details['Organizer Contact'] ?? null,
                'timezone' => $details['Timezone'] ?? 'PST',
                'country' => $details['Country'] ?? 'USA',
                'rules_regulations' => $details['Terms and Conditions'] ?? null,
                'event_category' => $details['Event Category'] ?? [],
                'is_sold' => $details['Mark as Sold'] === 'YES',
                'tags' => isset($details['Tags']) ? array_map('trim', explode(',', $details['Tags'])) : [],
                'event_type' => $details['Event Type'] ?? 'General',
                'description' => $details['Description'] ?? '',
                'ticket_price' => $rawPrice,
                'cover_images' => $storedImages,
                'poster_images' => [],
                'user_type' => 'Owner',
                'user_id' => $request->user()->id,
                'user_name' => $request->user()->name ?? $request->user()->email,
                'status' => 'active',
            ]);

            return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
        } catch (\Exception $e) {
            \Log::error('Event creation failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create event: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        return response()->json($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        if ($request->has('status') && count($request->all()) == 1) {
            $event->status = $request->status;
            $event->save();
            return response()->json(['message' => 'Event status updated', 'event' => $event]);
        }

        $details = $request->input('details', []);
        $ticketPrice = $request->input('ticketPrice');
        $imgs = $request->input('imgs', []);
        $existingImgs = $request->input('existing_imgs', []);

        // Process new images
        $processedNew = [];
        $disk = env('FILESYSTEM_DISK', 'public');
        foreach ($imgs as $img) {
            if (is_string($img) && preg_match('/^data:image\/(\w+);base64,/', $img, $type)) {
                $data = substr($img, strpos($img, ',') + 1);
                $data = base64_decode($data);
                if ($data === false) continue;

                $extension = strtolower($type[1]);
                $filename = Str::random(20) . '.' . $extension;
                $path = 'events/' . $filename;
                
                \Illuminate\Support\Facades\Storage::disk($disk)->put($path, $data);
                $processedNew[] = $disk === 'public' ? 'storage/' . $path : \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
            }
        }

        // Combine with existing images
        $allImages = array_merge($existingImgs, $processedNew);

        // Date processing
        $eventDateStr = $details['Event Date and Time'] ?? $details['Event Date'] ?? null;
        $eventDate = $event->from_date;
        if ($eventDateStr) {
            try {
                if (str_contains($eventDateStr, ' at ')) {
                    $cleanedDate = str_replace(' at ', ' ', $eventDateStr);
                    $eventDate = \Carbon\Carbon::createFromFormat('d-m-Y g:i A', $cleanedDate);
                } else {
                    $eventDate = \Carbon\Carbon::parse($eventDateStr);
                }
            } catch (\Exception $e) {
                \Log::warning('Update Date parsing failed', ['date' => $eventDateStr]);
            }
        }

        // Sync coordinates
        $locStr = $details['State, City, Zipcode'] ?? $details['Location'] ?? $event->state_city_zipcode;
        $city = $event->location_city; $state = $event->location_state; $zipcode = $event->location_zipcode;
        $lat = $event->latitude; $lng = $event->longitude;

        if ($locStr !== $event->state_city_zipcode) {
            $parts = array_map('trim', explode(',', $locStr));
            if (count($parts) >= 3) {
                $city = $parts[0];
                $state = $parts[1];
                $zipcode = $parts[2];
                
                $zipData = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
                if ($zipData) {
                    $lat = $zipData->lat;
                    $lng = $zipData->lng;
                    $city = $zipData->city;
                    $state = $zipData->state_id;
                }
            }
        }

        $event->update([
            'event_name' => $details['Event Name'] ?? $event->event_name,
            'address' => $details['Address'] ?? $event->address,
            'state_city_zipcode' => $locStr,
            'location_city' => $city,
            'location_state' => $state,
            'location_zipcode' => $zipcode,
            'latitude' => $lat,
            'longitude' => $lng,
            'from_date' => $eventDate,
            'language' => $details['Language Specific'] ?? $event->language,
            'duration_hours' => $details['Duration'] ?? $event->duration_hours,
            'min_age_limit' => $details['Age Limit'] ?? $event->min_age_limit,
            'organizer_name' => $details['Organizer Name'] ?? $event->organizer_name,
            'organizer_contact' => $details['Organizer Contact'] ?? $event->organizer_contact,
            'timezone' => $details['Timezone'] ?? $event->timezone,
            'country' => $details['Country'] ?? $event->country,
            'rules_regulations' => $details['Terms and Conditions'] ?? $event->rules_regulations,
            'event_category' => $details['Event Category'] ?? $event->event_category,
            'is_sold' => isset($details['Mark as Sold']) ? ($details['Mark as Sold'] === 'YES') : $event->is_sold,
            'tags' => isset($details['Tags']) ? array_map('trim', explode(',', $details['Tags'])) : $event->tags,
            'event_type' => $details['Event Type'] ?? $event->event_type,
            'description' => $details['Description'] ?? $event->description,
            'ticket_price' => $ticketPrice ?? $event->ticket_price,
            'cover_images' => $allImages,
            'status' => $request->input('status', $event->status),
        ]);

        return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    /**
     * Search for events based on filters with radius support.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zipcode' => 'nullable|string|max:20',
            'priceMin' => 'nullable|numeric|min:0',
            'priceMax' => 'nullable|numeric|gte:priceMin',
            'eventType' => 'nullable|array',
            'eventType.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Event::query()->where('status', 'active');
        $city = trim($request->city);
        $state = trim($request->state);
        $zipcode = trim($request->zipcode);
        $radius = 70; // Miles

        $centerPoint = null;

        if ($zipcode) {
            $centerPoint = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
        } elseif ($city) {
            $centerPoint = \DB::table('usa_zipcodes')
                ->where('city', 'like', '%' . $city . '%')
                ->when($state, function ($q) use ($state) {
                    return $q->where('state_id', $state)->orWhere('state_name', $state);
                })
                ->first();
        }

        if ($centerPoint && $centerPoint->lat && $centerPoint->lng) {
            $lat = $centerPoint->lat;
            $lng = $centerPoint->lng;
            $searchZip = $centerPoint->zip;

            // Bounding box optimization to reduce rows before expensive distance calculation
            $latRange = $radius / 69;
            $lngRange = $radius / (69 * cos(deg2rad($lat)));

            $query->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                  ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);

            $query->select('*')
                ->selectRaw("(3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$lat, $lng, $lat])
                ->having('distance', '<=', $radius);
            
            $query->orderByRaw("CASE WHEN location_zipcode = ? THEN 0 ELSE 1 END ASC", [$searchZip])
                  ->orderBy('distance', 'asc');
        } else {
            if ($request->filled('city')) {
                $query->where('location_city', 'like', '%' . $request->city . '%');
            }
            if ($request->filled('state')) {
                $query->where('location_state', 'like', '%' . $request->state . '%');
            }
            if ($request->filled('zipcode')) {
                $query->where('location_zipcode', 'like', '%' . $request->zipcode . '%');
            }
        }

        if ($request->filled('priceMin')) {
            $query->where('ticket_price', '>=', $request->priceMin);
        }
        if ($request->filled('priceMax')) {
            $query->where('ticket_price', '<=', $request->priceMax);
        }

        if ($request->filled('eventType') && is_array($request->eventType) && count($request->eventType) > 0) {
            $query->whereIn('event_type', $request->eventType);
        }

        $perPage = 100;
        $events = $query->paginate($perPage);

        $events->getCollection()->transform(function($event) {
            $dateTime = new \DateTime($event->from_date);
            return [
                'id' => $event->id,
                'title' => $event->event_name,
                'location' => $event->state_city_zipcode,
                'location_city' => $event->location_city,
                'location_state' => $event->location_state,
                'location_zipcode' => $event->location_zipcode,
                'date' => $dateTime->format('Y-m-d\TH:i:s'),
                'image' => !empty($event->cover_images) && is_array($event->cover_images) && count($event->cover_images) > 0 
                    ? $event->cover_images[0]
                    : '/img/events/eventSmpl1.png',
                'ticketPrice' => is_numeric($event->ticket_price) 
                    ? '$' . number_format($event->ticket_price, 0) 
                    : $event->ticket_price,
            ];
        });

        return response()->json($events);
    }

    /**
     * Insert dummy data
     */
    public function dummyInsert()
    {
        $faker = Faker::create();
        
        for ($i = 0; $i < 5; $i++) {
            Event::create([
                'event_name' => $faker->catchPhrase . ' Concert',
                'address' => $faker->streetAddress,
                'state_city_zipcode' => $faker->city . ', ' . $faker->stateAbbr . ' ' . $faker->postcode,
                'from_date' => $faker->dateTimeBetween('now', '+3 months'),
                'language' => $faker->randomElement(['English', 'Hindi', 'Spanish']),
                'event_type' => $faker->randomElement(['Music', 'Comedy', 'Workshop']),
                'description' => $faker->paragraph,
                'ticket_price' => $faker->randomFloat(2, 10, 200),
                'cover_images' => [],
                'poster_images' => [],
                'user_id' => 1,
                'user_name' => $faker->name
            ]);
        }

        return response()->json(['message' => 'Dummy events inserted']);
    }

    public function getMyAdCount(Request $request)
    {
        $count = Event::where('user_id', $request->user()->id)->count();
        return response()->json(['count' => $count]);
    }

    public function getMyListings(Request $request)
    {
        $listings = Event::where('user_id', $request->user()->id)->get();
        return response()->json($listings);
    }
}
