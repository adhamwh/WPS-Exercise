<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Services\Content\PublicContentService;
use Illuminate\Http\JsonResponse;

class PublicPageController extends Controller
{
    public function __invoke(PublicContentService $content): JsonResponse
    {
        return response()->json($content->get());
    }
}
