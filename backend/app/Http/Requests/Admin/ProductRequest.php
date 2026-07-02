<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Product|null $product */
        $product = $this->route('product');
        $presence = $product ? 'sometimes' : 'required';
        $productCount = Product::query()->count();
        $maximumPosition = $product
            ? max(1, $productCount)
            : $productCount + 1;

        return [
            'name' => [$presence, 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                'alpha_dash:ascii',
                Rule::unique('products', 'slug')->ignore($product),
            ],
            'short_description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'description' => ['sometimes', 'nullable', 'string', 'max:20000'],
            'features' => ['sometimes', 'nullable', 'array', 'max:20'],
            'features.*.label' => ['required', 'string', 'max:100'],
            'features.*.positive' => ['required', 'boolean'],
            'sort_order' => [
                'sometimes',
                'integer',
                'min:1',
                "max:{$maximumPosition}",
            ],
            'is_active' => ['sometimes', 'boolean'],
            'image' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [function (Validator $validator): void {
            /** @var Product|null $product */
            $product = $this->route('product');
            $willBePublished = $this->exists('is_active')
                ? $this->boolean('is_active')
                : ($product?->is_active ?? true);

            if (! $willBePublished || $product?->is_active) {
                return;
            }

            if (
                Product::query()->where('is_active', true)->count()
                >= Product::MAX_PUBLISHED
            ) {
                $validator->errors()->add(
                    'is_active',
                    'Only six products can be published at the same time.'
                );
            }
        }];
    }
}
