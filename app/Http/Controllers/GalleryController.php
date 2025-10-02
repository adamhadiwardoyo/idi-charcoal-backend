<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        return Gallery::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $path = $request->file('image')->store('gallery-images', 'public');

        // --- PERBAIKAN DI SINI ---
        // Simpan data ke kolom 'path', bukan 'url'
        $gallery = Gallery::create([
            'path' => $path,
        ]);

        return response()->json($gallery, 201);
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->path) {
            Storage::disk('public')->delete($gallery->path);
        }

        $gallery->delete();

        return response()->json(null, 204);
    }
}