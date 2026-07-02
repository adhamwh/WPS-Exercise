<?php

namespace App\Services\Content;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PublicContentVersion
{
    private const CACHE_KEY = 'public-content-version';

    public function current(): string
    {
        return (string) Cache::rememberForever(
            self::CACHE_KEY,
            fn () => Str::uuid()->toString()
        );
    }

    public function touch(): string
    {
        $version = Str::uuid()->toString();
        Cache::forever(self::CACHE_KEY, $version);

        return $version;
    }
}
