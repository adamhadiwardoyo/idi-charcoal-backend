<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\SettingController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- PUBLIC ROUTES ---
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'showBySlug']); // Fixed to use showBySlug

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);

// --- ADMIN-ONLY ROUTES ---
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // Testimonial management routes
    Route::get('/admin/testimonials', [TestimonialController::class, 'adminIndex']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    // 👇 PERBAIKAN DI SINI: Ubah 'put' menjadi 'patch'
    Route::patch('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
    Route::patch('/testimonials/{testimonial}/toggle', [TestimonialController::class, 'toggleStatus']);

    // Post management routes
    Route::get('/admin/posts', [PostController::class, 'adminIndex']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    Route::patch('/posts/{post}/toggle', [PostController::class, 'toggleStatus']);

    // Gallery management routes

    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);

    // Settings management route
    Route::post('/settings', [SettingController::class, 'store']);
});