<?php

namespace App\Services\Content;

use App\Http\Resources\HomepageSectionResource;
use App\Http\Resources\ProductImageResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Service;

class PublicContentService
{
    /**
     * @return array<string, mixed>
     */
    public function get(): array
    {
        $sections = HomepageSectionResource::collection(
            HomepageSection::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        )->resolve();

        $products = Product::query()
            ->where('is_active', true)
            ->with('images')
            ->orderBy('sort_order')
            ->limit(Product::MAX_PUBLISHED)
            ->get();

        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $gallery = ProductImage::query()
            ->whereHas('product', fn ($query) => $query->where('is_active', true))
            ->with('product')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return [
            'sections' => collect($sections)->keyBy('key')->all(),
            'wood_types' => ProductResource::collection($products)->resolve(),
            'services' => ServiceResource::collection($services)->resolve(),
            'gallery' => ProductImageResource::collection($gallery)->resolve(),
        ];
    }
}
