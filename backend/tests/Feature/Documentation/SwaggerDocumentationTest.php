<?php

namespace Tests\Feature\Documentation;

use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Tests\TestCase;

class SwaggerDocumentationTest extends TestCase
{
    private static bool $documentationGenerated = false;

    protected function setUp(): void
    {
        parent::setUp();

        if (! self::$documentationGenerated) {
            $this->assertSame(0, Artisan::call('l5-swagger:generate'));
            self::$documentationGenerated = true;
        }
    }

    public function test_swagger_ui_and_openapi_json_are_available(): void
    {
        $this->get('/api/documentation')
            ->assertOk()
            ->assertSee('BIO CWT API Documentation')
            ->assertSee('SwaggerUIBundle');

        $this->getJson('/docs')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/json')
            ->assertJsonPath('openapi', '3.0.0')
            ->assertJsonPath('info.title', 'BIO CWT API');
    }

    public function test_every_application_api_route_has_a_documented_operation(): void
    {
        $document = $this->openApiDocument();
        $documentedOperations = [];

        foreach ($document['paths'] as $path => $pathItem) {
            foreach (['get', 'post', 'put', 'patch', 'delete'] as $method) {
                if (isset($pathItem[$method])) {
                    $documentedOperations[] = strtoupper($method).' '.$path;
                }
            }
        }

        $applicationOperations = collect(app('router')->getRoutes()->getRoutes())
            ->filter(fn (Route $route): bool => Str::startsWith($route->uri(), 'api/'))
            ->reject(fn (Route $route): bool => Str::contains(
                $route->getActionName(),
                'L5Swagger\\'
            ))
            ->flatMap(function (Route $route): array {
                $methods = array_values(array_diff($route->methods(), ['HEAD']));

                // Laravel apiResource registers PUT and PATCH as one update route.
                // PATCH is the documented canonical update operation.
                if (in_array('PATCH', $methods, true)) {
                    $methods = array_values(array_diff($methods, ['PUT']));
                }

                return array_map(
                    fn (string $method): string => $method.' /'.$route->uri(),
                    $methods
                );
            })
            ->sort()
            ->values()
            ->all();

        sort($documentedOperations);

        $this->assertCount(35, $applicationOperations);
        $this->assertSame($applicationOperations, $documentedOperations);
    }

    public function test_operations_have_metadata_and_protected_routes_use_jwt(): void
    {
        $document = $this->openApiDocument();

        $this->assertSame(
            'bearer',
            $document['components']['securitySchemes']['bearerAuth']['scheme']
        );
        $this->assertSame(
            'cookie',
            $document['components']['securitySchemes']['refreshCookie']['in']
        );

        foreach ($document['paths'] as $path => $pathItem) {
            foreach (['get', 'post', 'put', 'patch', 'delete'] as $method) {
                if (! isset($pathItem[$method])) {
                    continue;
                }

                $operation = $pathItem[$method];
                $this->assertNotEmpty($operation['operationId'] ?? null);
                $this->assertNotEmpty($operation['summary'] ?? null);
                $this->assertNotEmpty($operation['tags'] ?? null);
                $this->assertNotEmpty($operation['responses'] ?? null);

                if (Str::startsWith($path, '/api/admin/') || $path === '/api/auth/me') {
                    $securitySchemes = collect($operation['security'] ?? [])
                        ->flatMap(fn (array $requirement): array => array_keys($requirement));

                    $this->assertTrue(
                        $securitySchemes->contains('bearerAuth'),
                        "JWT security is missing from {$method} {$path}."
                    );
                }
            }
        }
    }

    public function test_schema_references_and_multipart_contracts_are_valid(): void
    {
        $document = $this->openApiDocument();
        $schemas = array_keys($document['components']['schemas']);
        $json = json_encode($document, JSON_THROW_ON_ERROR);

        preg_match_all(
            '#/components/schemas/([^"/]+)#',
            $json,
            $matches
        );

        $missingSchemas = array_values(array_diff(
            array_unique($matches[1]),
            $schemas
        ));

        $this->assertGreaterThanOrEqual(41, count($schemas));
        $this->assertSame([], $missingSchemas);
        $this->assertSame(
            '#/components/schemas/ProductCreateRequest',
            $document['paths']['/api/admin/products']['post']['requestBody']['content']['multipart/form-data']['schema']['$ref']
        );
        $this->assertSame(
            'binary',
            $document['components']['schemas']['ProductCreateRequest']['properties']['image']['format']
        );
        $this->assertFalse(
            $document['components']['schemas']['ProductFeature']['example']['positive']
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function openApiDocument(): array
    {
        $path = storage_path('api-docs/api-docs.json');

        $this->assertFileExists($path);

        return json_decode(
            file_get_contents($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    }
}
