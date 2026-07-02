<?php

namespace App\OpenApi\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'AuthTokenResponse',
    required: ['access_token', 'token_type', 'expires_in', 'user'],
    properties: [
        new OA\Property(property: 'access_token', description: 'Short-lived JWT access token.', type: 'string', example: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'),
        new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
        new OA\Property(property: 'expires_in', description: 'Access-token lifetime in seconds.', type: 'integer', example: 900),
        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CurrentUserResponse',
    required: ['user'],
    properties: [
        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContentVersionResponse',
    required: ['version'],
    properties: [
        new OA\Property(
            property: 'version',
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000'
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactMessageCreatedResponse',
    required: ['message', 'id'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Sent!'),
        new OA\Property(property: 'id', type: 'integer', example: 25),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ErrorResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'InvalidCredentialsResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The provided credentials are incorrect.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'InvalidRefreshTokenResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The refresh token is invalid or expired.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'TooManyRequestsResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Too Many Attempts.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactRateLimitResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Please wait before sending another message.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'NotFoundResponse',
    required: ['message'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'Resource not found.'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ValidationErrorResponse',
    required: ['message', 'errors'],
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid.'),
        new OA\Property(
            property: 'errors',
            type: 'object',
            example: ['email' => ['The email field is required.']],
            additionalProperties: new OA\AdditionalProperties(
                type: 'array',
                items: new OA\Items(type: 'string')
            )
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'HomepageSectionResponse',
    required: ['data'],
    properties: [
        new OA\Property(property: 'data', ref: '#/components/schemas/HomepageSection'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'HomepageSectionCollectionResponse',
    required: ['data'],
    properties: [
        new OA\Property(
            property: 'data',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/HomepageSection')
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ServiceResponse',
    required: ['data'],
    properties: [
        new OA\Property(property: 'data', ref: '#/components/schemas/Service'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ServiceCollectionResponse',
    required: ['data'],
    properties: [
        new OA\Property(
            property: 'data',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/Service')
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductResponse',
    required: ['data'],
    properties: [
        new OA\Property(property: 'data', ref: '#/components/schemas/Product'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductCollectionResponse',
    required: ['data'],
    properties: [
        new OA\Property(
            property: 'data',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/Product')
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImageResponse',
    required: ['data'],
    properties: [
        new OA\Property(property: 'data', ref: '#/components/schemas/ProductImage'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImageCollectionResponse',
    required: ['data'],
    properties: [
        new OA\Property(
            property: 'data',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/ProductImage')
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactMessageResponse',
    required: ['data'],
    properties: [
        new OA\Property(property: 'data', ref: '#/components/schemas/ContactMessage'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'PaginationLink',
    required: ['label', 'active'],
    properties: [
        new OA\Property(property: 'url', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/api/admin/contact-messages?page=2'),
        new OA\Property(property: 'label', type: 'string', example: '2'),
        new OA\Property(property: 'active', type: 'boolean', example: false),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactMessagePaginatedResponse',
    required: ['data', 'links', 'meta'],
    properties: [
        new OA\Property(
            property: 'data',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/ContactMessage')
        ),
        new OA\Property(
            property: 'links',
            required: ['first', 'last', 'prev', 'next'],
            properties: [
                new OA\Property(property: 'first', type: 'string', format: 'uri', example: 'https://example.com/api/admin/contact-messages?page=1'),
                new OA\Property(property: 'last', type: 'string', format: 'uri', example: 'https://example.com/api/admin/contact-messages?page=3'),
                new OA\Property(property: 'prev', type: 'string', format: 'uri', nullable: true, example: null),
                new OA\Property(property: 'next', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/api/admin/contact-messages?page=2'),
            ],
            type: 'object'
        ),
        new OA\Property(
            property: 'meta',
            required: ['current_page', 'from', 'last_page', 'links', 'path', 'per_page', 'to', 'total'],
            properties: [
                new OA\Property(property: 'current_page', type: 'integer', example: 1),
                new OA\Property(property: 'from', type: 'integer', nullable: true, example: 1),
                new OA\Property(property: 'last_page', type: 'integer', example: 3),
                new OA\Property(property: 'links', type: 'array', items: new OA\Items(ref: '#/components/schemas/PaginationLink')),
                new OA\Property(property: 'path', type: 'string', format: 'uri', example: 'https://example.com/api/admin/contact-messages'),
                new OA\Property(property: 'per_page', type: 'integer', example: 20),
                new OA\Property(property: 'to', type: 'integer', nullable: true, example: 20),
                new OA\Property(property: 'total', type: 'integer', example: 45),
            ],
            type: 'object'
        ),
    ],
    type: 'object'
)]
final class ResponseSchemas {}
