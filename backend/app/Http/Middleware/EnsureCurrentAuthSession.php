<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class EnsureCurrentAuthSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user('api');

        try {
            $tokenVersion = JWTAuth::parseToken()->getPayload()->get('session_version');
        } catch (JWTException) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (
            $user === null ||
            $tokenVersion === null ||
            (int) $tokenVersion !== (int) $user->auth_session_version
        ) {
            return response()->json([
                'message' => 'This session is no longer active.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
