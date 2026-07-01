<?php

use App\Http\Controllers\Api\Admin\HomepageSectionController as AdminHomepageSectionController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\ProductImageController as AdminProductImageController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\AboutPageController;
use App\Http\Controllers\Api\Public\ContactPageController;
use App\Http\Controllers\Api\Public\GalleryController;
use App\Http\Controllers\Api\Public\HomepageController;
use App\Http\Controllers\Api\Public\NotFoundPageController;
use App\Http\Controllers\Api\Public\ServicesPageController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:10,1');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:10,1');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::prefix('admin')->middleware('auth:api')->group(function () {
    Route::apiResource('homepage-sections', AdminHomepageSectionController::class)
        ->only(['index', 'show', 'update']);
    Route::apiResource('services', AdminServiceController::class);
    Route::apiResource('products', AdminProductController::class);

    Route::get('/product-images', [AdminProductImageController::class, 'index']);
    Route::post('/products/{product}/images', [AdminProductImageController::class, 'store']);
    Route::patch('/products/{product}/images/reorder', [AdminProductImageController::class, 'reorder']);
    Route::patch('/product-images/{productImage}', [AdminProductImageController::class, 'update']);
    Route::delete('/product-images/{productImage}', [AdminProductImageController::class, 'destroy']);
});

Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/services', [ServicesPageController::class, 'index']);
Route::get('/about', [AboutPageController::class, 'index']);
Route::get('/contact', [ContactPageController::class, 'index']);
Route::get('/not-found', [NotFoundPageController::class, 'index']);
