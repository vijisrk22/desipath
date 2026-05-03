<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ForumPost;
use App\Models\ForumComment;
use Illuminate\Support\Facades\Auth;

class ForumController extends Controller
{
    public function index(Request $request)
    {
        $query = ForumPost::with(['user:id,name'])
            ->withCount('comments');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function show($id)
    {
        $post = ForumPost::with(['user:id,name', 'comments.user:id,name', 'comments.replies.user:id,name'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function storePost(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string'
        ]);

        $post = ForumPost::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
        ]);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function storeComment(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:forum_posts,id',
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:forum_comments,id'
        ]);

        $comment = ForumComment::create([
            'user_id' => Auth::id(),
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'data' => $comment->load('user:id,name')
        ]);
    }

    public function votePost(Request $request, $id)
    {
        $post = ForumPost::findOrFail($id);
        $type = $request->type; // 'up' or 'down'

        if ($type === 'up') {
            $post->increment('votes');
        } else {
            $post->decrement('votes');
        }

        return response()->json([
            'success' => true,
            'votes' => $post->votes
        ]);
    }
}
