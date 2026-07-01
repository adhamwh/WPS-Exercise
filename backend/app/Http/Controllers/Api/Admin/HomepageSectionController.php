<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomepageSectionUpdateRequest;
use App\Http\Resources\HomepageSectionResource;
use App\Models\HomepageSection;
use App\Services\Media\ImageStorageService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HomepageSectionController extends Controller
{
    public function __construct(private readonly ImageStorageService $images) {}

    public function index(): AnonymousResourceCollection
    {
        return HomepageSectionResource::collection(
            HomepageSection::query()->orderBy('sort_order')->get()
        );
    }

    public function show(HomepageSection $homepageSection): HomepageSectionResource
    {
        return new HomepageSectionResource($homepageSection);
    }

    public function update(
        HomepageSectionUpdateRequest $request,
        HomepageSection $homepageSection
    ): HomepageSectionResource {
        $data = $request->safe()->except(['image', 'remove_image']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $this->images->replace(
                $homepageSection->image_path,
                $request->file('image'),
                "homepage-sections/{$homepageSection->id}"
            );
        } elseif ($request->boolean('remove_image')) {
            $this->images->delete($homepageSection->image_path);
            $data['image_path'] = null;
        }

        $homepageSection->update($data);

        return new HomepageSectionResource($homepageSection->refresh());
    }
}
