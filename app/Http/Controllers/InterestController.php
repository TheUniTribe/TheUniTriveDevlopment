<?php

namespace App\Http\Controllers;

use App\Models\Interest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class InterestController extends Controller
{
    /**
     * Display a listing of interests
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $interests = Interest::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($interests);
    }

    /**
     * Display the specified interest
     *
     * @param \App\Models\Interest $interest
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Interest $interest): JsonResponse
    {
        return response()->json($interest->load('topics'));
    }

    /**
     * Store a newly created interest
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:interests,name',
            'slug' => 'nullable|string|max:100|unique:interests,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'is_trending' => 'nullable|boolean',
            'members_count' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $interest = Interest::create($validated);

        return response()->json($interest, 201);
    }

    /**
     * Update the specified interest
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Interest $interest
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Interest $interest): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('interests', 'name')->ignore($interest->id)
            ],
            'slug' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('interests', 'slug')->ignore($interest->id)
            ],
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'is_trending' => 'nullable|boolean',
            'members_count' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if name changed but slug not provided
        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $interest->update($validated);

        return response()->json($interest);
    }

    /**
     * Remove the specified interest
     *
     * @param \App\Models\Interest $interest
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Interest $interest): JsonResponse
    {
        $interest->delete();

        return response()->json(null, 204);
    }
}
