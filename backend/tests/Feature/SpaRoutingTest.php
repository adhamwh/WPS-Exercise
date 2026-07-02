<?php

namespace Tests\Feature;

use Tests\TestCase;

class SpaRoutingTest extends TestCase
{
    public function test_public_and_admin_paths_return_the_react_shell(): void
    {
        $this->withoutVite();

        foreach ([
            '/',
            '/gallery',
            '/login',
            '/admin',
            '/admin/products',
            '/a-route-handled-by-react',
        ] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('<div id="root"></div>', false)
                ->assertSee('BIOCWT - Pixel38');
        }
    }

    public function test_spa_fallback_does_not_intercept_backend_paths(): void
    {
        $this->getJson('/api/a-route-that-does-not-exist')
            ->assertNotFound()
            ->assertJsonMissing(['BIOCWT - Pixel38']);

        $this->get('/up')->assertOk();
    }
}
