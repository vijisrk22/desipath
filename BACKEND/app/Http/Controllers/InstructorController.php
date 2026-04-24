<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    /**
     * Handle Instructor Profile Photo Upload (Phase 2 S3 / Cloud Setup)
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'instructor_id' => 'required',
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $instructorId = $request->instructor_id;
        \Log::info("Photo upload request for instructor: " . $instructorId);
        
        if ($instructorId === 'new') {
            $instructorId = Str::uuid()->toString();
        }

        $file = $request->file('photo');
        $timestamp = time();
        $isCropped = $request->input('is_cropped', false);
        
        $prefix = $isCropped ? 'cropped' : 'original';
        $filename = "{$prefix}_{$timestamp}." . $file->getClientOriginalExtension();
        $path = "instructors/{$instructorId}/profile";

        // Always use 'public' disk for profile photos to ensure web accessibility
        $disk = 'public';
        $storedPath = $file->storeAs($path, $filename, $disk);

        // Generate the URL. If APP_URL is correctly set, this handles it.
        // If not, we return the relative path starting with 'storage/'
        $url = "/storage/" . $storedPath;

        return response()->json([
            'success' => true,
            'url' => $url,
            'instructor_id' => $instructorId,
            'path' => $storedPath
        ]);
    }
}
