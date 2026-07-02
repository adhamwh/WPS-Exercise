<?php

namespace App\OpenApi\Endpoints;

use OpenApi\Attributes as OA;

final class PublicEndpoints
{
    #[OA\Get(
        path: '/api/homepage',
        operationId: 'getHomepageContent',
        summary: 'Get content for the homepage',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function homepage(): void {}

    #[OA\Get(
        path: '/api/gallery',
        operationId: 'getGalleryContent',
        summary: 'Get content for the gallery page',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function gallery(): void {}

    #[OA\Get(
        path: '/api/services',
        operationId: 'getServicesContent',
        summary: 'Get content for the services page',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function services(): void {}

    #[OA\Get(
        path: '/api/about',
        operationId: 'getAboutContent',
        summary: 'Get content for the about page',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function about(): void {}

    #[OA\Get(
        path: '/api/contact',
        operationId: 'getContactContent',
        summary: 'Get content for the contact page',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function contact(): void {}

    #[OA\Get(
        path: '/api/not-found',
        operationId: 'getNotFoundPageContent',
        summary: 'Get content used by the not-found page',
        tags: ['Public Content'],
        responses: [new OA\Response(response: 200, description: 'Published website content.', content: new OA\JsonContent(ref: '#/components/schemas/PublicContent'))]
    )]
    public function notFound(): void {}

    #[OA\Get(
        path: '/api/content-version',
        operationId: 'getContentVersion',
        summary: 'Get the current public-content version',
        description: 'Returns a version identifier that clients can use to detect published content changes.',
        tags: ['Public Content'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Current public-content version.',
                content: new OA\JsonContent(ref: '#/components/schemas/ContentVersionResponse')
            ),
        ]
    )]
    public function contentVersion(): void {}

    #[OA\Post(
        path: '/api/contact-messages',
        operationId: 'submitContactMessage',
        summary: 'Send a contact message',
        description: 'Creates an inbox message. A successful submission is limited to one per IP address every five minutes.',
        tags: ['Contact Messages'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/ContactMessageCreateRequest')
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Message sent.',
                content: new OA\JsonContent(ref: '#/components/schemas/ContactMessageCreatedResponse')
            ),
            new OA\Response(
                response: 422,
                description: 'The submitted message failed validation or the honeypot was filled.',
                content: new OA\JsonContent(ref: '#/components/schemas/ValidationErrorResponse')
            ),
            new OA\Response(
                response: 429,
                description: 'A message was already sent successfully from this IP within the last five minutes.',
                content: new OA\JsonContent(ref: '#/components/schemas/ContactRateLimitResponse')
            ),
        ]
    )]
    public function submitContactMessage(): void {}
}
