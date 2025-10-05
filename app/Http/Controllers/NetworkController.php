<?php

namespace App\Http\Controllers;

use App\Models\Network;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NetworkController extends Controller
{
    public function index()
    {
        $networks = Network::all();
        return Inertia::render('Network/Index', [
            'networks' => $networks,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:networks,name',
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
        ]);

        $network = Network::create($request->only('name', 'description', 'type'));

        return redirect()->back()->with('success', 'Network created successfully.');
    }

    public function show($id)
    {
        $network = Network::findOrFail($id);
        return Inertia::render('Network/Show', [
            'network' => $network,
        ]);
    }

    public function update(Request $request, $id)
    {
        $network = Network::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:networks,name,' . $network->id,
            'description' => 'nullable|string',
            'type' => 'required|string|max:255',
        ]);

        $network->update($request->only('name', 'description', 'type'));

        return redirect()->back()->with('success', 'Network updated successfully.');
    }

    public function destroy($id)
    {
        $network = Network::findOrFail($id);
        $network->delete();

        return redirect()->back()->with('success', 'Network deleted successfully.');
    }
}
