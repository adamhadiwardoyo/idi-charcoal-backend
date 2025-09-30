<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\AdminMiddleware;
/* 
Route::get('/', function () {
    return Inertia::render('Home'); // <--- CHANGE TO THIS
});
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// vvv ADD THIS CODE vvv
Route::middleware([AdminMiddleware::class])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('Profile/AdminDashboard');
    })->name('admin.dashboard');
});
// ^^^ END OF ADDED CODE ^^^

require __DIR__.'/auth.php';