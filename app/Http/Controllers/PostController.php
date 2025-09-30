<?php

namespace App\Http\Controllers;

use App\Models\Post; // 👈 Make sure this line exists
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // For logging errors

class PostController extends Controller
{
    public function index()
    {
        try {
            return Post::orderBy('date', 'desc')->get();
        } catch (\Exception $e) {
            // Log the actual error to your log file
            Log::error('Failed to fetch posts: ' . $e->getMessage());
            // Return a generic 500 error response
            return response()->json(['message' => 'An error occurred while fetching posts.'], 500);
        }
    }

    public function show(string $slug)
    {
        return Post::with('contents')->where('slug', $slug)->firstOrFail();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:posts,slug',
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'image' => 'required|string',
            'date' => 'required|date',
            'category' => 'required|string',
            'meta_title' => 'required|string',
            'meta_description' => 'required|string',
            'contents' => 'required|array',
            'contents.*.type' => 'required|string',
            'contents.*.text' => 'nullable|string',
            'contents.*.items' => 'nullable|array',
        ]);

        return DB::transaction(function () use ($validated) {
            $post = Post::create($validated);
            $post->contents()->createMany($validated['contents']);
            return response()->json($post, 201);
        });
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:posts,slug,' . $post->id,
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'image' => 'required|string',
            'date' => 'required|date',
            'category' => 'required|string',
            'meta_title' => 'required|string',
            'meta_description' => 'required|string',
            'contents' => 'required|array',
        ]);

        return DB::transaction(function () use ($validated, $post) {
            $post->update($validated);
            $post->contents()->delete();
            $post->contents()->createMany($validated['contents']);
            return response()->json($post);
        });
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(null, 204);
    }
}