<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'features' => $this->features,
            'image_path' => $this->image_path,
            'image_url' => $this->image_path
                ? Storage::disk('public')->url($this->image_path)
                : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'is_work_gallery' => $this->is_work_gallery,
            'images' => ProductImageResource::collection(
                $this->whenLoaded('images')
            ),
            'updated_at' => $this->updated_at,
        ];
    }
}
