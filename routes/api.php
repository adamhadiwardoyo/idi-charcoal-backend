<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\SettingController; // 👈 ADD THIS LINE

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- PUBLIC ROUTES ---
// Anyone can view posts, testimonials, and settings
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);

Route::get('/settings', [SettingController::class, 'index']); // Publicly fetch settings

// --- ADMIN-ONLY ROUTES ---
// All routes in this group require the user to be a logged-in admin.
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Testimonial management routes (Create, Update, Delete)
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    // Blog management routes
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    // Gallery management routes
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);
    
    // Settings management route
    Route::post('/settings', [SettingController::class, 'store']); // 👈 ADD THIS LINE
});