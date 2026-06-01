<?php

namespace App\Http\Controllers;

use App\Models\LocalJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LocalJobController extends Controller
{
    public function index(Request $request)
    {
        $query = LocalJob::query()->with('user:id,name,email,profile_photo')->latest();

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }
        if ($request->has('zipcode') && !empty($request->zipcode)) {
            $query->where('zipcode', 'like', '%' . $request->zipcode . '%');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zipcode' => 'nullable|string|max:255',
            'pay_rate' => 'nullable|string|max:255',
        ]);

        $job = new LocalJob();
        $job->user_id = Auth::id() ?: 1;
        $job->title = $request->title;
        $job->category = $request->category;
        $job->description = $request->description;
        $job->city = $request->city;
        $job->state = $request->state;
        $job->zipcode = $request->zipcode;
        $job->pay_rate = $request->pay_rate;
        $job->status = 'active';
        $job->save();

        return response()->json($job, 201);
    }

    public function show($id)
    {
        $job = LocalJob::with('user:id,name,email,profile_photo')->findOrFail($id);
        return response()->json($job);
    }
}
