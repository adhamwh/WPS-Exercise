<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class ImageStorageService
{
    public function store(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        if (! $path) {
            throw new RuntimeException('The image could not be stored.');
        }

        return $path;
    }

    public function replace(
        ?string $currentPath,
        UploadedFile $file,
        string $directory
    ): string {
        $newPath = $this->store($file, $directory);
        $this->delete($currentPath);

        return $newPath;
    }

    public function delete(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
