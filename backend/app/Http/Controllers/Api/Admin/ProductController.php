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

        $product = Product::query()->create($data);

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

        $product->update($data);

        return new ProductResource($product->refresh()->load('images'));
    }

    public function destroy(Product $product): Response
    {
        $this->images->delete($product->image_path);

        foreach ($product->images as $image) {
            $this->images->delete($image->image_path);
        }

        $product->delete();

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
}
