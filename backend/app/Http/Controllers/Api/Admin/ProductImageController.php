<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductImageStoreRequest;
use App\Http\Requests\Admin\ProductImageUpdateRequest;
use App\Http\Requests\Admin\ReorderImagesRequest;
use App\Http\Resources\ProductImageResource;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\Media\ImageStorageService;
use App\Services\Content\PublicContentVersion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductImageController extends Controller
{
    public function __construct(
        private readonly ImageStorageService $images,
        private readonly PublicContentVersion $contentVersion
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return ProductImageResource::collection(
            ProductImage::query()
                ->with('product:id,name')
                ->orderBy('product_id')
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function store(
        ProductImageStoreRequest $request,
        Product $product
    ): JsonResponse {
        $path = $this->images->store(
            $request->file('image'),
            "products/{$product->id}/gallery"
        );

        $image = $product->images()->create([
            'image_path' => $path,
            'alt_text' => $request->validated('alt_text'),
            'sort_order' => (ProductImage::query()
                ->where('product_id', $product->id)
                ->max('sort_order') ?? -1) + 1,
        ]);

        return (new ProductImageResource($image->load('product:id,name')))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(
        ProductImageUpdateRequest $request,
        ProductImage $productImage
    ): ProductImageResource {
        $productImage->update($request->validated());

        return new ProductImageResource(
            $productImage->refresh()->load('product:id,name')
        );
    }

    public function reorder(
        ReorderImagesRequest $request,
        Product $product
    ): AnonymousResourceCollection {
        $submittedIds = array_map('intval', $request->validated('image_ids'));
        $currentIds = $product->images()->pluck('id')->map(fn ($id) => (int) $id)->all();
        $sortedSubmittedIds = $submittedIds;
        $sortedCurrentIds = $currentIds;
        sort($sortedSubmittedIds);
        sort($sortedCurrentIds);

        if ($sortedSubmittedIds !== $sortedCurrentIds) {
            throw ValidationException::withMessages([
                'image_ids' => 'Submit every image belonging to this product exactly once.',
            ]);
        }

        DB::transaction(function () use ($submittedIds, $product): void {
            foreach ($submittedIds as $sortOrder => $imageId) {
                ProductImage::query()
                    ->where('product_id', $product->id)
                    ->whereKey($imageId)
                    ->update(['sort_order' => $sortOrder]);
            }
        });

        $this->contentVersion->touch();

        return ProductImageResource::collection(
            $product->images()->with('product:id,name')->get()
        );
    }

    public function destroy(ProductImage $productImage): Response
    {
        $this->images->delete($productImage->image_path);
        $productImage->delete();

        return response()->noContent();
    }
}
