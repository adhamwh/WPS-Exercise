<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\Media\ImageStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function __construct(private readonly ImageStorageService $images) {}

    public function index(): AnonymousResourceCollection
    {
        return ServiceResource::collection(
            Service::query()->orderBy('sort_order')->orderBy('id')->get()
        );
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $data = $request->safe()->except([
            'icon',
            'image',
            'remove_icon',
            'remove_image',
        ]);
        $data['slug'] = $this->makeSlug(
            $data['slug'] ?? null,
            $data['title']
        );

        $service = Service::query()->create($data);
        $media = [];

        if ($request->hasFile('icon')) {
            $media['icon_path'] = $this->images->store(
                $request->file('icon'),
                "services/{$service->id}/icons"
            );
        }

        if ($request->hasFile('image')) {
            $media['image_path'] = $this->images->store(
                $request->file('image'),
                "services/{$service->id}"
            );
        }

        if ($media !== []) {
            $service->update($media);
        }

        return (new ServiceResource($service->refresh()))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Service $service): ServiceResource
    {
        return new ServiceResource($service);
    }

    public function update(
        ServiceRequest $request,
        Service $service
    ): ServiceResource {
        $data = $request->safe()->except([
            'icon',
            'image',
            'remove_icon',
            'remove_image',
        ]);

        if (array_key_exists('slug', $data)) {
            $data['slug'] = $this->makeSlug(
                $data['slug'],
                $data['title'] ?? $service->title,
                $service->id
            );
        }

        if ($request->hasFile('icon')) {
            $data['icon_path'] = $this->images->replace(
                $service->icon_path,
                $request->file('icon'),
                "services/{$service->id}/icons"
            );
        } elseif ($request->boolean('remove_icon')) {
            $this->images->delete($service->icon_path);
            $data['icon_path'] = null;
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $this->images->replace(
                $service->image_path,
                $request->file('image'),
                "services/{$service->id}"
            );
        } elseif ($request->boolean('remove_image')) {
            $this->images->delete($service->image_path);
            $data['image_path'] = null;
        }

        $service->update($data);

        return new ServiceResource($service->refresh());
    }

    public function destroy(Service $service): Response
    {
        $this->images->delete($service->icon_path);
        $this->images->delete($service->image_path);
        $service->delete();

        return response()->noContent();
    }

    private function makeSlug(
        ?string $requestedSlug,
        string $title,
        ?int $ignoreId = null
    ): string {
        $base = Str::slug($requestedSlug ?: $title) ?: 'service';
        $slug = $base;
        $suffix = 2;

        while (
            Service::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
