<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Display a listing of ACTIVE testimonials for the public site.
     */
    public function index()
    {
        return Testimonial::where('is_active', true)->get();
    }
    
    /**
     * Display a listing of ALL testimonials for the admin panel.
     */
    public function adminIndex()
    {
        return Testimonial::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => 'required|string',
            'author' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $testimonial = Testimonial::create($validated);
        return response()->json($testimonial, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        return $testimonial;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'quote' => 'sometimes|required|string',
            'author' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $testimonial->update($validated);
        return response()->json($testimonial);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(null, 204);
    }
    
    /**
     * Toggle the active status of a testimonial.
     */
    public function toggleStatus(Testimonial $testimonial)
    {
        $testimonial->is_active = !$testimonial->is_active;
        $testimonial->save();
        return response()->json($testimonial);
    }
}