<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Region;
use App\Models\City;
use App\Models\Pincode;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function countries()
    {
        return response()->json(Country::all());
    }

    public function regions(Request $request)
    {
        $countryId = $request->query('country_id');
        $regions = Region::where('country_id', $countryId)->get();
        return response()->json($regions);
    }

    public function cities(Request $request)
    {
        $regionId = $request->query('region_id');
        $cities = City::where('region_id', $regionId)->get();
        return response()->json($cities);
    }

    public function pincodes(Request $request)
    {

        $cityId = $request->query('city_id');
        $pincodes = Pincode::where('city_id', $cityId)->get();
        return response()->json($pincodes);
    }
}
