<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pincode;
use App\Models\City;

class PincodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pincode::truncate();

        $losAngeles = City::where('name', 'Los Angeles')->first();
        $sanFrancisco = City::where('name', 'San Francisco')->first();
        $houston = City::where('name', 'Houston')->first();
        $toronto = City::where('name', 'Toronto')->first();

        if ($losAngeles) {
            Pincode::create(['pincode' => '90001', 'city_id' => $losAngeles->id]);
            Pincode::create(['pincode' => '90002', 'city_id' => $losAngeles->id]);
        }

        if ($sanFrancisco) {
            Pincode::create(['pincode' => '94101', 'city_id' => $sanFrancisco->id]);
        }

        if ($houston) {
            Pincode::create(['pincode' => '77001', 'city_id' => $houston->id]);
        }

        if ($toronto) {
            Pincode::create(['pincode' => 'M5H', 'city_id' => $toronto->id]);
        }
    }
}
