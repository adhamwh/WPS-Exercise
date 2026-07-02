<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ContactMessageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ContactMessageResource::collection(
            ContactMessage::query()
                ->latest()
                ->latest('id')
                ->paginate(20)
        );
    }

    public function show(ContactMessage $contactMessage): ContactMessageResource
    {
        if ($contactMessage->read_at === null) {
            $contactMessage->update(['read_at' => now()]);
        }

        return new ContactMessageResource($contactMessage->refresh());
    }

    public function destroy(ContactMessage $contactMessage): Response
    {
        $contactMessage->delete();

        return response()->noContent();
    }

    public function clear(): Response
    {
        ContactMessage::query()->delete();

        return response()->noContent();
    }
}
