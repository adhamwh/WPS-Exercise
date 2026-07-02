<?php

namespace App\OpenApi\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'LoginRequest',
    required: ['email', 'password'],
    properties: [
        new OA\Property(
            property: 'email',
            description: 'Admin email address.',
            type: 'string',
            format: 'email',
            maxLength: 255,
            example: 'admin@example.com'
        ),
        new OA\Property(
            property: 'password',
            description: 'Admin password.',
            type: 'string',
            format: 'password',
            example: 'secure-password'
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactMessageCreateRequest',
    required: ['name', 'telephone', 'question'],
    properties: [
        new OA\Property(
            property: 'name',
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'Jane Smith'
        ),
        new OA\Property(
            property: 'telephone',
            description: 'Telephone number containing 7 to 15 digits.',
            type: 'string',
            pattern: '^[0-9]{7,15}$',
            example: '420123456789'
        ),
        new OA\Property(
            property: 'question',
            type: 'string',
            minLength: 10,
            maxLength: 1000,
            example: 'Could you provide a quote for a custom oak table?'
        ),
        new OA\Property(
            property: 'website',
            description: 'Spam honeypot. Leave this field empty.',
            type: 'string',
            maxLength: 0,
            nullable: true,
            example: ''
        ),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'HomepageSectionUpdateRequest',
    properties: [
        new OA\Property(property: '_method', description: 'Set to PATCH when multipart data is sent using HTTP POST method spoofing.', type: 'string', enum: ['PATCH'], example: 'PATCH'),
        new OA\Property(property: 'title', type: 'string', maxLength: 255, nullable: true, example: 'Solid wood products'),
        new OA\Property(property: 'subtitle', type: 'string', maxLength: 255, nullable: true, example: 'Made to last'),
        new OA\Property(property: 'description', type: 'string', maxLength: 10000, nullable: true, example: 'Custom wood products manufactured in our workshop.'),
        new OA\Property(property: 'button_text', type: 'string', maxLength: 100, nullable: true, example: 'Receive a consultation'),
        new OA\Property(property: 'button_url', type: 'string', maxLength: 2048, nullable: true, example: '#contact'),
        new OA\Property(property: 'sort_order', type: 'integer', minimum: 0, example: 1),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'image', description: 'Replacement image, maximum 5 MB.', type: 'string', format: 'binary', nullable: true),
        new OA\Property(property: 'remove_image', description: 'Remove the existing image when no replacement is uploaded.', type: 'boolean', example: false),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ServiceCreateRequest',
    required: ['title'],
    properties: [
        new OA\Property(property: 'title', type: 'string', maxLength: 255, example: 'Custom furniture'),
        new OA\Property(property: 'slug', description: 'Generated from the title when omitted.', type: 'string', maxLength: 255, nullable: true, example: 'custom-furniture'),
        new OA\Property(property: 'description', type: 'string', maxLength: 10000, nullable: true, example: 'Furniture designed and manufactured to order.'),
        new OA\Property(property: 'sort_order', type: 'integer', minimum: 0, example: 1),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'icon', description: 'Service icon, maximum 2 MB.', type: 'string', format: 'binary', nullable: true),
        new OA\Property(property: 'image', description: 'Service image, maximum 5 MB.', type: 'string', format: 'binary', nullable: true),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ServiceUpdateRequest',
    properties: [
        new OA\Property(property: '_method', description: 'Set to PATCH when multipart data is sent using HTTP POST method spoofing.', type: 'string', enum: ['PATCH'], example: 'PATCH'),
        new OA\Property(property: 'title', type: 'string', maxLength: 255, example: 'Custom furniture'),
        new OA\Property(property: 'slug', type: 'string', maxLength: 255, nullable: true, example: 'custom-furniture'),
        new OA\Property(property: 'description', type: 'string', maxLength: 10000, nullable: true, example: 'Updated service description.'),
        new OA\Property(property: 'sort_order', type: 'integer', minimum: 0, example: 2),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'icon', description: 'Replacement icon, maximum 2 MB.', type: 'string', format: 'binary', nullable: true),
        new OA\Property(property: 'image', description: 'Replacement image, maximum 5 MB.', type: 'string', format: 'binary', nullable: true),
        new OA\Property(property: 'remove_icon', type: 'boolean', example: false),
        new OA\Property(property: 'remove_image', type: 'boolean', example: false),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductCreateRequest',
    required: ['name'],
    properties: [
        new OA\Property(property: 'name', type: 'string', maxLength: 255, example: 'Oak'),
        new OA\Property(property: 'slug', description: 'Generated from the name when omitted.', type: 'string', maxLength: 255, nullable: true, example: 'oak'),
        new OA\Property(property: 'short_description', type: 'string', maxLength: 1000, nullable: true, example: 'A durable hardwood with a distinctive grain.'),
        new OA\Property(property: 'description', type: 'string', maxLength: 20000, nullable: true, example: 'Oak is suitable for furniture, stairs, and interior details.'),
        new OA\Property(
            property: 'features',
            type: 'array',
            maxItems: 20,
            nullable: true,
            items: new OA\Items(ref: '#/components/schemas/ProductFeature')
        ),
        new OA\Property(property: 'sort_order', description: 'Position among all products.', type: 'integer', minimum: 1, example: 1),
        new OA\Property(property: 'is_active', description: 'At most six products may be published.', type: 'boolean', example: true),
        new OA\Property(property: 'image', description: 'Primary wood image, maximum 5 MB.', type: 'string', format: 'binary', nullable: true),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductUpdateRequest',
    properties: [
        new OA\Property(property: '_method', description: 'Set to PATCH when multipart data is sent using HTTP POST method spoofing.', type: 'string', enum: ['PATCH'], example: 'PATCH'),
        new OA\Property(property: 'name', type: 'string', maxLength: 255, example: 'European Oak'),
        new OA\Property(property: 'slug', type: 'string', maxLength: 255, nullable: true, example: 'european-oak'),
        new OA\Property(property: 'short_description', type: 'string', maxLength: 1000, nullable: true, example: 'Updated short description.'),
        new OA\Property(property: 'description', type: 'string', maxLength: 20000, nullable: true, example: 'Updated detailed description.'),
        new OA\Property(
            property: 'features',
            type: 'array',
            maxItems: 20,
            nullable: true,
            items: new OA\Items(ref: '#/components/schemas/ProductFeature')
        ),
        new OA\Property(property: 'sort_order', description: 'Position among all products.', type: 'integer', minimum: 1, example: 2),
        new OA\Property(property: 'is_active', description: 'At most six products may be published.', type: 'boolean', example: true),
        new OA\Property(property: 'image', description: 'Replacement primary image, maximum 5 MB.', type: 'string', format: 'binary', nullable: true),
        new OA\Property(property: 'remove_image', type: 'boolean', example: false),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImageCreateRequest',
    required: ['image'],
    properties: [
        new OA\Property(property: 'image', description: 'Gallery image, maximum 5 MB.', type: 'string', format: 'binary'),
        new OA\Property(property: 'alt_text', type: 'string', maxLength: 255, nullable: true, example: 'Finished oak dining table'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImageUpdateRequest',
    required: ['alt_text'],
    properties: [
        new OA\Property(property: 'alt_text', type: 'string', maxLength: 255, nullable: true, example: 'Finished oak dining table'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImageReorderRequest',
    required: ['image_ids'],
    properties: [
        new OA\Property(
            property: 'image_ids',
            description: 'Every image ID belonging to the product, in the desired order.',
            type: 'array',
            example: [12, 10, 11],
            items: new OA\Items(type: 'integer')
        ),
    ],
    type: 'object'
)]
final class RequestSchemas {}
