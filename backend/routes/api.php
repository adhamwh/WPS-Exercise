<?php

use App\Http\Controllers\Api\Public\HomepageController;
use App\Http\Controllers\Api\Public\GalleryController;
use App\Http\Controllers\Api\Public\ServicesPageController;
use App\Http\Controllers\Api\Public\AboutPageController;
use App\Http\Controllers\Api\Public\ContactPageController;
use App\Http\Controllers\Api\Public\NotFoundPageController;
use Illuminate\Support\Facades\Route;

Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/services', [ServicesPageController::class, 'index']);
Route::get('/about', [AboutPageController::class, 'index']);
Route::get('/contact', [ContactPageController::class, 'index']);
Route::get('/not-found', [NotFoundPageController::class, 'index']);
