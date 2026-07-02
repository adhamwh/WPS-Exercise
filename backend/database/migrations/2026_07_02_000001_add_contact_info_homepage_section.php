<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('homepage_sections')->insertOrIgnore([
            'key' => 'contact_info',
            'title' => 'CONTACT',
            'subtitle' => '+420 000 000 000',
            'description' => "Na Plzence 1166/0\n150 00",
            'button_text' => null,
            'button_url' => 'https://www.google.com/maps?q=Pixel38%2C%2011%204404%2C%2047%20Patriarch%20Howeiyek%20Street%2C%20Beirut&output=embed',
            'image_path' => null,
            'sort_order' => 6,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('homepage_sections')
            ->where('key', 'contact_info')
            ->delete();
    }
};
