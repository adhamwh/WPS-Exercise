<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\Media\ImageStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function __construct(private readonly ImageStorageService $images) {}

    public function index(): AnonymousResourceCollection
    {
        return ProductResource::collection(
            Product::query()
                ->with('images')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);
        $data['slug'] = $this->makeSlug(
            $data['slug'] ?? null,
            $data['name']
        );
        $position = (int) ($data['sort_order'] ?? Product::query()->count() + 1);
        unset($data['sort_order']);

        $product = DB::transaction(function () use ($data, $position): Product {
            $product = Product::query()->create([
                ...$data,
                'sort_order' => Product::query()->count() + 1,
            ]);
            $this->placeAt($product, $position);

            return $product;
        });

        if ($request->hasFile('image')) {
            $product->update([
                'image_path' => $this->images->store(
                    $request->file('image'),
                    "products/{$product->id}/primary"
                ),
            ]);
        }

        return (new ProductResource($product->refresh()->load('images')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load('images'));
    }

    public function update(
        ProductRequest $request,
        Product $product
    ): ProductResource {
        $data = $request->safe()->except(['image', 'remove_image']);
        $position = array_key_exists('sort_order', $data)
            ? (int) $data['sort_order']
            : null;
        unset($data['sort_order']);

        if (array_key_exists('slug', $data)) {
            $data['slug'] = $this->makeSlug(
                $data['slug'],
                $data['name'] ?? $product->name,
                $product->id
            );
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $this->images->replace(
                $product->image_path,
                $request->file('image'),
                "products/{$product->id}/primary"
            );
        } elseif ($request->boolean('remove_image')) {
            $this->images->delete($product->image_path);
            $data['image_path'] = null;
        }

        DB::transaction(function () use ($product, $data, $position): void {
            $product->update($data);

            if ($position !== null) {
                $this->placeAt($product, $position);
            }
        });

        return new ProductResource($product->refresh()->load('images'));
    }

    public function destroy(Product $product): Response
    {
        $this->images->delete($product->image_path);

        foreach ($product->images as $image) {
            $this->images->delete($image->image_path);
        }

        DB::transaction(function () use ($product): void {
            $product->delete();
            $this->normalizePositions();
        });

        return response()->noContent();
    }

    private function makeSlug(
        ?string $requestedSlug,
        string $name,
        ?int $ignoreId = null
    ): string {
        $base = Str::slug($requestedSlug ?: $name) ?: 'product';
        $slug = $base;
        $suffix = 2;

        while (
            Product::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function placeAt(Product $product, int $position): void
    {
        $products = Product::query()
            ->whereKeyNot($product->id)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->values();
        $position = max(1, min($position, $products->count() + 1));
        $products->splice($position - 1, 0, [$product]);

        foreach ($products as $index => $orderedProduct) {
            if ($orderedProduct->sort_order !== $index + 1) {
                $orderedProduct->updateQuietly(['sort_order' => $index + 1]);
            }
        }
    }

    private function normalizePositions(): void
    {
        Product::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->lockForUpdate()
            ->get()
            ->each(function (Product $product, int $index): void {
                if ($product->sort_order !== $index + 1) {
                    $product->updateQuietly(['sort_order' => $index + 1]);
                }
            });
    }
}
