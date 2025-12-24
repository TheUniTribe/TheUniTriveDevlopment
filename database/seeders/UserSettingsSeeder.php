<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'user_id' => 1,
                'key' => 'theme',
                'value' => 'light',
            ],
            [
                'user_id' => 1,
                'key' => 'notifications',
                'value' => 'enabled',
            ],
            [
                'user_id' => 2,
                'key' => 'theme',
                'value' => 'dark',
            ],
            [
                'user_id' => 2,
                'key' => 'notifications',
                'value' => 'disabled',
            ],
        ];

        DB::table('user_settings')->insert($settings);
    }
}
