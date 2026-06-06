<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class KidsClassController extends Controller
{
    /**
     * Handle Instructor UI Form Submission (Phase 4)
     */
    public function store(Request $request)
    {
        $payload = $request->all();
        $now = Carbon::now();
        $instructorData = $payload['instructorInfo'] ?? [];
        $slug = $instructorData['slug'] ?? null;

        if ($slug) {
            if (strlen($slug) > 30) {
                return response()->json(['success' => false, 'message' => 'Slug cannot exceed 30 characters.'], 422);
            }
            if (!preg_match('/^[a-z0-9\-]+$/i', $slug)) {
                return response()->json(['success' => false, 'message' => 'Slug can only contain letters, numbers, and hyphens.'], 422);
            }
            
            // Basic offensive words check
            $offensive = ['porn', 'sex', 'gambling', 'nude', 'viagra', 'casino', 'fuck', 'shit', 'asshole'];
            foreach ($offensive as $word) {
                if (stripos($slug, $word) !== false) {
                    return response()->json(['success' => false, 'message' => 'Slug contains inappropriate content.'], 422);
                }
            }

            // Uniqueness check
            $currentInstructorId = $payload['instructorId'] !== 'new' ? $payload['instructorId'] : null;
            $exists = DB::table('instructors')->where('slug', $slug)
                ->when($currentInstructorId, function($q) use ($currentInstructorId) {
                    return $q->where('id', '!=', $currentInstructorId);
                })
                ->exists();
            if ($exists) {
                return response()->json(['success' => false, 'message' => 'This slug URL is already taken.'], 422);
            }
        }

        DB::beginTransaction();
        try {
            // --- 1. INSTRUCTOR ---
            $instructorData = $payload['instructorInfo'] ?? [];
            $instructorEmail = $instructorData['email'] ?? null;
            $instructorId = $payload['instructorId'] !== 'new' ? $payload['instructorId'] : null;

            // If it's a new or unknown instructor ID, try to find by email first to avoid duplicates
            if (!$instructorId && $instructorEmail) {
                $existing = DB::table('instructors')->where('email', $instructorEmail)->first();
                if ($existing) {
                    $instructorId = $existing->id;
                }
            }

            // Still no ID? Generate one
            if (!$instructorId) {
                $instructorId = Str::orderedUuid()->toString();
            }
            
            DB::table('instructors')->updateOrInsert(
                ['id' => $instructorId],
                [
                    'account_type' => $instructorData['accountType'] ?? 'individual',
                    'name' => $instructorData['name'] ?? 'Unknown',
                    'slug' => $slug,
                    'email' => $instructorEmail,
                    'phone' => $instructorData['phone'] ?? null,
                    'bio' => $instructorData['bio'] ?? null,
                    'years_experience' => $instructorData['yearsExperience'] ?? null,
                    'zipcode' => $instructorData['zipcode'] ?? null,
                    'address' => $instructorData['address'] ?? null,
                    'profile_photo_url' => (isset($instructorData['photoUrl']) && !str_starts_with($instructorData['photoUrl'], 'blob:')) ? $instructorData['photoUrl'] : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            // --- 2. KIDS CLASS ---
            $classBasic = $payload['classBasic'] ?? [];
            $classId = Str::orderedUuid()->toString();

            DB::table('kids_classes')->insert([
                'id' => $classId,
                'user_id' => $request->user() ? $request->user()->id : null,
                'instructor_id' => $instructorId,
                'title' => $classBasic['title'] ?? 'Untitled Class',
                'category' => !empty($classBasic['category']) ? $classBasic['category'] : 'Uncategorized',
                'subcategory' => !empty($classBasic['subcategory']) ? $classBasic['subcategory'] : 'General',
                'level' => json_encode($classBasic['level'] ?? []),
                'format' => json_encode($classBasic['format'] ?? []),
                'short_description' => $classBasic['shortDescription'] ?? null,
                'thumbnail_url' => null,
                'tags' => json_encode($classBasic['tags'] ?? []),
                'age_group_min' => 5, // Default for now
                'age_group_max' => 17, // Default for now
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 3. SCHEDULE ---
            $schedule = $payload['schedule'] ?? [];
            DB::table('class_schedules')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'duration_label' => $schedule['duration'] ?? null,
                'total_sessions' => $schedule['totalSessions'] ?? null,
                'session_length_minutes' => (int)($schedule['sessionLength'] ?? 0) ?: null,
                'days_of_week' => json_encode($schedule['daysOfWeek'] ?? []),
                'time_start' => !empty($schedule['timeStart']) ? $schedule['timeStart'] : null,
                'time_end' => !empty($schedule['timeEnd']) ? $schedule['timeEnd'] : null,
                'batch_start_date' => !empty($schedule['startDate']) ? $schedule['startDate'] : null,
                'location_address' => $schedule['location'] ?? null,
                'online_platform' => $schedule['platform'] ?? null,
                'online_link' => null,
                'max_students' => $schedule['maxStudents'] ?? null,
                'trial_available' => $schedule['trialAvailable'] ?? false,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 4. OVERVIEW ---
            $about = $payload['about'] ?? [];
            $overview = $about['overview'] ?? [];
            DB::table('class_overview')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'detailed_description' => $overview['detailedDescription'] ?? null,
                'who_is_it_for' => json_encode($overview['whoIsItFor'] ?? []),
                'what_will_kids_learn' => json_encode($overview['whatWillKidsLearn'] ?? []),
                'highlights' => json_encode($overview['highlights'] ?? []),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 5. CURRICULUM MODULES ---
            $curriculum = $about['curriculum'] ?? [];
            foreach ($curriculum as $idx => $mod) {
                DB::table('class_modules')->insert([
                    'id' => Str::orderedUuid()->toString(),
                    'class_id' => $classId,
                    'sort_order' => $idx + 1,
                    'title' => $mod['title'] ?? 'Untitled',
                    'description' => $mod['description'] ?? null,
                    'estimated_duration' => $mod['duration'] ?? null,
                    'topics' => json_encode([]),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            // --- 6. REQUIREMENTS ---
            $reqs = $about['requirements'] ?? [];
            DB::table('class_requirements')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'prerequisites' => json_encode($reqs['prerequisites'] ?? []),
                'materials_needed' => json_encode($reqs['materialsNeeded'] ?? []),
                'tech_requirements' => json_encode($reqs['techRequirements'] ?? []),
                'parental_involvement' => !empty($reqs['parentalInvolvement']) && in_array($reqs['parentalInvolvement'], ['none', 'occasional', 'required']) ? $reqs['parentalInvolvement'] : null,
                'parental_involvement_notes' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 7. PRICING ---
            $pricing = $payload['pricing'] ?? [];
            DB::table('class_pricing')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'fee_amount' => $pricing['feeAmount'] ?? 0,
                'fee_currency' => 'INR',
                'fee_type' => !empty($pricing['feeType']) ? $pricing['feeType'] : 'per_month',
                'discount_label' => $pricing['discountLabel'] ?? null,
                'certificate_provided' => $pricing['certificateProvided'] ?? false,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Listing successfully submitted and is under review.',
                'classId' => $classId
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error saving listing: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin Dashboard: Fetch all classes (pending, active, rejected, etc)
     */
    public function getAdminListings(Request $request)
    {
        $query = DB::table('kids_classes')
            ->join('instructors', 'kids_classes.instructor_id', '=', 'instructors.id');

        // Admin search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kids_classes.title', 'like', "%{$search}%")
                  ->orWhere('instructors.name', 'like', "%{$search}%")
                  ->orWhere('kids_classes.category', 'like', "%{$search}%")
                  ->orWhere('kids_classes.subcategory', 'like', "%{$search}%");
            });
        }

        $classes = $query->select(
                'kids_classes.id',
                'kids_classes.title',
                'kids_classes.category',
                'kids_classes.subcategory',
                'kids_classes.status',
                'kids_classes.created_at',
                'instructors.name as instructorName',
                'instructors.profile_photo_url as photoUrl'
            )
            ->orderByRaw("FIELD(kids_classes.status, 'pending_review', 'active', 'rejected', 'draft', 'expired')")
            ->orderBy('kids_classes.created_at', 'desc')
            ->get();

        // Format for frontend
        $mapped = $classes->map(function ($c) {
            if ($c->photoUrl && !str_starts_with($c->photoUrl, 'http')) {
                $c->photoUrl = $c->photoUrl; // Keep as relative path
            }
            return [
                'id' => $c->id,
                'title' => $c->title,
                'instructorName' => $c->instructorName,
                'category' => $c->category,
                'subcategory' => $c->subcategory,
                'status' => $c->status,
                'submittedAt' => \Carbon\Carbon::parse($c->created_at)->diffForHumans(),
                'submittedAtFull' => \Carbon\Carbon::parse($c->created_at)->format('d M Y, h:i A'),
                'photoUrl' => $c->photoUrl,
            ];
        });

        return response()->json(['success' => true, 'data' => $mapped]);
    }

    /**
     * Admin Action: Approve
     */
    public function approve($id)
    {
        DB::table('kids_classes')->where('id', $id)->update([
            'status' => 'active',
            'updated_at' => Carbon::now()
        ]);
        return response()->json(['success' => true]);
    }

    /**
     * Admin Action: Reject
     */
    public function reject(Request $request, $id)
    {
        DB::table('kids_classes')->where('id', $id)->update([
            'status' => 'rejected',
            'updated_at' => Carbon::now()
        ]);
        // Here we could fire an email event with $request->input('reason')
        return response()->json(['success' => true]);
    }

    /**
     * Public API: Fetch all active classes for landing page
     */
    public function getPublicListings(Request $request)
    {
        $limit = $request->input('limit', 12);
        
        $classes = DB::table('kids_classes')
            ->join('instructors', 'kids_classes.instructor_id', '=', 'instructors.id')
            ->leftJoin('class_pricing', 'kids_classes.id', '=', 'class_pricing.class_id')
            ->leftJoin('class_schedules', 'kids_classes.id', '=', 'class_schedules.class_id')
            ->where('kids_classes.status', 'active')
            ->select(
                'kids_classes.id',
                'kids_classes.title',
                'kids_classes.category',
                'kids_classes.subcategory',
                'kids_classes.level',
                'kids_classes.format',
                'kids_classes.short_description',
                'kids_classes.age_group_min',
                'kids_classes.age_group_max',
                'instructors.name as instructorName',
                'instructors.profile_photo_url as photoUrl',
                'class_pricing.fee_amount',
                'class_pricing.fee_type',
                'class_schedules.duration_label',
                'class_schedules.location_address'
            )
            ->inRandomOrder()
            ->limit($limit)
            ->get();

        $mapped = $classes->map(function ($c) {
            $c->level = json_decode($c->level) ?? [];
            $c->format = json_decode($c->format) ?? [];
            if ($c->photoUrl && !str_starts_with($c->photoUrl, 'http')) {
                $c->photoUrl = $c->photoUrl;
            }
            return $c;
        });

        return response()->json(['success' => true, 'data' => $mapped]);
    }

    /**
     * Public API: Fetch active classes by subcategory
     */
    public function getPublicByCategory(Request $request, $category, $subcategory)
    {
        $classes = DB::table('kids_classes')
            ->join('instructors', 'kids_classes.instructor_id', '=', 'instructors.id')
            ->leftJoin('class_pricing', 'kids_classes.id', '=', 'class_pricing.class_id')
            ->leftJoin('class_schedules', 'kids_classes.id', '=', 'class_schedules.class_id')
            ->where('kids_classes.status', 'active')
            ->select(
                'kids_classes.id',
                'kids_classes.title',
                'kids_classes.category',
                'kids_classes.subcategory',
                'kids_classes.level',
                'kids_classes.format',
                'kids_classes.short_description',
                'kids_classes.age_group_min',
                'kids_classes.age_group_max',
                'instructors.name as instructorName',
                'instructors.profile_photo_url as photoUrl',
                'class_pricing.fee_amount',
                'class_pricing.fee_type',
                'class_schedules.duration_label',
                'class_schedules.days_of_week'
            )
            ->get();
            
        // Filter in PHP since cases might not perfectly match
        $filtered = $classes->filter(function ($c) use ($category, $subcategory) {
            return Str::slug($c->category) === $category
                && Str::slug($c->subcategory) === $subcategory;
        });

        $mapped = $filtered->map(function ($c) {
            $c->level = json_decode($c->level) ?? [];
            $c->format = json_decode($c->format) ?? [];
            $c->days_of_week = json_decode($c->days_of_week) ?? [];
            if ($c->photoUrl && !str_starts_with($c->photoUrl, 'http')) {
                $c->photoUrl = $c->photoUrl; // Keep as relative
            }
            return $c;
        })->values();

        return response()->json(['success' => true, 'data' => $mapped]);
    }
    
    /**
     * Public API: Fetch full class details
     */
    public function getPublicDetails($id)
    {
        $classBasic = DB::table('kids_classes')->where('id', $id)->where('status', 'active')->first();
        if(!$classBasic) return response()->json(['success'=>false, 'message'=>'Class not found or inactive'], 404);
        
        $instructor = DB::table('instructors')->where('id', $classBasic->instructor_id)->first();
        $schedule = DB::table('class_schedules')->where('class_id', $id)->first();
        $about = DB::table('class_overview')->where('class_id', $id)->first();
        $pricing = DB::table('class_pricing')->where('class_id', $id)->first();
        $reqs = DB::table('class_requirements')->where('class_id', $id)->first();
        $modules = DB::table('class_modules')->where('class_id', $id)->orderBy('sort_order')->get();
        
        // Decode JSONs
        if($classBasic) { $classBasic->level = json_decode($classBasic->level)?:[]; $classBasic->format = json_decode($classBasic->format)?:[]; $classBasic->tags = json_decode($classBasic->tags)?:[]; }
        if($schedule) { $schedule->days_of_week = json_decode($schedule->days_of_week)?:[]; }
        if($about) { $about->who_is_it_for = json_decode($about->who_is_it_for)?:[]; $about->what_will_kids_learn = json_decode($about->what_will_kids_learn)?:[]; $about->highlights = json_decode($about->highlights)?:[]; }
        if($reqs) { $reqs->prerequisites = json_decode($reqs->prerequisites)?:[]; $reqs->materials_needed = json_decode($reqs->materials_needed)?:[]; $reqs->tech_requirements = json_decode($reqs->tech_requirements)?:[]; }

        if($instructor && $instructor->profile_photo_url && !str_starts_with($instructor->profile_photo_url, 'http')) {
            $instructor->profile_photo_url = $instructor->profile_photo_url; // Keep as relative
        }

        return response()->json([
            'success' => true,
            'data' => compact('classBasic', 'instructor', 'schedule', 'about', 'pricing', 'reqs', 'modules')
        ]);
    }

    /**
     * Admin API: Fetch full class details regardless of status
     */
    public function getAdminDetails($id)
    {
        $classBasic = DB::table('kids_classes')->where('id', $id)->first();
        if(!$classBasic) return response()->json(['success'=>false, 'message'=>'Class not found'], 404);
        
        $instructor = DB::table('instructors')->where('id', $classBasic->instructor_id)->first();
        $schedule = DB::table('class_schedules')->where('class_id', $id)->first();
        $about = DB::table('class_overview')->where('class_id', $id)->first();
        $pricing = DB::table('class_pricing')->where('class_id', $id)->first();
        $reqs = DB::table('class_requirements')->where('class_id', $id)->first();
        $modules = DB::table('class_modules')->where('class_id', $id)->orderBy('sort_order')->get();
        
        // Decode JSONs
        if($classBasic) { $classBasic->level = json_decode($classBasic->level)?:[]; $classBasic->format = json_decode($classBasic->format)?:[]; $classBasic->tags = json_decode($classBasic->tags)?:[]; }
        if($schedule) { $schedule->days_of_week = json_decode($schedule->days_of_week)?:[]; }
        if($about) { $about->who_is_it_for = json_decode($about->who_is_it_for)?:[]; $about->what_will_kids_learn = json_decode($about->what_will_kids_learn)?:[]; $about->highlights = json_decode($about->highlights)?:[]; }
        if($reqs) { $reqs->prerequisites = json_decode($reqs->prerequisites)?:[]; $reqs->materials_needed = json_decode($reqs->materials_needed)?:[]; $reqs->tech_requirements = json_decode($reqs->tech_requirements)?:[]; }
        if ($instructor && $instructor->profile_photo_url && !str_starts_with($instructor->profile_photo_url, 'http')) {
            $instructor->profile_photo_url = $instructor->profile_photo_url; // Keep as relative
        }

        return response()->json([
            'success' => true,
            'data' => compact('classBasic', 'instructor', 'schedule', 'about', 'pricing', 'reqs', 'modules')
        ]);
    }

    /**
     * PUT API: Update an existing class comprehensively
     */
    public function update(Request $request, $id)
    {
        $payload = $request->json()->all();
        $instructorData = $payload['instructorInfo'] ?? [];
        $classBasic = $payload['classBasic'] ?? [];
        
        // 1. Check if class exists
        $existingClass = DB::table('kids_classes')->where('id', $id)->first();
        if (!$existingClass) {
            return response()->json(['success' => false, 'message' => 'Class not found'], 404);
        }
        
        $instructorId = $existingClass->instructor_id;
        
        DB::beginTransaction();
        try {
            // Update Instructor (only if data provided)
            if (!empty($instructorData)) {
                $slug = $instructorData['slug'] ?? null;
                if ($slug) {
                    // Re-validate slug on update
                    if (strlen($slug) > 30 || !preg_match('/^[a-z0-9\-]+$/i', $slug)) {
                        return response()->json(['success' => false, 'message' => 'Invalid slug format.'], 422);
                    }
                    $exists = DB::table('instructors')->where('slug', $slug)->where('id', '!=', $instructorId)->exists();
                    if ($exists) {
                        return response()->json(['success' => false, 'message' => 'Slug already taken.'], 422);
                    }
                }

                DB::table('instructors')->where('id', $instructorId)->update([
                    'account_type' => $instructorData['accountType'] ?? 'individual',
                    'name' => $instructorData['name'] ?? 'Unknown',
                    'slug' => $slug,
                    'email' => $instructorData['email'] ?? null,
                    'phone' => $instructorData['phone'] ?? null,
                    'bio' => $instructorData['bio'] ?? null,
                    'years_experience' => $instructorData['yearsExperience'] ?? null,
                    'zipcode' => $instructorData['zipcode'] ?? null,
                    'address' => $instructorData['address'] ?? null,
                    'profile_photo_url' => (isset($instructorData['photoUrl']) && !str_starts_with($instructorData['photoUrl'], 'blob:')) ? $instructorData['photoUrl'] : null,
                    'updated_at' => now(),
                ]);
            }

            // Update Class Basic
            $updateData = [];
            if (isset($classBasic['title'])) $updateData['title'] = $classBasic['title'];
            if (isset($classBasic['category'])) $updateData['category'] = $classBasic['category'];
            if (isset($classBasic['subcategory'])) $updateData['subcategory'] = $classBasic['subcategory'];
            if (isset($classBasic['level'])) $updateData['level'] = json_encode($classBasic['level']);
            if (isset($classBasic['format'])) $updateData['format'] = json_encode($classBasic['format']);
            if (isset($classBasic['shortDescription'])) $updateData['short_description'] = $classBasic['shortDescription'];
            if (isset($classBasic['tags'])) $updateData['tags'] = json_encode($classBasic['tags']);
            
            // Special case for status toggle from MyListings
            if (isset($payload['data']['status'])) $updateData['status'] = $payload['data']['status'];
            
            if (!empty($updateData)) {
                $updateData['updated_at'] = now();
                DB::table('kids_classes')->where('id', $id)->update($updateData);
            }

            // For related tables, the easiest/safest approach for deeply nested arrays is often delete-and-recreate,
            // or simply update if they are 1-to-1 relationships.
            
            // Schedule (1 to 1)
            $schedule = $payload['schedule'] ?? [];
            DB::table('class_schedules')->where('class_id', $id)->update([
                'duration_label' => $schedule['duration'] ?? null,
                'total_sessions' => $schedule['totalSessions'] ?? null,
                'session_length_minutes' => (int)($schedule['sessionLength'] ?? 0) ?: null,
                'days_of_week' => json_encode($schedule['daysOfWeek'] ?? []),
                'time_start' => !empty($schedule['timeStart']) ? $schedule['timeStart'] : null,
                'time_end' => !empty($schedule['timeEnd']) ? $schedule['timeEnd'] : null,
                'batch_start_date' => !empty($schedule['startDate']) ? $schedule['startDate'] : null,
                'location_address' => $schedule['location'] ?? null,
                'online_platform' => $schedule['platform'] ?? null,
                'max_students' => $schedule['maxStudents'] ?? null,
                'trial_available' => $schedule['trialAvailable'] ?? false,
                'updated_at' => now(),
            ]);

            $about = $payload['about'] ?? [];
            $overview = $about['overview'] ?? [];
            
            // Overview (1 to 1)
            DB::table('class_overview')->where('class_id', $id)->update([
                'detailed_description' => $overview['detailedDescription'] ?? null,
                'who_is_it_for' => json_encode($overview['whoIsItFor'] ?? []),
                'what_will_kids_learn' => json_encode($overview['whatWillKidsLearn'] ?? []),
                'highlights' => json_encode($overview['highlights'] ?? []),
                'updated_at' => now(),
            ]);

            // Modules (1 to Many) - Safe to delete and recreate
            DB::table('class_modules')->where('class_id', $id)->delete();
            $curriculum = $about['curriculum'] ?? [];
            foreach ($curriculum as $idx => $mod) {
                DB::table('class_modules')->insert([
                    'id' => Str::orderedUuid()->toString(),
                    'class_id' => $id,
                    'sort_order' => $idx + 1,
                    'title' => $mod['title'] ?? 'Untitled',
                    'description' => $mod['description'] ?? null,
                    'estimated_duration' => $mod['duration'] ?? null,
                    'topics' => json_encode([]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Requirements (1 to 1)
            $reqs = $about['requirements'] ?? [];
            DB::table('class_requirements')->where('class_id', $id)->update([
                'prerequisites' => json_encode($reqs['prerequisites'] ?? []),
                'materials_needed' => json_encode($reqs['materialsNeeded'] ?? []),
                'tech_requirements' => json_encode($reqs['techRequirements'] ?? []),
                'parental_involvement' => !empty($reqs['parentalInvolvement']) && in_array($reqs['parentalInvolvement'], ['none', 'occasional', 'required']) ? $reqs['parentalInvolvement'] : null,
                'updated_at' => now(),
            ]);

            // Pricing (1 to 1)
            $pricing = $payload['pricing'] ?? [];
            DB::table('class_pricing')->where('class_id', $id)->update([
                'fee_amount' => $pricing['feeAmount'] ?? 0,
                'fee_type' => !empty($pricing['feeType']) ? $pricing['feeType'] : 'per_month',
                'discount_label' => $pricing['discountLabel'] ?? null,
                'certificate_provided' => $pricing['certificateProvided'] ?? false,
                'updated_at' => now(),
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Listing updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
        }
    }

    public function dummyInsert()
    {
        $now = Carbon::now();
        $inserted = [];
        $categories = [
            'Art' => ['Painting', 'Sketching', 'Pottery'],
            'Music' => ['Keyboard', 'Vocal', 'Guitar'],
            'Education' => ['Math', 'English', 'Science'],
            'Sports' => ['Yoga', 'Karate', 'Dance']
        ];

        $cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

        for ($i = 0; $i < 10; $i++) {
            $instructorId = Str::orderedUuid()->toString();
            $classId = Str::orderedUuid()->toString();
            $cat = array_rand($categories);
            $subcat = $categories[$cat][array_rand($categories[$cat])];

            // 1. Instructor
            DB::table('instructors')->insert([
                'id' => $instructorId,
                'name' => "Instructor " . ($i + 1),
                'email' => "instructor{$i}@example.com",
                'account_type' => 'individual',
                'created_at' => $now, 'updated_at' => $now
            ]);

            // 2. Class
            DB::table('kids_classes')->insert([
                'id' => $classId,
                'instructor_id' => $instructorId,
                'title' => "{$subcat} for Beginners",
                'category' => $cat,
                'subcategory' => $subcat,
                'status' => 'active',
                'created_at' => $now, 'updated_at' => $now
            ]);

            // 3. Schedule
            DB::table('class_schedules')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'location_address' => $cities[$i % 5],
                'days_of_week' => json_encode(['Mon', 'Wed']),
                'created_at' => $now, 'updated_at' => $now
            ]);

            // 4. Pricing
            DB::table('class_pricing')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'fee_amount' => rand(500, 2000),
                'fee_type' => 'per_month',
                'created_at' => $now, 'updated_at' => $now
            ]);

            $inserted[] = $classId;
        }

        return response()->json(['success' => true, 'message' => '10 Kids Classes added', 'data' => $inserted]);
    }

    public function getMyAdCount(Request $request)
    {
        $count = DB::table('kids_classes')
            ->where('user_id', $request->user()->id)
            ->count();
        return response()->json(['count' => $count]);
    }

    public function getMyListings(Request $request)
    {
        $listings = DB::table('kids_classes')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($listings);
    }

    public function destroy($id)
    {
        DB::table('kids_classes')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Listing deleted successfully']);
    }

    /**
     * Get unique keywords for search autocomplete
     */
    public function getKeywords()
    {
        $subcategories = DB::table('kids_classes')->where('status', 'active')->pluck('subcategory')->unique()->toArray();

        $keywords = array_values(array_unique($subcategories));

        return response()->json(['success' => true, 'data' => $keywords]);
    }

    /**
     * Search classes by title, category, or subcategory
     */
    public function search(Request $request)
    {
        $term = $request->input('q');
        
        $query = DB::table('kids_classes')
            ->join('instructors', 'kids_classes.instructor_id', '=', 'instructors.id')
            ->leftJoin('class_pricing', 'kids_classes.id', '=', 'class_pricing.class_id')
            ->leftJoin('class_schedules', 'kids_classes.id', '=', 'class_schedules.class_id')
            ->where('kids_classes.status', 'active');

        if ($term) {
            $query->where(function($q) use ($term) {
                $q->where('kids_classes.title', 'like', "%{$term}%")
                  ->orWhere('kids_classes.category', 'like', "%{$term}%")
                  ->orWhere('kids_classes.subcategory', 'like', "%{$term}%")
                  ->orWhere('kids_classes.tags', 'like', "%{$term}%");
            });
        }

        $classes = $query->select(
            'kids_classes.id',
            'kids_classes.title',
            'kids_classes.category',
            'kids_classes.subcategory',
            'kids_classes.level',
            'kids_classes.format',
            'kids_classes.short_description',
            'kids_classes.age_group_min',
            'kids_classes.age_group_max',
            'instructors.name as instructorName',
            'instructors.profile_photo_url as photoUrl',
            'class_pricing.fee_amount',
            'class_pricing.fee_type',
            'class_schedules.duration_label',
            'class_schedules.location_address'
        )->get();

        $mapped = $classes->map(function ($c) {
            $c->level = json_decode($c->level) ?? [];
            $c->format = json_decode($c->format) ?? [];
            return $c;
        });

        return response()->json(['success' => true, 'data' => $mapped]);
    }

    public function getBySlug($slug)
    {
        $instructor = DB::table('instructors')->where('slug', $slug)->first();
        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Instructor not found'], 404);
        }

        $classes = DB::table('kids_classes')
            ->leftJoin('class_pricing', 'kids_classes.id', '=', 'class_pricing.class_id')
            ->leftJoin('class_schedules', 'kids_classes.id', '=', 'class_schedules.class_id')
            ->where('kids_classes.instructor_id', $instructor->id)
            ->where('kids_classes.status', 'active')
            ->select(
                'kids_classes.*',
                'class_pricing.fee_amount',
                'class_pricing.fee_type',
                'class_schedules.duration_label'
            )
            ->get();

        foreach ($classes as $c) {
            $c->level = json_decode($c->level) ?: [];
            $c->format = json_decode($c->format) ?: [];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'instructor' => $instructor,
                'classes' => $classes
            ]
        ]);
    }
}
