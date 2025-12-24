<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSkillsSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            [
                'user_id' => 1,
                'name' => 'Laravel',
                'category' => 'Programming',
            ],
            [
                'user_id' => 1,
                'name' => 'React',
                'category' => 'Programming',
            ],
            [
                'user_id' => 2,
                'name' => 'Project Management',
                'category' => 'Management',
            ],
        ];

        DB::table('user_skills')->insert($skills);
    }
}
