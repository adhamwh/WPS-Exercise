<?php

namespace Tests\Feature\Public;

use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicContentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    public function test_public_pages_return_active_cms_content_with_media_urls(): void
    {
        HomepageSection::query()->create([
            'key' => 'hero',
            'title' => 'Managed hero',
            'image_path' => 'homepage/hero.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        HomepageSection::query()->create([
            'key' => 'hidden',
            'title' => 'Hidden section',
            'sort_order' => 2,
            'is_active' => false,
        ]);

        $product = Product::query()->create([
            'name' => 'Walnut',
            'slug' => 'walnut',
            'image_path' => 'products/walnut.jpg',
            'sort_order' => 1,
            'is_active' => true,
            'is_work_gallery' => true,
        ]);
        $image = ProductImage::query()->create([
            'product_id' => $product->id,
            'image_path' => 'products/gallery/walnut-table.jpg',
            'alt_text' => 'Walnut table',
            'sort_order' => 0,
        ]);
        Product::query()->create([
            'name' => 'Hidden product',
            'slug' => 'hidden-product',
            'sort_order' => 2,
            'is_active' => false,
        ]);

        Service::query()->create([
            'title' => 'Installation',
            'slug' => 'installation',
            'image_path' => 'services/installation.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        Service::query()->create([
            'title' => 'Hidden service',
            'slug' => 'hidden-service',
            'sort_order' => 2,
            'is_active' => false,
        ]);

        foreach (['homepage', 'gallery', 'services', 'about', 'contact', 'not-found'] as $page) {
            $this->getJson("/api/{$page}")
                ->assertOk()
                ->assertJsonPath('sections.hero.title', 'Managed hero')
                ->assertJsonPath(
                    'sections.hero.image_url',
                    Storage::disk('public')->url('homepage/hero.jpg')
                )
                ->assertJsonMissingPath('sections.hidden')
                ->assertJsonCount(1, 'wood_types')
                ->assertJsonPath('wood_types.0.name', 'Walnut')
                ->assertJsonPath(
                    'wood_types.0.image_url',
                    Storage::disk('public')->url('products/walnut.jpg')
                )
                ->assertJsonMissingPath('wood_types.0.images')
                ->assertJsonCount(1, 'services')
                ->assertJsonPath('services.0.title', 'Installation')
                ->assertJsonCount(1, 'gallery')
                ->assertJsonPath('gallery.0.alt_text', 'Walnut table')
                ->assertJsonPath('gallery.0.product.name', 'Walnut');
        }
    }

    public function test_gallery_uses_only_the_selected_product_independent_of_publication(): void
    {
        $selectedProduct = Product::query()->create([
            'name' => 'Private project gallery',
            'slug' => 'private-project-gallery',
            'is_active' => false,
            'is_work_gallery' => true,
        ]);
        ProductImage::query()->create([
            'product_id' => $selectedProduct->id,
            'image_path' => 'products/private-project.jpg',
            'alt_text' => 'Selected project',
            'sort_order' => 0,
        ]);

        $publishedProduct = Product::query()->create([
            'name' => 'Published oak',
            'slug' => 'published-oak',
            'is_active' => true,
            'is_work_gallery' => false,
        ]);
        ProductImage::query()->create([
            'product_id' => $publishedProduct->id,
            'image_path' => 'products/published-oak.jpg',
            'alt_text' => 'Unselected project',
            'sort_order' => 0,
        ]);

        $this->getJson('/api/gallery')
            ->assertOk()
            ->assertJsonCount(1, 'wood_types')
            ->assertJsonPath('wood_types.0.name', 'Published oak')
            ->assertJsonCount(1, 'gallery')
            ->assertJsonPath('gallery.0.alt_text', 'Selected project')
            ->assertJsonPath('gallery.0.product.name', 'Private project gallery')
            ->assertJsonMissing(['alt_text' => 'Unselected project']);
    }

    public function test_public_pages_never_return_more_than_six_products(): void
    {
        foreach (range(1, Product::MAX_PUBLISHED + 1) as $position) {
            Product::query()->create([
                'name' => "Wood {$position}",
                'slug' => "wood-{$position}",
                'sort_order' => $position,
                'is_active' => true,
            ]);
        }

        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonCount(Product::MAX_PUBLISHED, 'wood_types')
            ->assertJsonPath('wood_types.0.name', 'Wood 1')
            ->assertJsonPath('wood_types.5.name', 'Wood 6')
            ->assertJsonMissing(['name' => 'Wood 7']);
    }

    public function test_content_version_changes_when_public_content_is_updated(): void
    {
        $before = $this->getJson('/api/content-version')
            ->assertOk()
            ->assertHeader('Cache-Control', 'must-revalidate, no-cache, no-store, private')
            ->json('version');

        Product::query()->create([
            'name' => 'Live update product',
            'slug' => 'live-update-product',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $after = $this->getJson('/api/content-version')
            ->assertOk()
            ->json('version');

        $this->assertNotSame($before, $after);
    }
}
