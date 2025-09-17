<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Region;
use App\Models\Country;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        City::truncate();

        $california = Region::where('name', 'California')->first();
        $texas = Region::where('name', 'Texas')->first();
        $ontario = Region::where('name', 'Ontario')->first();

        $us = Country::where('name', 'United States')->first();
        $ca = Country::where('name', 'Canada')->first();

        if ($california && $us) {
            City::create([
                'name' => 'Los Angeles',
                'region_id' => $california->id,


            ]);
            City::create([
                'name' => 'San Francisco',
                'region_id' => $california->id,


            ]);
        }

        if ($texas && $us) {
            City::create([
                'name' => 'Houston',
                'region_id' => $texas->id,


            ]);
        }

        if ($ontario && $ca) {
            City::create([
                'name' => 'Toronto',
                'region_id' => $ontario->id,


            ]);
        }
    }
}
