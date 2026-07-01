<?php

namespace App\Http\Requests\Admin;

use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
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
        /** @var Service|null $service */
        $service = $this->route('service');
        $presence = $service ? 'sometimes' : 'required';

        return [
            'title' => [$presence, 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                'alpha_dash:ascii',
                Rule::unique('services', 'slug')->ignore($service),
            ],
            'description' => ['sometimes', 'nullable', 'string', 'max:10000'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'icon' => ['sometimes', 'nullable', 'image', 'max:2048'],
            'image' => ['sometimes', 'nullable', 'image', 'max:5120'],
            'remove_icon' => ['sometimes', 'boolean'],
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }
}
