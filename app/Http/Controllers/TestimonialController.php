<?php
// app/Http/Controllers/TestimonialController.php
namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return Testimonial::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote' => 'required|string',
            'author' => 'required|string',
            'location' => 'required|string',
        ]);

        return Testimonial::create($validated);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->noContent();
    }
}
