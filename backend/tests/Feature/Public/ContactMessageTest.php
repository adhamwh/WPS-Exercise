<?php

namespace Tests\Feature\Public;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_can_send_a_contact_message(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
            ->postJson('/api/contact-messages', [
                'name' => 'Jane Customer',
                'telephone' => '420123456789',
                'question' => 'Can you build a custom oak dining table?',
                'website' => '',
            ])
            ->assertCreated()
            ->assertJsonPath('message', 'Sent!');

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Jane Customer',
            'telephone' => '420123456789',
            'question' => 'Can you build a custom oak dining table?',
        ]);
    }

    public function test_invalid_submission_does_not_consume_the_rate_limit(): void
    {
        $client = $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.11']);

        $client->postJson('/api/contact-messages', [
            'name' => 'J',
            'telephone' => 'invalid',
            'question' => 'Short',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'telephone', 'question']);

        $client->postJson('/api/contact-messages', [
            'name' => 'Jane Customer',
            'telephone' => '420123456789',
            'question' => 'This valid question should still be accepted.',
            'website' => '',
        ])->assertCreated();
    }

    public function test_successful_messages_are_limited_to_one_every_five_minutes(): void
    {
        $client = $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.12']);
        $payload = [
            'name' => 'Jane Customer',
            'telephone' => '420123456789',
            'question' => 'Can you build a custom oak dining table?',
            'website' => '',
        ];

        $client->postJson('/api/contact-messages', $payload)
            ->assertCreated();

        $response = $client->postJson('/api/contact-messages', $payload)
            ->assertTooManyRequests()
            ->assertJsonPath('message', 'Please wait before sending another message.')
            ->assertHeader('Retry-After');

        $this->assertGreaterThan(0, (int) $response->headers->get('Retry-After'));
        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_honeypot_rejects_bot_submissions(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.13'])
            ->postJson('/api/contact-messages', [
                'name' => 'Spam Bot',
                'telephone' => '420123456789',
                'question' => 'This looks valid but the hidden field is filled.',
                'website' => 'https://spam.example',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('website');

        $this->assertDatabaseCount('contact_messages', 0);
    }
}
