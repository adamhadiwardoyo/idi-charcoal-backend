<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule; // <-- Impor Rule

class PostController extends Controller
{
    // Fungsi ini sekarang akan menerima parameter bahasa dari request
    public function index(Request $request)
    {
        // Validasi bahasa yang diizinkan
        $request->validate([
            'lang' => ['sometimes', 'string', Rule::in(['en', 'de', 'ar', 'nl', 'zh', 'fr', 'ja'])],
        ]);

        // Ambil bahasa dari query string, default ke 'en' jika tidak ada
        $language = $request->query('lang', 'en');

        return Post::where('is_active', true)
                    ->where('language', $language)
                    ->latest()
                    ->get();
    }

    public function adminIndex()
    {
        return Post::latest()->get();
    }
    
    // ... (fungsi show dan showBySlug tidak berubah) ...
    public function show(Post $post)
    {
        if (!$post->is_active) {
            abort(404);
        }
        return $post;
    }

    public function showBySlug($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        return $post;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // ... (validasi lain tetap sama)
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts',
            'excerpt' => 'required|string',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'meta_title' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'contents' => 'required|string',
            'imageFile' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'sometimes|boolean',
            // --- Tambahkan validasi untuk bahasa ---
            'language' => ['required', 'string', Rule::in(['en', 'de', 'ar', 'nl', 'zh', 'fr', 'ja'])],
        ]);

        if ($request->hasFile('imageFile')) {
            $validated['image'] = $request->file('imageFile')->store('post-images', 'public');
        }

        $postData = $validated;
        $postData['content'] = $validated['contents']; // Sesuaikan nama field
        unset($postData['contents']);

        $post = Post::create($postData);

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            // ... (validasi lain tetap sama)
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:posts,slug,' . $post->id,
            'excerpt' => 'required|string',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'meta_title' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'contents' => 'required|string',
            'imageFile' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_active' => 'sometimes|boolean',
            // --- Tambahkan validasi untuk bahasa ---
            'language' => ['required', 'string', Rule::in(['en', 'de', 'ar', 'nl', 'zh', 'fr', 'ja'])],
        ]);

        if ($request->hasFile('imageFile')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $validated['image'] = $request->file('imageFile')->store('post-images', 'public');
        }

        $validated['content'] = $validated['contents'];
        unset($validated['contents']);

        $post->update($validated);

        return response()->json($post);
    }

    // ... (fungsi destroy dan toggleStatus tidak berubah) ...
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
}