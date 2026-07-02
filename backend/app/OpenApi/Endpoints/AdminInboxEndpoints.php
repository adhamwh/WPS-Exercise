<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class AdminInboxEndpoints
{
    #[OA\Get(
        path: '/api/admin/contact-messages',
        operationId: 'listContactMessages',
        summary: 'List inbox messages',
        description: 'Returns messages newest first, with 20 messages per page.',
        tags: ['Admin Inbox'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'page', description: 'Page number.', in: 'query', required: false, schema: new OA\Schema(type: 'integer', minimum: 1, default: 1)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Paginated inbox messages.', content: new OA\JsonContent(ref: '#/components/schemas/ContactMessagePaginatedResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function index(): void {}

    #[OA\Get(
        path: '/api/admin/contact-messages/{contactMessage}',
        operationId: 'showContactMessage',
        summary: 'View an inbox message',
        description: 'Returns the message and marks it as read when it is opened for the first time.',
        tags: ['Admin Inbox'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'contactMessage', description: 'Contact message ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 25)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Contact message.', content: new OA\JsonContent(ref: '#/components/schemas/ContactMessageResponse')),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Contact message not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function show(): void {}

    #[OA\Delete(
        path: '/api/admin/contact-messages/{contactMessage}',
        operationId: 'deleteContactMessage',
        summary: 'Delete an inbox message',
        tags: ['Admin Inbox'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(name: 'contactMessage', description: 'Contact message ID.', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 25)),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Message deleted. No response body.'),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
            new OA\Response(response: 404, description: 'Contact message not found.', content: new OA\JsonContent(ref: '#/components/schemas/NotFoundResponse')),
        ]
    )]
    public function destroy(): void {}

    #[OA\Delete(
        path: '/api/admin/contact-messages',
        operationId: 'clearContactMessages',
        summary: 'Clear the inbox',
        description: 'Permanently deletes every contact message.',
        tags: ['Admin Inbox'],
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 204, description: 'Inbox cleared. No response body.'),
            new OA\Response(response: 401, description: 'Unauthenticated.', content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse')),
        ]
    )]
    public function clear(): void {}
}
