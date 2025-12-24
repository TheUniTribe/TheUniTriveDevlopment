<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Topic;

class TopicTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_json()
    {
        Topic::factory()->count(3)->create();

        $response = $this->getJson('/api/topics');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     '*' => [
                         'id',
                         'name',
                         'slug',
                         'description',
                         'icon',
                         'color',
                         'is_active',
                         'sort_order',
                         'created_at',
                         'updated_at'
                     ]
                 ]);
    }

    public function test_show_returns_json()
    {
        $topic = Topic::factory()->create();

        $response = $this->getJson("/api/topics/{$topic->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $topic->id,
                     'name' => $topic->name,
                 ]);
    }
}
