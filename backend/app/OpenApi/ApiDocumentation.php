<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'BIO CWT API',
    description: 'API for public website content, contact messages, JWT authentication, and the protected admin CMS.'
)]
#[OA\Server(
    url: '/',
    description: 'Current application host'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    description: 'Use the access token returned by the login endpoint.',
    bearerFormat: 'JWT',
    scheme: 'bearer'
)]
#[OA\SecurityScheme(
    securityScheme: 'refreshCookie',
    type: 'apiKey',
    description: 'HTTP-only refresh token cookie issued by login and rotated by refresh.',
    name: 'refresh_token',
    in: 'cookie'
)]
#[OA\Tag(name: 'Authentication', description: 'Admin authentication and token lifecycle.')]
#[OA\Tag(name: 'Public Content', description: 'Public website content and version information.')]
#[OA\Tag(name: 'Contact Messages', description: 'Public contact form submission.')]
#[OA\Tag(name: 'Admin Inbox', description: 'Protected contact-message management.')]
#[OA\Tag(name: 'Admin Homepage', description: 'Protected homepage content management.')]
#[OA\Tag(name: 'Admin Services', description: 'Protected services management.')]
#[OA\Tag(name: 'Admin Products', description: 'Protected products and wood-types management.')]
#[OA\Tag(name: 'Admin Images', description: 'Protected product image management.')]
final class ApiDocumentation {}
