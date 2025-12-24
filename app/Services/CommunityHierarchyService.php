<?php

namespace App\Services;

use App\Models\Community;
use App\Models\Interest;
use App\Models\Topic;
use App\Models\Tag;
use Illuminate\Support\Collection;

class CommunityHierarchyService
{
    /**
     * Get complete hierarchy tree: Interests → Topics → Tags → Communities
     */
    public function getCompleteHierarchy(): array
    {
        $interests = Interest::with(['topics.tags'])
            ->orderBy('is_trending', 'desc')
            ->orderBy('members_count', 'desc')
            ->get();

        $hierarchy = [];

        foreach ($interests as $interest) {
            $interestData = [
                'id' => $interest->id,
                'name' => $interest->name,
                'icon' => $interest->icon,
                'color_class' => $interest->color_class,
                'is_trending' => $interest->is_trending,
                'members_count' => $interest->members_count,
                'topics' => []
            ];


    /**
     * Get topics for a specific interest
     */
    public function getTopicsForInterest(int $interestId): Collection
    {
        return Topic::where('interest_id', $interestId)
            ->with('tags')
            ->orderBy('communities_count', 'desc')
            ->get();
    }

    /**
     * Get tags for a specific topic
     */
    public function getTagsForTopic(int $topicId): Collection
    {
        $topic = Topic::with('tags')->find($topicId);
        return $topic ? $topic->tags : collect([]);
    }

    /**
     * Get communities with full hierarchy filtering
     */
    public function getCommunitiesWithFilters(
        ?int $interestId = null,
        ?int $topicId = null,
        ?array $tagIds = null,
        ?string $search = null
    ): Collection {
        $query = Community::query()
            ->where('status', 'published')
            ->with(['interest', 'topic', 'tags']);

        if ($interestId) {
            $query->where('interest_id', $interestId);
        }

        if ($topicId) {
            $query->where('topic_id', $topicId);
        }

        if ($tagIds && count($tagIds) > 0) {
            $query->whereHas('tags', function($q) use ($tagIds) {
                $q->whereIn('tags.id', $tagIds);
            });
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        return $query->orderByDesc('is_featured')
            ->orderBy('featured_order')
            ->orderByDesc('level')
            ->get();
    }

    /**
     * Validate hierarchy consistency
     */
    public function validateHierarchy(int $interestId, int $topicId, array $tagIds): array
    {
        $errors = [];

        // Check if topic belongs to interest
        $topic = Topic::find($topicId);
        if (!$topic || $topic->interest_id != $interestId) {
            $errors[] = 'Selected topic does not belong to the selected interest';
        }

        // Check if tags belong to topic
        if ($topic) {
            $topicTagIds = $topic->tags->pluck('id')->toArray();
            $invalidTags = array_diff($tagIds, $topicTagIds);
            
            if (count($invalidTags) > 0) {
                $errors[] = 'Some selected tags do not belong to the selected topic';
            }
        }

        return $errors;
    }

    /**
     * Get statistics for hierarchy levels
     */
    public function getHierarchyStats(): array
    {
        return [
            'interests' => [
                'total' => Interest::count(),
                'trending' => Interest::where('is_trending', true)->count(),
                'total_members' => Interest::sum('members_count')
            ],
            'topics' => [
                'total' => Topic::count(),
                'active' => Topic::where('is_active', true)->count(),
                'total_communities' => Topic::sum('communities_count')
            ],
            'tags' => [
                'total' => Tag::count(),
                'active' => Tag::where('is_active', true)->count(),
                'total_usage' => Tag::sum('usage_count')
            ],
            'communities' => [
                'total' => Community::count(),
                'published' => Community::where('status', 'published')->count(),
                'total_members' => Community::sum('members_count')
            ]
        ];
    }

    /**
     * Sync community tags and update counts
     */
    public function syncCommunityTags(Community $community, array $tagIds): Community
    {
        // Get old tags
        $oldTagIds = $community->tags->pluck('id')->toArray();

        // Sync tags
        $community->tags()->sync($tagIds);

        // Update usage counts
        // Decrement old tags
        foreach ($oldTagIds as $oldTagId) {
            if (!in_array($oldTagId, $tagIds)) {
                $tag = Tag::find($oldTagId);
                if ($tag) {
                    $tag->decrementUsage();
                }
            }
        }

        // Increment new tags
        foreach ($tagIds as $newTagId) {
            if (!in_array($newTagId, $oldTagIds)) {
                $tag = Tag::find($newTagId);
                if ($tag) {
                    $tag->incrementUsage();
                }
            }
        }

        return $community->fresh('tags');
    }

    /**
     * Get breadcrumb trail for a community
     */
    public function getCommunityBreadcrumb(Community $community): array
    {
        return [
            'interest' => $community->interest ? [
                'id' => $community->interest->id,
                'name' => $community->interest->name,
                'icon' => $community->interest->icon
            ] : null,
            'topic' => $community->topic ? [
                'id' => $community->topic->id,
                'name' => $community->topic->name,
                'icon' => $community->topic->icon
            ] : null,
            'tags' => $community->tags->map(function($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'icon' => $tag->icon
                ];
            })->toArray(),
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'slug' => $community->slug
            ]
        ];
    }
}
