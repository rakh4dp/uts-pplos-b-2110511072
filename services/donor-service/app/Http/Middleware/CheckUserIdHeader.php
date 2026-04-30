<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserIdHeader
{
    public function handle(Request $request, Closure $next)
    {
        $userId = $request->header('X-User-Id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->merge(['user_id' => $userId]);

        return $next($request);
    }
}