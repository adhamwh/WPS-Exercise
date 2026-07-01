<?php

return [
    'refresh_token_ttl_days' => (int) env('AUTH_REFRESH_TOKEN_TTL_DAYS', 7),

    'refresh_cookie' => [
        'name' => env('AUTH_REFRESH_COOKIE_NAME', 'refresh_token'),
        'path' => env('AUTH_REFRESH_COOKIE_PATH', '/api/auth'),
        'domain' => env('AUTH_REFRESH_COOKIE_DOMAIN'),
        'secure' => (bool) env('AUTH_REFRESH_COOKIE_SECURE', false),
        'same_site' => env('AUTH_REFRESH_COOKIE_SAME_SITE', 'lax'),
    ],
];
