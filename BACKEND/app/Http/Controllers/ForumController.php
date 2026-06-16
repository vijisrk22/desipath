<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\ForumSubforum;
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

        if ($request->filled('tags')) {
            $tags = explode(',', $request->tags);
            $query->whereIn('location_tag', $tags);
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function show($slug)
    {
        $post = ForumPost::with(['user:id,name', 'comments.user:id,name', 'comments.replies.user:id,name'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

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
            'category' => 'nullable|string',
            'location' => 'nullable|string'
        ]);

        $post = ForumPost::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
            'location' => $request->location,
        ]);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function updatePost(Request $request, $id)
    {
        $post = ForumPost::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function destroyPost($id)
    {
        $post = ForumPost::findOrFail($id);

        if ($post->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully'
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
    public function updateComment(Request $request, $id)
    {
        $comment = ForumComment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'data' => $comment
        ]);
    }

    public function destroyComment($id)
    {
        $comment = ForumComment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Optional: If comments have replies, you might want to handle deletion differently
        // e.g., set content to '[deleted]' or actually delete it.
        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ]);
    }

    // --- Admin Subforum Management ---

    public function listSubforums()
    {
        $count = ForumSubforum::count();
        if ($count === 0) {
            $categories = ForumPost::distinct()->pluck('category')->filter();
            
            $iconMap = [
                'H1B Visa discussion' => '🛂',
                'Indian Cooking' => '🍛',
                'Real estate in USA' => '🏠',
                'New to USA' => '🗽',
                'About Studies' => '🎓',
                'Kids' => '🧸'
            ];

            foreach ($categories as $cat) {
                ForumSubforum::firstOrCreate([
                    'name' => $cat,
                ], [
                    'slug' => \Illuminate\Support\Str::slug($cat),
                    'icon' => $iconMap[$cat] ?? 'd/'
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => ForumSubforum::orderBy('name')->get()
        ]);
    }

    public function storeSubforum(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:forum_subforums,name',
            'description' => 'nullable|string',
            'icon' => 'nullable|string'
        ]);

        $subforum = ForumSubforum::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $subforum
        ]);
    }

    public function updateSubforum(Request $request, $id)
    {
        $subforum = ForumSubforum::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|unique:forum_subforums,name,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string'
        ]);

        $subforum->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $subforum
        ]);
    }

    public function destroySubforum($id)
    {
        ForumSubforum::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Subforum deleted successfully'
        ]);
    }

    public function deletePostByUrl(Request $request)
    {
        $url = $request->url;
        if (!$url) return response()->json(['success' => false, 'message' => 'URL is required'], 400);

        // Extract slug from URL (handles trailing slash and query params)
        $path = parse_url($url, PHP_URL_PATH);
        $parts = explode('/', rtrim($path, '/'));
        $slug = end($parts);

        $post = ForumPost::where('slug', $slug)->orWhere('id', $slug)->first();
        if ($post) {
            $post->delete();
            return response()->json(['success' => true, 'message' => 'Post deleted successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Post not found at this URL'], 404);
    }
}
