<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Group;

class GroupTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_json()
    {
        Group::factory()->count(3)->create();

        $response = $this->getJson('/api/groups');

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
        $group = Group::factory()->create();

        $response = $this->getJson("/api/groups/{$group->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $group->id,
                     'name' => $group->name,
                 ]);
    }
}
