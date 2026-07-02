<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AdminServiceEndpoints
{
    #[OA\Get(
        path: '/api/admin/services',
        operationId: 'listAdminServices',
        summary: 'List services',
        tags: ['Admin Services'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'All services ordered by position.', content: new OA\JsonContent(ref: '#/components/schemas/ServiceCollectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(): void {}

    #[OA\Post(
        path: '/api/admin/services',
        operationId: 'createService',
        summary: 'Create a service',
        tags: ['Admin Services'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/ServiceCreateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Service created.', content: new OA\JsonContent(ref: '#/components/schemas/ServiceResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 422, description: 'Submitted fields failed validation.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function store(): void {}

    #[OA\Get(
        path: '/api/admin/services/{service}',
        operationId: 'showService',
        summary: 'Get a service',
        tags: ['Admin Services'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Service ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Service.', content: new OA\JsonContent(ref: '#/components/schemas/ServiceResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Service not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function show(): void {}

    #[OA\Patch(
        path: '/api/admin/services/{service}',
        operationId: 'updateService',
        summary: 'Update a service',
        description: 'Updates service content and optional media. HTTP PUT is also accepted. For multipart POST method spoofing, include _method=PATCH.',
        tags: ['Admin Services'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Service ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/ServiceUpdateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Service updated.', content: new OA\JsonContent(ref: '#/components/schemas/ServiceResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Service not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Submitted fields failed validation.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/api/admin/services/{service}',
        operationId: 'deleteService',
        summary: 'Delete a service',
        description: 'Deletes the service and its stored icon and image.',
        tags: ['Admin Services'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Service ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Service deleted. No response body.'),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Service not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function destroy(): void {}
}
