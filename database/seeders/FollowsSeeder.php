<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowsSeeder extends Seeder
{
    public function run(): void
    {
        $follows = [
            [
                'follower_id' => 1,
                'followed_id' => 2,
                'is_accepted' => true,
                'visibility' => 'public',
                'is_muted' => false,
                'notifications_enabled' => true,
                'source' => 'manual',
            ],
            [
                'follower_id' => 2,
                'followed_id' => 1,
                'is_accepted' => true,
                'visibility' => 'public',
                'is_muted' => false,
                'notifications_enabled' => true,
                'source' => 'manual',
            ],
        ];

        DB::table('follows')->insert($follows);
    }
}
