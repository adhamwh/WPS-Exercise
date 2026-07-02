<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('auth_session_version')->default(0);
        });

        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->unsignedBigInteger('session_version')->default(0)->index();
        });
    }

    public function down(): void
    {
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->dropColumn('session_version');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('auth_session_version');
        });
    }
};
