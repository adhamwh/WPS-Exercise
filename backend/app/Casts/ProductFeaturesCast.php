<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class ProductFeaturesCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     * @return array<int, array<string, mixed>>|null
     */
    public function get(
        Model $model,
        string $key,
        mixed $value,
        array $attributes
    ): ?array {
        if ($value === null) {
            return null;
        }

        $features = is_array($value)
            ? $value
            : json_decode((string) $value, true, 512, JSON_THROW_ON_ERROR);

        return $this->normalize($features);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes
    ): ?string {
        if ($value === null) {
            return null;
        }

        return json_encode(
            $this->normalize($value),
            JSON_THROW_ON_ERROR
        );
    }

    /**
     * @param  array<int, array<string, mixed>>  $features
     * @return array<int, array<string, mixed>>
     */
    private function normalize(array $features): array
    {
        return array_values(array_map(
            static fn (array $feature): array => [
                ...$feature,
                'positive' => filter_var(
                    $feature['positive'] ?? false,
                    FILTER_VALIDATE_BOOLEAN
                ),
            ],
            $features
        ));
    }
}
