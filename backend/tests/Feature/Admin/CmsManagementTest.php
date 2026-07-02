<?php

namespace Tests\Feature\Admin;

use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class CmsManagementTest extends TestCase
{
    use RefreshDatabase;

    private string $accessToken;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->accessToken = JWTAuth::fromUser(User::factory()->create());
    }

    public function test_cms_routes_require_authentication(): void
    {
        $this->get('/api/admin/services')
            ->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_admin_can_update_a_homepage_section_and_its_image(): void
    {
        $section = HomepageSection::query()->create([
            'key' => 'hero',
            'title' => 'Old title',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->withToken($this->accessToken)->post(
            "/api/admin/homepage-sections/{$section->id}",
            [
                '_method' => 'PATCH',
                'title' => 'Updated hero',
                'description' => 'Updated homepage copy.',
                'image' => $this->png('hero.png'),
            ],
            ['Accept' => 'application/json']
        );

        $response
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated hero')
            ->assertJsonPath('data.description', 'Updated homepage copy.');

        $path = $response->json('data.image_path');
        Storage::disk('public')->assertExists($path);
        $this->assertDatabaseHas('homepage_sections', [
            'id' => $section->id,
            'title' => 'Updated hero',
            'image_path' => $path,
        ]);
    }

    public function test_admin_can_create_update_and_delete_services(): void
    {
        $firstResponse = $this->withToken($this->accessToken)
            ->postJson('/api/admin/services', [
                'title' => 'Custom Design',
                'description' => 'Made to measure.',
                'sort_order' => 2,
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'custom-design');

        $secondResponse = $this->postJson('/api/admin/services', [
            'title' => 'Custom Design',
            'description' => 'A second service.',
        ])->assertCreated()->assertJsonPath('data.slug', 'custom-design-2');

        $serviceId = $secondResponse->json('data.id');

        $this->patchJson("/api/admin/services/{$serviceId}", [
            'title' => 'Installation',
            'slug' => 'installation',
            'is_active' => false,
        ])->assertOk()
            ->assertJsonPath('data.title', 'Installation')
            ->assertJsonPath('data.is_active', false);

        $this->deleteJson("/api/admin/services/{$serviceId}")
            ->assertNoContent();

        $this->assertDatabaseHas('services', [
            'id' => $firstResponse->json('data.id'),
        ]);
        $this->assertDatabaseMissing('services', ['id' => $serviceId]);
    }

    public function test_admin_can_create_update_and_delete_products(): void
    {
        $response = $this->withToken($this->accessToken)
            ->postJson('/api/admin/products', [
                'name' => 'Walnut',
                'short_description' => 'Dark hardwood.',
                'features' => [
                    ['label' => 'Durable', 'positive' => true],
                    ['label' => 'Premium price', 'positive' => false],
                ],
                'sort_order' => 1,
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'walnut')
            ->assertJsonCount(2, 'data.features');

        $productId = $response->json('data.id');

        $this->patchJson("/api/admin/products/{$productId}", [
            'name' => 'American Walnut',
            'slug' => 'american-walnut',
            'short_description' => 'Updated description.',
        ])->assertOk()
            ->assertJsonPath('data.slug', 'american-walnut');

        $this->deleteJson("/api/admin/products/{$productId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_product_feature_checkbox_values_are_saved_as_booleans(): void
    {
        $response = $this->withToken($this->accessToken)->post(
            '/api/admin/products',
            [
                'name' => 'Maple',
                'features' => [
                    ['label' => 'Durable', 'positive' => '1'],
                    ['label' => 'Expensive', 'positive' => '0'],
                ],
                'sort_order' => '1',
                'is_active' => '1',
            ],
            ['Accept' => 'application/json']
        );

        $response
            ->assertCreated()
            ->assertJsonPath('data.features.0.positive', true)
            ->assertJsonPath('data.features.1.positive', false);

        $response = $this->post(
            "/api/admin/products/{$response->json('data.id')}",
            [
                '_method' => 'PATCH',
                'features' => [
                    ['label' => 'Durable', 'positive' => '0'],
                    ['label' => 'Expensive', 'positive' => '1'],
                ],
            ],
            ['Accept' => 'application/json']
        );

        $response
            ->assertOk()
            ->assertJsonPath('data.features.0.positive', false)
            ->assertJsonPath('data.features.1.positive', true);

        $features = Product::query()->findOrFail(
            $response->json('data.id')
        )->features;

        $this->assertFalse($features[0]['positive']);
        $this->assertTrue($features[1]['positive']);
    }

    public function test_legacy_string_feature_values_are_returned_as_booleans(): void
    {
        $productId = DB::table('products')->insertGetId([
            'name' => 'Legacy product',
            'slug' => 'legacy-product',
            'features' => json_encode([
                ['label' => 'Durable', 'positive' => '1'],
                ['label' => 'Expensive', 'positive' => '0'],
            ], JSON_THROW_ON_ERROR),
            'sort_order' => 1,
            'is_active' => true,
            'is_work_gallery' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $features = Product::query()->findOrFail($productId)->features;

        $this->assertTrue($features[0]['positive']);
        $this->assertFalse($features[1]['positive']);
    }

    public function test_product_positions_are_bounded_and_renumbered(): void
    {
        $first = $this->withToken($this->accessToken)
            ->postJson('/api/admin/products', [
                'name' => 'Oak',
                'sort_order' => 1,
                'is_active' => false,
            ])->assertCreated();
        $second = $this->postJson('/api/admin/products', [
            'name' => 'Ash',
            'sort_order' => 2,
            'is_active' => false,
        ])->assertCreated();
        $third = $this->postJson('/api/admin/products', [
            'name' => 'Beech',
            'sort_order' => 2,
            'is_active' => false,
        ])->assertCreated();
        $firstId = $first->json('data.id');
        $secondId = $second->json('data.id');
        $thirdId = $third->json('data.id');

        $this->assertDatabaseHas('products', [
            'id' => $firstId,
            'sort_order' => 1,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $thirdId,
            'sort_order' => 2,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $secondId,
            'sort_order' => 3,
        ]);

        $this->patchJson("/api/admin/products/{$firstId}", [
            'sort_order' => 3,
        ])->assertOk()->assertJsonPath('data.sort_order', 3);

        $this->deleteJson("/api/admin/products/{$thirdId}")
            ->assertNoContent();

        $this->assertSame(
            [1, 2],
            Product::query()->orderBy('sort_order')->pluck('sort_order')->all()
        );

        $this->postJson('/api/admin/products', [
            'name' => 'Invalid position',
            'sort_order' => 9,
            'is_active' => false,
        ])->assertUnprocessable()->assertJsonValidationErrors('sort_order');
    }

    public function test_no_more_than_six_products_can_be_published(): void
    {
        foreach (range(1, Product::MAX_PUBLISHED) as $position) {
            Product::query()->create([
                'name' => "Product {$position}",
                'slug' => "product-{$position}",
                'sort_order' => $position,
                'is_active' => true,
            ]);
        }

        $hidden = Product::query()->create([
            'name' => 'Hidden product',
            'slug' => 'hidden-product',
            'sort_order' => Product::MAX_PUBLISHED + 1,
            'is_active' => false,
        ]);

        $this->withToken($this->accessToken)
            ->patchJson("/api/admin/products/{$hidden->id}", [
                'is_active' => true,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('is_active');

        $this->assertFalse($hidden->refresh()->is_active);
    }

    public function test_admin_can_upload_edit_reorder_and_delete_product_images(): void
    {
        $product = Product::query()->create([
            'name' => 'Oak',
            'slug' => 'oak',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $first = $this->withToken($this->accessToken)->post(
            "/api/admin/products/{$product->id}/images",
            [
                'image' => $this->png('oak-one.png'),
                'alt_text' => 'Oak table',
            ],
            ['Accept' => 'application/json']
        )->assertCreated();

        $second = $this->post(
            "/api/admin/products/{$product->id}/images",
            [
                'image' => $this->png('oak-two.png'),
                'alt_text' => 'Oak boards',
            ],
            ['Accept' => 'application/json']
        )->assertCreated();

        $firstId = $first->json('data.id');
        $secondId = $second->json('data.id');

        $this->patchJson("/api/admin/products/{$product->id}/images/reorder", [
            'image_ids' => [$secondId, $firstId],
        ])->assertOk()
            ->assertJsonPath('data.0.id', $secondId)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.1.id', $firstId)
            ->assertJsonPath('data.1.sort_order', 1);

        $this->patchJson("/api/admin/product-images/{$firstId}", [
            'alt_text' => 'Finished oak table',
        ])->assertOk()->assertJsonPath('data.alt_text', 'Finished oak table');

        $firstPath = $first->json('data.image_path');
        $this->deleteJson("/api/admin/product-images/{$firstId}")
            ->assertNoContent();

        Storage::disk('public')->assertMissing($firstPath);
        $this->assertDatabaseMissing('product_images', ['id' => $firstId]);
        $this->assertDatabaseHas('product_images', ['id' => $secondId]);
    }

    public function test_admin_can_select_exactly_one_gallery_for_our_work(): void
    {
        $oak = Product::query()->create([
            'name' => 'Oak',
            'slug' => 'oak',
            'is_active' => true,
        ]);
        $project = Product::query()->create([
            'name' => 'Project gallery',
            'slug' => 'project-gallery',
            'is_active' => false,
        ]);

        $this->withToken($this->accessToken)
            ->patchJson("/api/admin/products/{$oak->id}/work-gallery")
            ->assertOk()
            ->assertJsonPath('data.is_work_gallery', true);

        $this->patchJson("/api/admin/products/{$project->id}/work-gallery")
            ->assertOk()
            ->assertJsonPath('data.id', $project->id)
            ->assertJsonPath('data.is_active', false)
            ->assertJsonPath('data.is_work_gallery', true);

        $this->assertFalse($oak->refresh()->is_work_gallery);
        $this->assertTrue($project->refresh()->is_work_gallery);
        $this->assertSame(1, Product::query()->where('is_work_gallery', true)->count());
    }

    public function test_product_image_reorder_rejects_incomplete_lists(): void
    {
        $product = Product::query()->create([
            'name' => 'Ash',
            'slug' => 'ash',
            'is_active' => true,
        ]);
        $first = ProductImage::query()->create([
            'product_id' => $product->id,
            'image_path' => 'products/ash-one.png',
            'sort_order' => 0,
        ]);
        ProductImage::query()->create([
            'product_id' => $product->id,
            'image_path' => 'products/ash-two.png',
            'sort_order' => 1,
        ]);

        $this->withToken($this->accessToken)
            ->patchJson("/api/admin/products/{$product->id}/images/reorder", [
                'image_ids' => [$first->id],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image_ids');
    }

    private function png(string $name): UploadedFile
    {
        return UploadedFile::fake()->createWithContent(
            $name,
            base64_decode(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
            )
        );
    }
}
