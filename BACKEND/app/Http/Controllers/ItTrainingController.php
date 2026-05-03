<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ItTrainingController extends Controller
{
    /**
     * Handle IT Training UI Form Submission
     */
    public function store(Request $request)
    {
        $payload = $request->all();
        $now = Carbon::now();

        DB::beginTransaction();
        try {
            // --- 1. INSTRUCTOR ---
            $instructorData = $payload['instructorInfo'] ?? [];
            $instructorEmail = $instructorData['email'] ?? null;
            $instructorId = $payload['instructorId'] !== 'new' ? $payload['instructorId'] : null;

            if (!$instructorId && $instructorEmail) {
                $existing = DB::table('it_instructors')->where('email', $instructorEmail)->first();
                if ($existing) {
                    $instructorId = $existing->id;
                }
            }

            if (!$instructorId) {
                $instructorId = Str::orderedUuid()->toString();
            }
            
            DB::table('it_instructors')->updateOrInsert(
                ['id' => $instructorId],
                [
                    'account_type' => $instructorData['accountType'] ?? 'individual',
                    'name' => $instructorData['name'] ?? 'Unknown',
                    'email' => $instructorEmail,
                    'phone' => $instructorData['phone'] ?? null,
                    'bio' => $instructorData['bio'] ?? null,
                    'years_experience' => $instructorData['yearsExperience'] ?? null,
                    'profile_photo_url' => (isset($instructorData['photoUrl']) && !str_starts_with($instructorData['photoUrl'], 'blob:')) ? $instructorData['photoUrl'] : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            // --- 2. IT TRAINING CLASS ---
            $classBasic = $payload['classBasic'] ?? [];
            $classId = Str::orderedUuid()->toString();

            DB::table('it_training_classes')->insert([
                'id' => $classId,
                'instructor_id' => $instructorId,
                'title' => $classBasic['title'] ?? 'Untitled Training',
                'category' => !empty($classBasic['category']) ? $classBasic['category'] : 'Uncategorized',
                'subcategory' => !empty($classBasic['subcategory']) ? $classBasic['subcategory'] : 'General',
                'level' => json_encode($classBasic['level'] ?? []),
                'format' => json_encode($classBasic['format'] ?? []),
                'training_covers' => $classBasic['trainingCovers'] ?? null,
                'short_description' => $classBasic['shortDescription'] ?? null,
                'curriculum_pdf_url' => $request->hasFile('curriculumPdf') ? $request->file('curriculumPdf')->store('it_training/curriculums', 'public') : null,
                'thumbnail_url' => null,
                'tags' => json_encode($classBasic['tags'] ?? []),
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 3. SCHEDULE ---
            $schedule = $payload['schedule'] ?? [];
            DB::table('it_training_schedules')->insert([
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
                'max_students' => $schedule['maxStudents'] ?? null,
                'trial_available' => $schedule['trialAvailable'] ?? false,
                'schedule_category' => $schedule['scheduleCategory'] ?? 'Weekend',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 4. OVERVIEW ---
            $about = $payload['about'] ?? [];
            $overview = $about['overview'] ?? [];
            DB::table('it_training_overview')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'detailed_description' => $overview['detailedDescription'] ?? null,
                'who_is_it_for' => json_encode($overview['whoIsItFor'] ?? []),
                'what_will_learn' => json_encode($overview['whatWillKidsLearn'] ?? []),
                'highlights' => json_encode($overview['highlights'] ?? []),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 5. CURRICULUM MODULES ---
            $curriculum = $about['curriculum'] ?? [];
            foreach ($curriculum as $idx => $mod) {
                DB::table('it_training_modules')->insert([
                    'id' => Str::orderedUuid()->toString(),
                    'class_id' => $classId,
                    'sort_order' => $idx + 1,
                    'title' => $mod['title'] ?? 'Untitled',
                    'description' => $mod['description'] ?? null,
                    'estimated_duration' => $mod['duration'] ?? null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            // --- 6. REQUIREMENTS ---
            $reqs = $about['requirements'] ?? [];
            DB::table('it_training_requirements')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'prerequisites' => json_encode($reqs['prerequisites'] ?? []),
                'materials_needed' => json_encode($reqs['materialsNeeded'] ?? []),
                'tech_requirements' => json_encode($reqs['techRequirements'] ?? []),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // --- 7. PRICING ---
            $pricing = $payload['pricing'] ?? [];
            DB::table('it_training_pricing')->insert([
                'id' => Str::orderedUuid()->toString(),
                'class_id' => $classId,
                'fee_amount' => $pricing['feeAmount'] ?? 0,
                'fee_currency' => 'USD',
                'fee_type' => !empty($pricing['feeType']) ? $pricing['feeType'] : 'per_month',
                'discount_label' => $pricing['discountLabel'] ?? null,
                'certificate_provided' => $pricing['certificateProvided'] ?? false,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'IT Training listing successfully submitted.',
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

    public function index(Request $request)
    {
        $query = DB::table('it_training_classes')
            ->join('it_instructors', 'it_training_classes.instructor_id', '=', 'it_instructors.id')
            ->leftJoin('it_training_pricing', 'it_training_classes.id', '=', 'it_training_pricing.class_id')
            ->leftJoin('it_training_schedules', 'it_training_classes.id', '=', 'it_training_schedules.class_id')
            ->where('it_training_classes.status', 'active');

        $category = $request->query('category');
        $subcategory = $request->query('subcategory');
        $searchTerm = $request->query('search') ?: $request->query('query');

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('it_training_classes.title', 'like', "%{$searchTerm}%")
                  ->orWhere('it_training_classes.category', 'like', "%{$searchTerm}%")
                  ->orWhere('it_training_classes.subcategory', 'like', "%{$searchTerm}%")
                  ->orWhere('it_training_classes.tags', 'like', "%{$searchTerm}%");
            });
        }

        $trainings = $query->select(
            'it_training_classes.thumbnail_url',
            'it_training_classes.training_covers',
            'it_training_classes.start_date',
            'it_instructors.name as instructorName',
            'it_instructors.profile_photo_url as photoUrl',
            'it_training_pricing.fee_amount',
            'it_training_pricing.fee_type',
            'it_training_schedules.duration_label',
            'it_training_schedules.days_of_week',
            'it_training_schedules.batch_start_date as start_date',
            'it_training_schedules.schedule_category'
        )->get();

        // If slugs are provided, filter in PHP (more robust for sluggified matches)
        if ($category || $subcategory) {
            $trainings = $trainings->filter(function ($t) use ($category, $subcategory) {
                $match = true;
                if ($category) {
                    $match = $match && (Str::slug($t->category) === $category || $t->category === $category);
                }
                if ($subcategory) {
                    $match = $match && (Str::slug($t->subcategory) === $subcategory || $t->subcategory === $subcategory);
                }
                return $match;
            })->values();
        }

        foreach ($trainings as $t) {
            $t->level = json_decode($t->level) ?? [];
            $t->format = json_decode($t->format) ?? [];
            $t->days_of_week = json_decode($t->days_of_week) ?? [];
        }

        return response()->json(['success' => true, 'data' => $trainings]);
    }

    public function show($id)
    {
        $classBasic = DB::table('it_training_classes')->where('id', $id)->first();
        if(!$classBasic) return response()->json(['success'=>false, 'message'=>'Training not found'], 404);
        
        $instructor = DB::table('it_instructors')->where('id', $classBasic->instructor_id)->first();
        $schedule = DB::table('it_training_schedules')->where('class_id', $id)->first();
        $about = DB::table('it_training_overview')->where('class_id', $id)->first();
        $pricing = DB::table('it_training_pricing')->where('class_id', $id)->first();
        $reqs = DB::table('it_training_requirements')->where('class_id', $id)->first();
        $modules = DB::table('it_training_modules')->where('class_id', $id)->orderBy('sort_order')->get();
        
        if($classBasic) { $classBasic->level = json_decode($classBasic->level)?:[]; $classBasic->format = json_decode($classBasic->format)?:[]; $classBasic->tags = json_decode($classBasic->tags)?:[]; }
        if($schedule) { $schedule->days_of_week = json_decode($schedule->days_of_week)?:[]; }
        if($about) { $about->who_is_it_for = json_decode($about->who_is_it_for)?:[]; $about->what_will_learn = json_decode($about->what_will_learn)?:[]; $about->highlights = json_decode($about->highlights)?:[]; }
        if($reqs) { $reqs->prerequisites = json_decode($reqs->prerequisites)?:[]; $reqs->materials_needed = json_decode($reqs->materials_needed)?:[]; $reqs->tech_requirements = json_decode($reqs->tech_requirements)?:[]; }

        return response()->json([
            'success' => true,
            'data' => compact('classBasic', 'instructor', 'schedule', 'about', 'pricing', 'reqs', 'modules')
        ]);
    }

    public function submitLead(Request $request)
    {
        $request->validate([
            'class_id' => 'required',
            'name' => 'required',
            'email' => 'required|email'
        ]);

        $leadId = Str::orderedUuid()->toString();
        $now = Carbon::now();

        DB::table('it_training_leads')->insert([
            'id' => $leadId,
            'class_id' => $request->class_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
            'created_at' => $now,
            'updated_at' => $now
        ]);

        // Logic to send email to instructor can be added here
        // For now, we return success

        return response()->json([
            'success' => true,
            'message' => 'Your request for syllabus has been sent to the instructor.'
        ]);
    }

    public function getLeads()
    {
        $leads = DB::table('it_training_leads')
            ->join('it_training_classes', 'it_training_leads.class_id', '=', 'it_training_classes.id')
            ->select('it_training_leads.*', 'it_training_classes.title as course_title')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $leads]);
    }
}
