<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Country::truncate();

        Country::create(['name' => 'United States']);
        Country::create(['name' => 'Canada']);
        Country::create(['name' => 'United Kingdom']);
    }
}
