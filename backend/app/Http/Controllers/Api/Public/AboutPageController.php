<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Service;

class AboutPageController extends Controller
{
    public function index()
    {
        return response()->json([
            'sections' => HomepageSection::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->keyBy('key'),

            'wood_types' => Product::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),

            'services' => Service::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(),

            'gallery' => ProductImage::query()
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
