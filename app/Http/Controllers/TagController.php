<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Get all tags
     */
    public function index()
    {
        $tags = Tag::with('topic')
            ->withCount('communities')
            ->get();

        return response()->json($tags);
    }

    /**
     * Get tags by topic (PUBLIC - for React frontend)
     */
    public function byTopic($topicId)
    {
        $tags = Tag::where('topic_id', $topicId)
            // ->where('is_active', true)  // ← Optional: only active tags
            ->withCount('communities')
            ->get();

        return response()->json($tags);
    }

    /**
     * Store a new tag
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'topic_id' => 'required|exists:topics,id',
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100',
            'icon' => 'nullable|string|max:10',
            'description' => 'nullable|string',
        ]);

        // Check for duplicate slug within same topic
        $exists = Tag::where('topic_id', $validated['topic_id'])
            ->where('slug', $validated['slug'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A tag with this slug already exists for this topic',
            ], 422);
        }

        $tag = Tag::create($validated);

        return response()->json([
            'message' => 'Tag created successfully',
            'tag' => $tag,
        ], 201);
    }

    /**
     * Show a specific tag
     */
    public function show(Tag $tag)
    {
        $tag->load('topic');
        return response()->json($tag);
    }

    /**
     * Update a tag
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:100',
            'icon' => 'nullable|string|max:10',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        // Check for duplicate slug if slug is being updated
        if (isset($validated['slug'])) {
            $exists = Tag::where('topic_id', $tag->topic_id)
                ->where('slug', $validated['slug'])
                ->where('id', '!=', $tag->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'A tag with this slug already exists for this topic',
                ], 422);
            }
        }

        $tag->update($validated);

        return response()->json([
            'message' => 'Tag updated successfully',
            'tag' => $tag,
        ]);
    }

    /**
     * Delete a tag
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json([
            'message' => 'Tag deleted successfully',
        ]);
    }
}
