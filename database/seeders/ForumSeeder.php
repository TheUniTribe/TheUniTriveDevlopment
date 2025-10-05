<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Forum;

class ForumSeeder extends Seeder
{
    public function run()
    {
        Forum::insert([
            ['title' => 'General Discussion', 'description' => 'Talk about anything here.', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Announcements', 'description' => 'Latest news and updates.', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Support', 'description' => 'Get help and support.', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
