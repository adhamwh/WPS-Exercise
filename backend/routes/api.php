<?php

use App\Http\Controllers\Api\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Api\Admin\HomepageSectionController as AdminHomepageSectionController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\ProductImageController as AdminProductImageController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\ContactMessageController as PublicContactMessageController;
use App\Http\Controllers\Api\Public\ContentVersionController;
use App\Http\Controllers\Api\Public\PublicPageController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:10,1');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:10,1');
    Route::get('/me', [AuthController::class, 'me'])
        ->middleware(['auth:api', 'auth.session']);
});

Route::prefix('admin')->middleware(['auth:api', 'auth.session'])->group(function () {
    Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
    Route::delete('/contact-messages', [AdminContactMessageController::class, 'clear']);
    Route::get('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'show']);
    Route::delete('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'destroy']);

    Route::apiResource('homepage-sections', AdminHomepageSectionController::class)
        ->only(['index', 'show', 'update']);
    Route::apiResource('services', AdminServiceController::class);
    Route::patch('/products/{product}/work-gallery', [AdminProductController::class, 'selectWorkGallery']);
    Route::apiResource('products', AdminProductController::class);

    Route::get('/product-images', [AdminProductImageController::class, 'index']);
    Route::post('/products/{product}/images', [AdminProductImageController::class, 'store']);
    Route::patch('/products/{product}/images/reorder', [AdminProductImageController::class, 'reorder']);
    Route::patch('/product-images/{productImage}', [AdminProductImageController::class, 'update']);
    Route::delete('/product-images/{productImage}', [AdminProductImageController::class, 'destroy']);
});

Route::post('/contact-messages', [PublicContactMessageController::class, 'store'])
    ->middleware('throttle:contact-messages');
Route::get('/content-version', ContentVersionController::class);

Route::get('/homepage', PublicPageController::class);
Route::get('/gallery', PublicPageController::class);
Route::get('/services', PublicPageController::class);
Route::get('/about', PublicPageController::class);
Route::get('/contact', PublicPageController::class);
Route::get('/not-found', PublicPageController::class);
