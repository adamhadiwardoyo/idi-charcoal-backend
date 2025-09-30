<?php

use App\Http\Controllers\TestimonialController;

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);
Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
