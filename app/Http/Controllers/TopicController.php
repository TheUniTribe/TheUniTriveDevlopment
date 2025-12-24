<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use App\Models\Interest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TopicController extends Controller
{
    /**
     * Display a listing of all topics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $topics = Topic::where('is_active', true)
            ->with('interest')
            ->withCount('communities')
            ->orderBy('name')
            ->get();

        return response()->json($topics);
    }

    /**
     * Get topics by interest ID
     *
     * @param int $interestId
     * @return \Illuminate\Http\JsonResponse
     */
    public function byInterest(int $interestId): JsonResponse
    {
        // Verify interest exists
        $interest = Interest::findOrFail($interestId);

        $topics = Topic::where('interest_id', $interestId)
            ->where('is_active', true)
            ->withCount('communities')
            ->orderBy('name')
            ->get();

        return response()->json([
            'interest' => $interest,
            'topics' => $topics,
        ]);
    }

    /**
     * Store a newly created topic
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'interest_id' => 'required|exists:interests,id',
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'members_count' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Check unique constraint: interest_id + slug
        $exists = Topic::where('interest_id', $validated['interest_id'])
            ->where('slug', $validated['slug'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A topic with this slug already exists for this interest.',
                'errors' => ['slug' => ['The slug must be unique within this interest.']]
            ], 422);
        }

        $topic = Topic::create($validated);

        return response()->json([
            'message' => 'Topic created successfully',
            'topic' => $topic->load('interest'),
        ], 201);
    }

    /**
     * Display the specified topic
     *
     * @param \App\Models\Topic $topic
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Topic $topic): JsonResponse
    {
        $topic->load(['interest', 'communities']);

        return response()->json($topic);
    }

    /**
     * Update the specified topic
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Topic $topic
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Topic $topic): JsonResponse
    {
        $validated = $request->validate([
            'interest_id' => 'sometimes|exists:interests,id',
            'name' => 'sometimes|string|max:100',
            'slug' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'members_count' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        // Auto-generate slug if name changed but slug not provided
        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Check unique constraint if slug or interest_id changed
        if (isset($validated['slug']) || isset($validated['interest_id'])) {
            $interestId = $validated['interest_id'] ?? $topic->interest_id;
            $slug = $validated['slug'] ?? $topic->slug;

            $exists = Topic::where('interest_id', $interestId)
                ->where('slug', $slug)
                ->where('id', '!=', $topic->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'A topic with this slug already exists for this interest.',
                    'errors' => ['slug' => ['The slug must be unique within this interest.']]
                ], 422);
            }
        }

        $topic->update($validated);

        return response()->json([
            'message' => 'Topic updated successfully',
            'topic' => $topic->load('interest'),
        ]);
    }

    /**
     * Remove the specified topic
     *
     * @param \App\Models\Topic $topic
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Topic $topic): JsonResponse
    {
        $topic->delete();

        return response()->json([
            'message' => 'Topic deleted successfully',
        ], 200);
    }
}
