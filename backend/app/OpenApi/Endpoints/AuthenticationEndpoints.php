<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AuthenticationEndpoints
{
    #[OA\Post(
        path: '/api/auth/login',
        operationId: 'login',
        summary: 'Log in as an administrator',
        description: 'Validates the administrator credentials, invalidates any previous session, returns a short-lived JWT access token, and sets an HTTP-only refresh-token cookie.',
        tags: ['Authentication'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/LoginRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Authenticated. A refresh token is returned as an HTTP-only cookie.',
                headers: [
                    new OA\Header(
                        header: 'Set-Cookie',
                        description: 'HTTP-only refresh_token cookie.',
                        schema: new OA\Schema(type: 'string', example: 'refresh_token=token; Path=/api/auth; HttpOnly; SameSite=Lax')
                    ),
                ],
                content: new OA\JsonContent(ref: '#/components/schemas/AuthTokenResponse')
            ),
            new OA\Response(
                response: 401,
                description: 'The credentials are incorrect.',
                content: new OA\JsonContent(ref: '#/components/schemas/InvalidCredentialsResponse')
            ),
            new OA\Response(
                response: 422,
                description: 'The email or password failed validation.',
                content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')
            ),
            new OA\Response(
                response: 429,
                description: 'More than five login attempts were made within one minute.',
                content: new OA\JsonContent(ref: '#/components/schemas/TooManyRequestsResponse')
            ),
        ]
    )]
    public function login(): void {}

    #[OA\Post(
        path: '/api/auth/refresh',
        operationId: 'refreshAccessToken',
        summary: 'Rotate the refresh token',
        description: 'Reads the HTTP-only refresh_token cookie, rotates it, and returns a new short-lived JWT access token.',
        tags: ['Authentication'],
        security: [['refreshCookie' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Token refreshed. The rotated refresh token is returned as an HTTP-only cookie.',
                headers: [
                    new OA\Header(
                        header: 'Set-Cookie',
                        description: 'Rotated HTTP-only refresh_token cookie.',
                        schema: new OA\Schema(type: 'string', example: 'refresh_token=rotated-token; Path=/api/auth; HttpOnly; SameSite=Lax')
                    ),
                ],
                content: new OA\JsonContent(ref: '#/components/schemas/AuthTokenResponse')
            ),
            new OA\Response(
                response: 401,
                description: 'The refresh token is missing, invalid, expired, or already used.',
                content: new OA\JsonContent(ref: '#/components/schemas/InvalidRefreshTokenResponse')
            ),
            new OA\Response(
                response: 429,
                description: 'More than ten refresh attempts were made within one minute.',
                content: new OA\JsonContent(ref: '#/components/schemas/TooManyRequestsResponse')
            ),
        ]
    )]
    public function refresh(): void {}

    #[OA\Post(
        path: '/api/auth/logout',
        operationId: 'logout',
        summary: 'Log out',
        description: 'Revokes the refresh token, invalidates the supplied access token when present, and clears the refresh-token cookie.',
        tags: ['Authentication'],
        security: [
            ['bearerAuth' => [], 'refreshCookie' => []],
            ['bearerAuth' => []],
            ['refreshCookie' => []],
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Logged out successfully. No response body.',
                headers: [
                    new OA\Header(
                        header: 'Set-Cookie',
                        description: 'Expired refresh_token cookie.',
                        schema: new OA\Schema(type: 'string', example: 'refresh_token=deleted; Max-Age=0; Path=/api/auth')
                    ),
                ]
            ),
            new OA\Response(
                response: 429,
                description: 'More than ten logout attempts were made within one minute.',
                content: new OA\JsonContent(ref: '#/components/schemas/TooManyRequestsResponse')
            ),
        ]
    )]
    public function logout(): void {}

    #[OA\Get(
        path: '/api/auth/me',
        operationId: 'getAuthenticatedUser',
        summary: 'Get the authenticated administrator',
        tags: ['Authentication'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Authenticated administrator.',
                content: new OA\JsonContent(ref: '#/components/schemas/CurrentUserResponse')
            ),
            new OA\Response(
                response: 401,
                description: 'The access token is missing, invalid, expired, or belongs to an invalidated session.',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')
            ),
        ]
    )]
    public function me(): void {}
}
