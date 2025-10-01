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
    
    // Testimonial management routes
    Route::get('/admin/testimonials', [TestimonialController::class, 'adminIndex']); // Get all for admin
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
    Route::patch('/testimonials/{testimonial}/toggle', [TestimonialController::class, 'toggleStatus']); // Route to toggle status

    Route::get('/admin/posts', [PostController::class, 'adminIndex']); // Get all posts for admin
    Route::post('/posts', [PostController::class, 'store']); // Use POST for create
    Route::post('/posts/{post}', [PostController::class, 'update']); // Use POST for update with files
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::patch('/posts/{post}/toggle', [PostController::class, 'toggleStatus']);

    // Gallery management routes
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);
    
    // Settings management route
    Route::post('/settings', [SettingController::class, 'store']); // 👈 ADD THIS LINE
});