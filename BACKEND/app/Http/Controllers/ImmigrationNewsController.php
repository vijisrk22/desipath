<?php

namespace App\Http\Controllers;

use App\Models\ImmigrationNews;
use Illuminate\Http\Request;

class ImmigrationNewsController extends Controller
{
    public function index(Request $request)
    {
        $query = ImmigrationNews::where('status', 'published');

        if ($request->has('category') && $request->category !== 'All') {
            // Because React frontend might send 'All' or empty
            $query->where('category', $request->category);
        }

        if ($request->has('tag')) {
            $query->whereJsonContains('tags_json', $request->tag);
        }

        if ($request->has('urgency')) {
            $query->where('urgency', $request->urgency);
        }

        $news = $query->orderBy('published_at', 'desc')->paginate(20);

        return response()->json($news);
    }

    public function show($slug)
    {
        $article = ImmigrationNews::where('slug', $slug)->where('status', 'published')->firstOrFail();
        
        // Increment view count
        $article->increment('views_count');
        
        return response()->json($article);
    }

    public function getLatestUrgent()
    {
        $news = ImmigrationNews::where('status', 'published')
                    ->where('urgency', 'high')
                    ->where('published_at', '>=', now()->subHours(24))
                    ->orderBy('published_at', 'desc')
                    ->take(3)
                    ->get();
                    
        return response()->json($news);
    }
}
