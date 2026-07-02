<?php

namespace App\Providers;

use App\Models\HomepageSection;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Service;
use App\Services\Content\PublicContentVersion;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $touchPublicContent = fn () => app(PublicContentVersion::class)->touch();

        foreach ([HomepageSection::class, Service::class, Product::class, ProductImage::class] as $model) {
            $model::saved($touchPublicContent);
            $model::deleted($touchPublicContent);
        }

        RateLimiter::for('contact-messages', function (Request $request): Limit {
            return Limit::perMinutes(5, 1)
                ->by($request->ip())
                ->after(fn ($response) => $response->isSuccessful())
                ->response(fn (Request $request, array $headers) => response()->json([
                    'message' => 'Please wait before sending another message.',
                ], 429, $headers));
        });
    }
}
