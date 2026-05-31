<?php

namespace App\Http\Controllers;

use App\Models\ItJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItJobController extends Controller
{
    public function index(Request $request)
    {
        $query = ItJob::query()->with('user:id,name,email,profile_photo')->latest();

        if ($request->has('zipcode') && !empty($request->zipcode)) {
            $query->where('zipcode', 'like', '%' . $request->zipcode . '%');
        }
        
        if ($request->has('h1b_transfer_available') && $request->h1b_transfer_available === 'true') {
            $query->where('h1b_transfer_available', true);
        }

        // Basic skills search inside JSON
        if ($request->has('skills') && !empty($request->skills)) {
            $query->whereJsonContains('skills', $request->skills);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'description' => 'required|string',
            'skills' => 'nullable|array',
            'visa_requirements' => 'nullable|array',
            'job_types' => 'nullable|array',
            'h1b_transfer_available' => 'boolean',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zipcode' => 'nullable|string|max:255',
        ]);

        $job = new ItJob();
        $job->user_id = Auth::id() ?: 1;
        $job->title = $request->title;
        $job->company_name = $request->company_name;
        $job->description = $request->description;
        $job->skills = $request->skills;
        $job->visa_requirements = $request->visa_requirements;
        $job->job_types = $request->job_types;
        $job->h1b_transfer_available = $request->h1b_transfer_available ?? false;
        $job->city = $request->city;
        $job->state = $request->state;
        $job->zipcode = $request->zipcode;
        $job->status = 'active';
        $job->save();

        return response()->json($job, 201);
    }

    public function show($id)
    {
        $job = ItJob::with('user:id,name,email,profile_photo')->findOrFail($id);
        return response()->json($job);
    }
}
