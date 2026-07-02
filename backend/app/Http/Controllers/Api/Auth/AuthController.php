<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\Auth\RefreshTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Cookie as HttpCookie;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    public function __construct(private readonly RefreshTokenService $refreshTokens) {}

    public function login(LoginRequest $request): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('api');
        $credentialToken = $guard->attempt($request->validated());

        if (! $credentialToken) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        /** @var User $user */
        $user = $guard->user();
        [$user, $refreshToken] = $this->refreshTokens->startSession($user, $request);
        $accessToken = JWTAuth::fromUser($user);

        return $this->tokenResponse($user, $accessToken, $refreshToken);
    }

    public function refresh(Request $request): JsonResponse
    {
        $rotation = $this->refreshTokens->rotate(
            $request->cookie(config('auth_tokens.refresh_cookie.name')),
            $request
        );

        if (! $rotation) {
            return response()->json([
                'message' => 'The refresh token is invalid or expired.',
            ], Response::HTTP_UNAUTHORIZED)->withCookie($this->forgetRefreshCookie());
        }

        [$user, $refreshToken] = $rotation;

        return $this->tokenResponse(
            $user,
            JWTAuth::fromUser($user),
            $refreshToken
        );
    }

    public function logout(Request $request): Response
    {
        $this->refreshTokens->revoke(
            $request->cookie(config('auth_tokens.refresh_cookie.name'))
        );

        if ($accessToken = $request->bearerToken()) {
            try {
                JWTAuth::setToken($accessToken)->invalidate();
            } catch (TokenBlacklistedException|TokenExpiredException|TokenInvalidException) {
                // Logout still revokes the refresh token when access JWT is stale.
            }
        }

        return response()->noContent()->withCookie($this->forgetRefreshCookie());
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user('api');

        return response()->json([
            'user' => $this->userData($user),
        ]);
    }

    private function tokenResponse(
        User $user,
        string $accessToken,
        string $refreshToken
    ): JsonResponse {
        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => (int) config('jwt.ttl') * 60,
            'user' => $this->userData($user),
        ])->withCookie($this->makeRefreshCookie($refreshToken));
    }

    /**
     * @return array{id: int, name: string, email: string}
     */
    private function userData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    private function makeRefreshCookie(string $refreshToken): HttpCookie
    {
        return Cookie::make(
            config('auth_tokens.refresh_cookie.name'),
            $refreshToken,
            (int) config('auth_tokens.refresh_token_ttl_days') * 24 * 60,
            config('auth_tokens.refresh_cookie.path'),
            config('auth_tokens.refresh_cookie.domain'),
            config('auth_tokens.refresh_cookie.secure'),
            true,
            false,
            config('auth_tokens.refresh_cookie.same_site')
        );
    }

    private function forgetRefreshCookie(): HttpCookie
    {
        return Cookie::forget(
            config('auth_tokens.refresh_cookie.name'),
            config('auth_tokens.refresh_cookie.path'),
            config('auth_tokens.refresh_cookie.domain')
        );
    }
}
