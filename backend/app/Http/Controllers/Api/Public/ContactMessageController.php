<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\ContactMessageStoreRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ContactMessageController extends Controller
{
    public function store(ContactMessageStoreRequest $request): JsonResponse
    {
        $message = ContactMessage::query()->create(
            $request->safe()->only(['name', 'telephone', 'question'])
        );

        return response()->json([
            'message' => 'Sent!',
            'id' => $message->id,
        ], Response::HTTP_CREATED);
    }
}
