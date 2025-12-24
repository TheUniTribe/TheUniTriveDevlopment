<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserLinksSeeder extends Seeder
{
    public function run(): void
    {
        $links = [
            [
                'user_id' => 1,
                'platform' => 'LinkedIn',
                'url' => 'https://linkedin.com/in/user1',
            ],
            [
                'user_id' => 1,
                'platform' => 'GitHub',
                'url' => 'https://github.com/user1',
            ],
            [
                'user_id' => 2,
                'platform' => 'Twitter',
                'url' => 'https://twitter.com/user2',
            ],
        ];

        DB::table('user_links')->insert($links);
    }
}
