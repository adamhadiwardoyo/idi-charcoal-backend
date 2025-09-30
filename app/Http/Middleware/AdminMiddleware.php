<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }

        abort(403, 'Unauthorized');

            // If it's an API request, return a JSON error. Otherwise, redirect.
    if ($request->expectsJson()) {
        return response()->json(['message' => 'Unauthorized.'], 403);
    }

    return redirect('/');
    }
}
