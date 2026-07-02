<?php

namespace App\Services\Auth;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RefreshTokenService
{
    /**
     * @return array{0: User, 1: string}
     */
    public function startSession(User $user, Request $request): array
    {
        return DB::transaction(function () use ($user, $request): array {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->id);

            RefreshToken::query()
                ->where('user_id', $lockedUser->id)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);

            $lockedUser->increment('auth_session_version');
            $lockedUser->refresh();

            return [$lockedUser, $this->issue($lockedUser, $request)];
        });
    }

    public function issue(User $user, Request $request): string
    {
        $plainTextToken = bin2hex(random_bytes(32));

        $user->refreshTokens()->create([
            'token_hash' => $this->hash($plainTextToken),
            'session_version' => $user->auth_session_version,
            'expires_at' => now()->addDays(config('auth_tokens.refresh_token_ttl_days')),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 1000),
        ]);

        return $plainTextToken;
    }

    /**
     * @return array{0: User, 1: string}|null
     */
    public function rotate(?string $plainTextToken, Request $request): ?array
    {
        if (! $plainTextToken) {
            return null;
        }

        return DB::transaction(function () use ($plainTextToken, $request): ?array {
            $refreshToken = RefreshToken::query()
                ->where('token_hash', $this->hash($plainTextToken))
                ->lockForUpdate()
                ->first();

            if (! $refreshToken) {
                return null;
            }

            if (! $refreshToken->isUsable()) {
                if ($refreshToken->revoked_at !== null) {
                    RefreshToken::query()
                        ->where('user_id', $refreshToken->user_id)
                        ->where('session_version', $refreshToken->session_version)
                        ->whereNull('revoked_at')
                        ->update(['revoked_at' => now()]);
                }

                return null;
            }

            $refreshToken->update(['revoked_at' => now()]);
            $user = $refreshToken->user;

            return [$user, $this->issue($user, $request)];
        });
    }

    public function revoke(?string $plainTextToken): void
    {
        if (! $plainTextToken) {
            return;
        }

        RefreshToken::query()
            ->where('token_hash', $this->hash($plainTextToken))
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);
    }

    private function hash(string $plainTextToken): string
    {
        return hash('sha256', $plainTextToken);
    }
}
