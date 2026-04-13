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
            
            $directory = storage_path('app/public/events');
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            foreach ($images as $img) {
                if (is_string($img) && preg_match('/^data:image\/(\w+);base64,/', $img, $type)) {
                    $data = substr($img, strpos($img, ',') + 1);
                    $data = base64_decode($data);
                    
                    if ($data === false) continue;

                    $extension = strtolower($type[1]);
                    $filename = Str::random(20) . '.' . $extension;
                    $path = $directory . '/' . $filename;
                    
                    file_put_contents($path, $data);
                    $processed[] = 'storage/events/' . $filename;
                }
            }
            return $processed;
        };

        // In the current frontend 'imgs' contains all images. 
        // We can split them if the frontend distinguishes, but currently it sends them combined or just 'imgs'.
        // For now, let's treat the first ones as cover and rest as poster if multiple, or just dump all in cover.
        \Log::info('Images received:', [
            'count' => count($imgs), 
            'sample' => isset($imgs[0]) ? (is_string($imgs[0]) ? substr($imgs[0], 0, 50) : 'array/object') : 'none'
        ]);
        $storedImages = $processImages($imgs);
        \Log::info('Images stored:', ['paths' => $storedImages]);

        // Parse the date with error handling
        $eventDate = now();
        if (isset($details['Event Date'])) {
            try {
                // Try DD-MM-YYYY format first
                $eventDate = \Carbon\Carbon::createFromFormat('d-m-Y', $details['Event Date']);
            } catch (\Exception $e) {
                \Log::warning('Date parsing failed, using current date', ['date' => $details['Event Date'], 'error' => $e->getMessage()]);
            }
        }

        try {
            $event = Event::create([
                'event_name' => $details['Event Name'] ?? 'Untitled Event',
                'address' => $details['Address'] ?? '',
                'state_city_zipcode' => $details['State, City, Zipcode'] ?? '',
                'from_date' => $eventDate,
                'language' => $details['Language Specific'] ?? 'English',
                'event_type' => $details['Event Type'] ?? 'General',
                'description' => $details['Description'] ?? '',
                'ticket_price' => $request->input('ticketPrice', 0),
                'cover_images' => $storedImages,
                'poster_images' => [],
                'user_type' => 'Owner',
                'user_id' => 1,
                'user_name' => 'Test User' 
            ]);

            return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
        } catch (\Exception $e) {
            \Log::error('Event creation failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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
}
