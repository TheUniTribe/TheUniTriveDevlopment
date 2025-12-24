<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserExperiencesSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            [
                'user_id' => 1,
                'company' => 'Tech Corp',
                'position' => 'Software Developer',
                'description' => 'Developed web applications using Laravel.',
                'start_date' => '2022-01-01',
                'end_date' => '2023-12-31',
                'is_current' => false,
            ],
            [
                'user_id' => 2,
                'company' => 'Business Inc',
                'position' => 'Project Manager',
                'description' => 'Managed projects and teams.',
                'start_date' => '2021-06-01',
                'end_date' => null,
                'is_current' => true,
            ],
        ];

        DB::table('user_experiences')->insert($experiences);
    }
}
