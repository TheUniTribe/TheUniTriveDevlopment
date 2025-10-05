<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Network;

class NetworkSeeder extends Seeder
{
    public function run()
    {
        $networks = [
            [
                'name' => 'Student Network',
                'description' => 'A network for student discussions and collaborations.',
                'type' => 'student',
            ],
            [
                'name' => 'Professional Network',
                'description' => 'A network for professionals to connect and share.',
                'type' => 'professional',
            ],
            [
                'name' => 'General Network',
                'description' => 'A general network for all users.',
                'type' => 'general',
            ],
        ];

        foreach ($networks as $network) {
            Network::updateOrCreate(['name' => $network['name']], $network);
        }
    }
}
