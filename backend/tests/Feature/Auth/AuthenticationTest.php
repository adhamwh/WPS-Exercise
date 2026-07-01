<?php

namespace Tests\Feature\Auth;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_validates_required_fields(): void
    {
        $this->postJson('/api/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_invalid_credentials_return_a_generic_error(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'incorrect-password',
        ])->assertUnauthorized()->assertExactJson([
            'message' => 'The provided credentials are incorrect.',
        ]);
    }

    public function test_user_can_login_and_receive_access_and_refresh_tokens(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        $response = $this->login();

        $response
            ->assertOk()
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonPath('expires_in', 900)
            ->assertJsonPath('user.email', 'admin@example.com')
            ->assertJsonStructure(['access_token', 'token_type', 'expires_in', 'user'])
            ->assertCookie('refresh_token', null, false);

        $plainTextRefreshToken = $this->refreshCookie($response);

        $this->assertDatabaseHas('refresh_tokens', [
            'token_hash' => hash('sha256', $plainTextRefreshToken),
            'revoked_at' => null,
        ]);

        $this->assertNotSame(
            $plainTextRefreshToken,
            RefreshToken::query()->firstOrFail()->token_hash
        );
    }

    public function test_protected_route_requires_a_valid_access_token(): void
    {
        $this->get('/api/auth/me')
            ->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);

        User::factory()->create(['email' => 'admin@example.com']);
        $accessToken = $this->login()->json('access_token');
        Auth::forgetGuards();

        $this->withToken($accessToken)
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'admin@example.com');
    }

    public function test_refresh_token_is_rotated_and_reuse_revokes_the_session(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);
        $loginResponse = $this->login();
        $oldRefreshToken = $this->refreshCookie($loginResponse);

        $refreshResponse = $this
            ->withCredentials()
            ->withUnencryptedCookie('refresh_token', $oldRefreshToken)
            ->postJson('/api/auth/refresh')
            ->assertOk();

        $newRefreshToken = $this->refreshCookie($refreshResponse);

        $this->assertNotSame($oldRefreshToken, $newRefreshToken);
        $this->assertDatabaseHas('refresh_tokens', [
            'token_hash' => hash('sha256', $oldRefreshToken),
        ]);
        $this->assertNotNull(
            RefreshToken::query()
                ->where('token_hash', hash('sha256', $oldRefreshToken))
                ->firstOrFail()
                ->revoked_at
        );
        $this->assertDatabaseHas('refresh_tokens', [
            'token_hash' => hash('sha256', $newRefreshToken),
            'revoked_at' => null,
        ]);

        $this->withCredentials()
            ->withUnencryptedCookie('refresh_token', $oldRefreshToken)
            ->postJson('/api/auth/refresh')
            ->assertUnauthorized()
            ->assertCookieExpired('refresh_token');

        $this->assertNotNull(
            RefreshToken::query()
                ->where('token_hash', hash('sha256', $newRefreshToken))
                ->firstOrFail()
                ->revoked_at
        );
    }

    public function test_logout_revokes_both_tokens(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);
        $loginResponse = $this->login();
        $accessToken = $loginResponse->json('access_token');
        $refreshToken = $this->refreshCookie($loginResponse);

        $this->withCredentials()
            ->withToken($accessToken)
            ->withUnencryptedCookie('refresh_token', $refreshToken)
            ->postJson('/api/auth/logout')
            ->assertNoContent()
            ->assertCookieExpired('refresh_token');

        $this->assertNotNull(
            RefreshToken::query()->firstOrFail()->revoked_at
        );

        Auth::forgetGuards();

        $this->withToken($accessToken)
            ->getJson('/api/auth/me')
            ->assertUnauthorized();
    }

    private function login(): TestResponse
    {
        return $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);
    }

    private function refreshCookie(TestResponse $response): string
    {
        $cookie = $response->getCookie('refresh_token', false);

        $this->assertNotNull($cookie);

        return $cookie->getValue();
    }
}
