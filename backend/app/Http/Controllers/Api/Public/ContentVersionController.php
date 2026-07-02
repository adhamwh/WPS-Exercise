<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Services\Content\PublicContentVersion;
use Illuminate\Http\JsonResponse;

class ContentVersionController extends Controller
{
    public function __invoke(PublicContentVersion $version): JsonResponse
    {
        return response()->json([
            'version' => $version->current(),
        ])->withHeaders([
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }
}
