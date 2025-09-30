<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    // List all gallery images
    public function index()
    {
        return Gallery::all();
    }

    // Upload and store a new image
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Store the file in 'public/gallery' and get its path
        $path = $request->file('image')->store('gallery', 'public');

        // Create a record in the database
        $image = Gallery::create(['path' => $path]);

        return response()->json($image, 201);
    }

    // Delete an image
    public function destroy(Gallery $gallery)
    {
        // Delete the file from storage
        Storage::disk('public')->delete($gallery->path);

        // Delete the record from the database
        $gallery->delete();

        return response()->json(null, 204);
    }
}