<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestimonialController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// This single line creates all the necessary routes:
// GET /testimonials, POST /testimonials, PUT /testimonials/{id}, DELETE /testimonials/{id}
Route::apiResource('testimonials', TestimonialController::class);