<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    // For the public site - only get active posts
    public function index()
    {
        return Post::where('is_active', true)
            ->select('slug', 'title', 'excerpt', 'image', 'date', 'category')
            ->orderBy('date', 'desc')
            ->get();
    }
    
    // For the admin panel - get all posts
    public function adminIndex()
    {
        return Post::orderBy('date', 'desc')->get();
    }

    public function show(string $slug)
    {
        return Post::with('contents')->where('slug', $slug)->firstOrFail();
    }

    public function store(Request $request)
    {
        $validated = $this->validatePost($request);

        if ($request->hasFile('imageFile')) {
            $validated['image'] = $request->file('imageFile')->store('posts', 'public');
        }

        return DB::transaction(function () use ($validated) {
            $post = Post::create($validated);
            if (!empty($validated['contents'])) {
                $post->contents()->createMany($validated['contents']);
            }
            return response()->json($post, 201);
        });
    }

    public function update(Request $request, Post $post)
    {
        $validated = $this->validatePost($request, $post->id);
        
        if ($request->hasFile('imageFile')) {
            // Delete old image
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            // Store new image
            $validated['image'] = $request->file('imageFile')->store('posts', 'public');
        }

        return DB::transaction(function () use ($validated, $post) {
            $post->update($validated);
            $post->contents()->delete();
            if (!empty($validated['contents'])) {
                $post->contents()->createMany($validated['contents']);
            }
            return response()->json($post);
        });
    }

    public function destroy(Post $post)
    {
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }
        $post->delete();
        return response()->json(null, 204);
    }
    
    public function toggleStatus(Post $post)
    {
        $post->is_active = !$post->is_active;
        $post->save();
        return response()->json($post);
    }

    private function validatePost(Request $request, $postId = null)
{
    // Because contents come as JSON string, we decode it first.
    $request->merge(['contents' => json_decode($request->contents, true)]);
    
    // --- THIS IS THE FIX ---
    // Manually cast 'is_active' from string "true" or "false" to a proper boolean
    // before the validator runs.
    if ($request->has('is_active')) {
        $request->merge([
            'is_active' => filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)
        ]);
    }
    
    $rules = [
        'title' => 'required|string|max:255',
        'excerpt' => 'required|string',
        'date' => 'required|date',
        'category' => 'required|string',
        'meta_title' => 'required|string',
        'meta_description' => 'required|string',
        'is_active' => 'required|boolean', // This will now work correctly
        'contents' => 'nullable|array',
        'imageFile' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
    ];

    $slugRule = 'required|string|unique:posts,slug';
    if ($postId) {
        $slugRule .= ',' . $postId;
    }
    $rules['slug'] = $slugRule;

    return $request->validate($rules);
}
}