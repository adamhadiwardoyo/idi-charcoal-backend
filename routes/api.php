<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\PostController; // 👈 CHECK THIS LINE
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// This single line creates all the necessary routes:
// GET /testimonials, POST /testimonials, PUT /testimonials/{id}, DELETE /testimonials/{id}
Route::apiResource('testimonials', TestimonialController::class);
// Public routes (anyone can view posts)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);

// Admin-only routes (must be logged in as admin to manage posts)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});