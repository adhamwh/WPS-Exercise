<?php

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ContactMessageManagementTest extends TestCase
{
    use RefreshDatabase;

    private string $accessToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accessToken = JWTAuth::fromUser(User::factory()->create());
    }

    public function test_inbox_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/contact-messages')
            ->assertUnauthorized();

        $this->deleteJson('/api/admin/contact-messages')
            ->assertUnauthorized();
    }

    public function test_admin_can_list_and_read_messages(): void
    {
        $older = ContactMessage::query()->create([
            'name' => 'Older sender',
            'telephone' => '420111111111',
            'question' => 'This is the older customer question.',
        ]);
        $newer = ContactMessage::query()->create([
            'name' => 'Newer sender',
            'telephone' => '420222222222',
            'question' => 'This is the newer customer question.',
        ]);

        $this->withToken($this->accessToken)
            ->getJson('/api/admin/contact-messages')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.id', $newer->id)
            ->assertJsonPath('data.0.is_read', false);

        $this->getJson("/api/admin/contact-messages/{$older->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $older->id)
            ->assertJsonPath('data.is_read', true);

        $this->assertNotNull($older->refresh()->read_at);
    }

    public function test_admin_can_delete_one_message_or_clear_the_inbox(): void
    {
        $first = ContactMessage::query()->create([
            'name' => 'First sender',
            'telephone' => '420111111111',
            'question' => 'The first customer question is stored here.',
        ]);
        $second = ContactMessage::query()->create([
            'name' => 'Second sender',
            'telephone' => '420222222222',
            'question' => 'The second customer question is stored here.',
        ]);

        $this->withToken($this->accessToken)
            ->deleteJson("/api/admin/contact-messages/{$first->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('contact_messages', ['id' => $first->id]);
        $this->assertDatabaseHas('contact_messages', ['id' => $second->id]);

        $this->deleteJson('/api/admin/contact-messages')
            ->assertNoContent();

        $this->assertDatabaseCount('contact_messages', 0);
    }
}
