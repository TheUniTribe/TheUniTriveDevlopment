<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Country;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Region::truncate();

        $us = Country::where('name', 'United States')->first();
        $ca = Country::where('name', 'Canada')->first();

        if ($us) {
            Region::create(['name' => 'California', 'country_id' => $us->id]);
            Region::create(['name' => 'Texas', 'country_id' => $us->id]);
        }

        if ($ca) {
            Region::create(['name' => 'Ontario', 'country_id' => $ca->id]);
            Region::create(['name' => 'Quebec', 'country_id' => $ca->id]);
        }
    }
}
