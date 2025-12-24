<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserEducationsSeeder extends Seeder
{
    public function run(): void
    {
        $educations = [
            [
                'user_id' => 1,
                'institution' => 'University of Example',
                'degree' => 'Bachelor of Science',
                'specialization' => 'Computer Science',
                'start_year' => 2018,
                'end_year' => 2022,
            ],
            [
                'user_id' => 2,
                'institution' => 'College of Tech',
                'degree' => 'Master of Business Administration',
                'specialization' => 'Finance',
                'start_year' => 2019,
                'end_year' => 2021,
            ],
        ];

        DB::table('user_educations')->insert($educations);
    }
}
