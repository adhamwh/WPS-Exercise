<?php

namespace App\OpenApi\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    required: ['id', 'name', 'email'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Admin User'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@example.com'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'HomepageSection',
    required: ['id', 'key', 'sort_order', 'is_active', 'updated_at'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'key', type: 'string', example: 'hero'),
        new OA\Property(property: 'title', type: 'string', nullable: true, example: 'Solid wood products'),
        new OA\Property(property: 'subtitle', type: 'string', nullable: true, example: 'Made to last'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Custom products manufactured in our own workshop.'),
        new OA\Property(property: 'button_text', type: 'string', nullable: true, example: 'Receive a consultation'),
        new OA\Property(property: 'button_url', type: 'string', nullable: true, example: '#contact'),
        new OA\Property(property: 'image_path', type: 'string', nullable: true, example: 'homepage-sections/1/hero.jpg'),
        new OA\Property(property: 'image_url', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/storage/homepage-sections/1/hero.jpg'),
        new OA\Property(property: 'sort_order', type: 'integer', example: 1),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-07-02T10:30:00.000000Z'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Service',
    required: ['id', 'title', 'slug', 'sort_order', 'is_active', 'updated_at'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'title', type: 'string', example: 'Custom furniture'),
        new OA\Property(property: 'slug', type: 'string', example: 'custom-furniture'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Furniture designed and manufactured to order.'),
        new OA\Property(property: 'icon_path', type: 'string', nullable: true, example: 'services/1/icons/icon.svg'),
        new OA\Property(property: 'icon_url', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/storage/services/1/icons/icon.svg'),
        new OA\Property(property: 'image_path', type: 'string', nullable: true, example: 'services/1/service.jpg'),
        new OA\Property(property: 'image_url', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/storage/services/1/service.jpg'),
        new OA\Property(property: 'sort_order', type: 'integer', example: 1),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-07-02T10:30:00.000000Z'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductFeature',
    required: ['label', 'positive'],
    properties: [
        new OA\Property(property: 'label', type: 'string', maxLength: 100, example: 'Durability'),
        new OA\Property(property: 'positive', description: 'True displays a check mark; false displays an X.', type: 'boolean', example: true),
    ],
    type: 'object',
    example: ['label' => 'Expensive', 'positive' => false]
)]
#[OA\Schema(
    schema: 'ProductSummary',
    required: ['id', 'name'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Oak'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ProductImage',
    required: ['id', 'product_id', 'image_path', 'image_url', 'sort_order', 'updated_at'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 10),
        new OA\Property(property: 'product_id', type: 'integer', example: 1),
        new OA\Property(property: 'image_path', type: 'string', example: 'products/1/gallery/table.jpg'),
        new OA\Property(property: 'image_url', type: 'string', format: 'uri', example: 'https://example.com/storage/products/1/gallery/table.jpg'),
        new OA\Property(property: 'alt_text', type: 'string', nullable: true, example: 'Finished oak dining table'),
        new OA\Property(property: 'sort_order', type: 'integer', example: 0),
        new OA\Property(property: 'product', ref: '#/components/schemas/ProductSummary'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-07-02T10:30:00.000000Z'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Product',
    required: ['id', 'name', 'slug', 'sort_order', 'is_active', 'is_work_gallery', 'updated_at'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Oak'),
        new OA\Property(property: 'slug', type: 'string', example: 'oak'),
        new OA\Property(property: 'short_description', type: 'string', nullable: true, example: 'A durable hardwood with a distinctive grain.'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Oak is suitable for furniture, stairs, and interior details.'),
        new OA\Property(
            property: 'features',
            type: 'array',
            nullable: true,
            items: new OA\Items(ref: '#/components/schemas/ProductFeature')
        ),
        new OA\Property(property: 'image_path', type: 'string', nullable: true, example: 'products/1/primary/oak.jpg'),
        new OA\Property(property: 'image_url', type: 'string', format: 'uri', nullable: true, example: 'https://example.com/storage/products/1/primary/oak.jpg'),
        new OA\Property(property: 'sort_order', type: 'integer', example: 1),
        new OA\Property(property: 'is_active', type: 'boolean', example: true),
        new OA\Property(property: 'is_work_gallery', type: 'boolean', example: false),
        new OA\Property(
            property: 'images',
            description: 'Included on protected product endpoints.',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/ProductImage')
        ),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time', example: '2026-07-02T10:30:00.000000Z'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContactMessage',
    required: ['id', 'name', 'telephone', 'question', 'is_read', 'created_at'],
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 25),
        new OA\Property(property: 'name', type: 'string', example: 'Jane Smith'),
        new OA\Property(property: 'telephone', type: 'string', example: '420123456789'),
        new OA\Property(property: 'question', type: 'string', example: 'Could you provide a quote for a custom oak table?'),
        new OA\Property(property: 'is_read', type: 'boolean', example: false),
        new OA\Property(property: 'read_at', type: 'string', format: 'date-time', nullable: true, example: null),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time', example: '2026-07-02T10:30:00.000000Z'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'PublicContent',
    required: ['sections', 'wood_types', 'services', 'gallery'],
    properties: [
        new OA\Property(
            property: 'sections',
            description: 'Published homepage sections keyed by their unique section key.',
            type: 'object',
            additionalProperties: new OA\AdditionalProperties(ref: '#/components/schemas/HomepageSection')
        ),
        new OA\Property(
            property: 'wood_types',
            type: 'array',
            maxItems: 6,
            items: new OA\Items(ref: '#/components/schemas/Product')
        ),
        new OA\Property(
            property: 'services',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/Service')
        ),
        new OA\Property(
            property: 'gallery',
            type: 'array',
            items: new OA\Items(ref: '#/components/schemas/ProductImage')
        ),
    ],
    type: 'object'
)]
final class ResourceSchemas {}
