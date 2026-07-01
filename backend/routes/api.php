<?php

use App\Http\Controllers\Api\Public\HomepageController;
use Illuminate\Support\Facades\Route;

Route::get('/homepage', [HomepageController::class, 'index']);