<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AdminHomepageEndpoints
{
    #[OA\Get(
        path: '/api/admin/homepage-sections',
        operationId: 'listHomepageSections',
        summary: 'List homepage sections',
        tags: ['Admin Homepage'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 200, description: 'All homepage sections ordered by position.', content: new OA\JsonContent(ref: '#/components/schemas/HomepageSectionCollectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(): void {}

    #[OA\Get(
        path: '/api/admin/homepage-sections/{homepage_section}',
        operationId: 'showHomepageSection',
        summary: 'Get a homepage section',
        tags: ['Admin Homepage'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'homepage_section', description: 'Homepage section ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Homepage section.', content: new OA\JsonContent(ref: '#/components/schemas/HomepageSectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Homepage section not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function show(): void {}

    #[OA\Patch(
        path: '/api/admin/homepage-sections/{homepage_section}',
        operationId: 'updateHomepageSection',
        summary: 'Update a homepage section',
        description: 'Updates text, publication state, ordering, and optional imagery. HTTP PUT is also accepted. For multipart POST method spoofing, include _method=PATCH.',
        tags: ['Admin Homepage'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'homepage_section', description: 'Homepage section ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/HomepageSectionUpdateRequest')
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Homepage section updated.', content: new OA\JsonContent(ref: '#/components/schemas/HomepageSectionResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Homepage section not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
            new OA\Response(response: 422, description: 'Submitted fields failed validation.', content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')),
        ]
    )]
    public function update(): void {}
}
