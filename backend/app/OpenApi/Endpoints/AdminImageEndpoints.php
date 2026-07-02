<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AdminImageEndpoints
{
    #[OA\Get(
        path: '/api/admin/product-images',
        operationId: 'listProductImages',
        summary: 'List product gallery images',
        description: 'Returns all gallery images grouped by product order and image position.',
        tags: ['Admin Images'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'All product gallery images.', content: new OA\JsonContent(ref: '#/components/schemas/ProductImageCollectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(): void {}

    #[OA\Post(
        path: '/api/admin/products/{product}/images',
        operationId: 'uploadProductImage',
        summary: 'Upload a product gallery image',
        tags: ['Admin Images'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/ProductImageCreateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Gallery image uploaded.', content: new OA\JsonContent(ref: '#/components/schemas/ProductImageResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'The image or alternative text failed validation.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function store(): void {}

    #[OA\Patch(
        path: '/api/admin/products/{product}/images/reorder',
        operationId: 'reorderProductImages',
        summary: 'Reorder a product gallery',
        description: 'The request must contain every image ID belonging to the product exactly once, in the desired order.',
        tags: ['Admin Images'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'product', description: 'Product ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/ProductImageReorderRequest')
        ),
        responses: [
            new OA\Response(response: 200, description: 'Images returned in their new order.', content: new OA\JsonContent(ref: '#/components/schemas/ProductImageCollectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'The submitted IDs are invalid, incomplete, duplicated, or belong to another product.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function reorder(): void {}

    #[OA\Patch(
        path: '/api/admin/product-images/{productImage}',
        operationId: 'updateProductImage',
        summary: 'Update product-image alternative text',
        tags: ['Admin Images'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'productImage', description: 'Product image ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 10)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/ProductImageUpdateRequest')
        ),
        responses: [
            new OA\Response(response: 200, description: 'Product image updated.', content: new OA\JsonContent(ref: '#/components/schemas/ProductImageResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product image not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Alternative text failed validation.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/admin/product-images/{productImage}',
        operationId: 'deleteProductImage',
        summary: 'Delete a product gallery image',
        description: 'Deletes the image record and stored file.',
        tags: ['Admin Images'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'productImage', description: 'Product image ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 10)),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Product image deleted. No response body.'),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Product image not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function destroy(): void {}
}
