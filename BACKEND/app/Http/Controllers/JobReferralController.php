<?php

namespace App\Http\Controllers;

use App\Models\JobReferral;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobReferralController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = JobReferral::query()->with('user:id,name,email,profile_photo')->latest();
        
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:requesting_referral,offering_referral',
            'company_name' => 'nullable|string|max:255',
            'role_title' => 'nullable|string|max:255',
            'description' => 'required|string',
            'resume_url' => 'nullable|url|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zipcode' => 'nullable|string|max:20',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['status'] = 'active';

        $referral = JobReferral::create($validated);

        return response()->json($referral, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
