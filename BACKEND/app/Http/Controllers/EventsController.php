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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::orderBy('created_at', 'desc')->get();
        
        // Transform to match frontend expectations
        $transformedEvents = $events->map(function($event) {
            // Parse datetime to extract time
            $dateTime = new \DateTime($event->from_date);
            
            return [
                'id' => $event->id,
                'title' => $event->event_name,
                'location' => $event->state_city_zipcode,
                'date' => $dateTime->format('Y-m-d\TH:i:s'), // ISO format with time
                'image' => !empty($event->cover_images) && is_array($event->cover_images) && count($event->cover_images) > 0 
                    ? url($event->cover_images[0])
                    : '/img/events/eventSmpl1.png',
                'ticketPrice' => '$' . number_format($event->ticket_price, 0),
            ];
        });
        
        return response()->json(['events' => $transformedEvents]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'details' => 'required|array',
            'ticketPrice' => 'required',
            // 'imgs' validation can be added here
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // The frontend sends data in a specific structure:
        // { ticketPrice, imgs: [], details: { 'Event Name': ..., 'Address': ... } }
        // We need to map this to our DB columns.

        $details = $request->input('details');
        $imgs = $request->input('imgs', []);
        
        // Helper to extract base64 images
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
                    
                    // Generate the URL based on the disk
                    $processed[] = $disk === 'public' ? 'storage/' . $path : \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
                }
            }
            return $processed;
        };

        $storedImages = $processImages($imgs);

        // Parse the date with better key matching
        $eventDateStr = $details['Event Date and Time'] ?? $details['Event Date'] ?? null;
        $eventDate = now();
        if ($eventDateStr) {
            try {
                // If it contains "at", extract just the part before "at" or handle the format
                // Expected format from frontend: "DD-MM-YYYY [at] h:mm A"
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

        try {
            // Clean ticket price (remove formatting like $, and cast to float)
            $rawPrice = $request->input('ticketPrice', 0);
            $cleanPrice = (float) preg_replace('/[^0-9.]/', '', $rawPrice);

            $event = Event::create([
                'event_name' => $details['Event Name'] ?? 'Untitled Event',
                'address' => $details['Address'] ?? '',
                'state_city_zipcode' => $details['State, City, Zipcode'] ?? $details['Location'] ?? '',
                'from_date' => $eventDate,
                'language' => $details['Language Specific'] ?? 'English',
                'event_type' => $details['Event Type'] ?? 'General',
                'description' => $details['Description'] ?? '',
                'ticket_price' => $cleanPrice,
                'cover_images' => $storedImages,
                'poster_images' => [],
                'user_type' => 'Owner',
                'user_id' => 1,
                'user_name' => 'Test User' 
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
        
        $event->update($request->all());
        return response()->json(['message' => 'Event updated', 'event' => $event]);
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
     * Search for events based on filters
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

        $query = Event::query();

        if ($request->filled('city') || $request->filled('state') || $request->filled('zipcode')) {
            $query->where(function ($q) use ($request) {
                if ($request->filled('city')) {
                    $q->orWhere('state_city_zipcode', 'like', '%' . $request->city . '%');
                }
                if ($request->filled('state')) {
                    $q->orWhere('state_city_zipcode', 'like', '%' . $request->state . '%');
                }
                if ($request->filled('zipcode')) {
                    $q->orWhere('state_city_zipcode', 'like', '%' . $request->zipcode . '%');
                }
            });
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

        $query->orderBy('created_at', 'desc');

        $perPage = 10;
        $events = $query->paginate($perPage);

        // Transform collection to match index() structure
        $events->getCollection()->transform(function($event) {
            $dateTime = new \DateTime($event->from_date);
            return [
                'id' => $event->id,
                'title' => $event->event_name,
                'location' => $event->state_city_zipcode,
                'date' => $dateTime->format('Y-m-d\TH:i:s'),
                'image' => !empty($event->cover_images) && is_array($event->cover_images) && count($event->cover_images) > 0 
                    ? url($event->cover_images[0])
                    : '/img/events/eventSmpl1.png',
                'ticketPrice' => '$' . number_format($event->ticket_price, 0),
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
