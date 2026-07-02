<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AdminProductEndpoints
{
    #[OA\Get(
        path: '/api/admin/products',
        operationId: 'listProducts',
        summary: 'List products and wood types',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'All products with their gallery images, ordered by position.', content: new OA\JsonContent(ref: '#/components/schemas/ProductCollectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(): void {}

    #[OA\Post(
        path: '/api/admin/products',
        operationId: 'createProduct',
        summary: 'Create a product or wood type',
        description: 'Creates and positions a product. No more than six products may be published at the same time.',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/ProductCreateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Product created.', content: new OA\JsonContent(ref: '#/components/schemas/ProductResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Submitted fields failed validation or six products are already published.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function store(): void {}

    #[OA\Get(
        path: '/api/admin/products/{product}',
        operationId: 'showProduct',
        summary: 'Get a product or wood type',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Product with gallery images.', content: new OA\JsonContent(ref: '#/components/schemas/ProductResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function show(): void {}

    #[OA\Patch(
        path: '/api/admin/products/{product}',
        operationId: 'updateProduct',
        summary: 'Update a product or wood type',
        description: 'Updates product content, publication state, position, features, and optional primary image. HTTP PUT is also accepted. For multipart POST method spoofing, include _method=PATCH.',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/ProductUpdateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Product updated.', content: new OA\JsonContent(ref: '#/components/schemas/ProductResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Submitted fields failed validation or six products are already published.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/admin/products/{product}',
        operationId: 'deleteProduct',
        summary: 'Delete a product or wood type',
        description: 'Deletes the product, its primary image, its gallery images, and then normalizes remaining positions.',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Product deleted. No response body.'),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function destroy(): void {}

    #[OA\Patch(
        path: '/api/admin/products/{product}/work-gallery',
        operationId: 'selectWorkGallery',
        summary: 'Select the product gallery shown in Our Work',
        description: 'Marks this product as the single Our Work gallery source and unselects any previously selected product. The product does not need to be published.',
        tags: ['Admin Products'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Our Work gallery selected.', content: new OA\JsonContent(ref: '#/components/schemas/ProductResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function selectWorkGallery(): void {}
}
