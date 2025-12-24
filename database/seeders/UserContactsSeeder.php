<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserContactsSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'user_id' => 1,
                'type' => 'email',
                'value' => 'user1@example.com',
                'is_primary' => true,
            ],
            [
                'user_id' => 1,
                'type' => 'phone',
                'value' => '+1234567890',
                'is_primary' => false,
            ],
            [
                'user_id' => 2,
                'type' => 'email',
                'value' => 'user2@example.com',
                'is_primary' => true,
            ],
        ];

        DB::table('user_contacts')->insert($contacts);
    }
}
