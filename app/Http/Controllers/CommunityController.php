<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\CommunityTag;
use App\Models\CommunityTopic;
use App\Models\Interest;
use App\Models\Topic;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    protected Community $community;
    protected CommunityMember $communityMember;
    protected CommunityTag $communityTag;
    protected CommunityTopic $communityTopic;
    protected Interest $interest;
    protected Topic $topic;
    protected Tag $tag;

    public function __construct(
        Community $community,
        CommunityMember $communityMember,
        CommunityTag $communityTag,
        CommunityTopic $communityTopic,
        Interest $interest,
        Topic $topic,
        Tag $tag
    ) {
        $this->community = $community;
        $this->communityMember = $communityMember;
        $this->communityTag = $communityTag;
        $this->communityTopic = $communityTopic;
        $this->interest = $interest;
        $this->topic = $topic;
        $this->tag = $tag;
    }

    /* =========================================================================
 | DISCOVERY ROUTES
 |========================================================================*/

    /**
     * GET /topics/{topic}/communities
     */
    public function byTopic($topicId)
    {
        // Get communities by topic using community_topic pivot table
        $communityIds = $this->communityTopic
            ->where('topic_id', $topicId)
            ->pluck('community_id')
            ->toArray();

        $communities = $this->community
            ->whereIn('id', $communityIds)
            ->where('status', 'published')
            ->orderBy('active_members_count', 'desc')
            ->get();

        // Add joined status
        $userId = Auth::id();
        if ($userId) {
            // Ensure user_id is an integer for PostgreSQL compatibility
            $userId = (int) $userId;
            
            $joinedCommunityIds = $this->communityMember
                ->where('user_id', $userId)
                ->where('status', 'active')
                ->pluck('community_id')
                ->toArray();

            $communities->each(function ($community) use ($joinedCommunityIds) {
                $community->joined = in_array($community->id, $joinedCommunityIds);
            });
        } else {
            $communities->each(function ($community) {
                $community->joined = false;
            });
        }

        return response()->json($communities);
    }
    /* =========================================================================
     | STORE COMMUNITY
     |========================================================================*/

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Basic Info
            'name' => 'required|string|max:100|unique:communities,name',
            'description' => 'required|string|max:1000',
            'rules' => 'nullable|string|max:5000',
            'about' => 'nullable|string|max:2000',

            // Categorization
            'interest_id' => 'required|exists:interests,id',
            'topic_id' => 'required|exists:topics,id',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'integer|exists:tags,id',

            // Type & Settings
            'type' => 'required|in:professional,student',

            // Membership Settings
            'require_manual_approval' => 'nullable|boolean',
            'eligibility_criteria' => 'nullable|string|max:2000',
            'max_members' => 'nullable|integer|min:1|max:1000000',

            // Privacy & Access
            'visibility' => 'required|in:public,private,unlisted,invite_only',
            'join_policy' => 'required|in:open,request,invite,application',
            'content_visibility' => 'nullable|in:public,members_only,verified_members_only',

            // Professional Settings
            'require_linkedin_verification' => 'nullable|boolean',

            // Visual Branding
            'theme_color' => 'nullable|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'badge_color' => 'nullable|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'avatar' => 'nullable|image|max:5120',
            'cover_image' => 'nullable|image|max:5120',
            'logo' => 'nullable|image|max:5120',

            // Member Experience
            'welcome_message' => 'nullable|string|max:1000',

            // Compliance
            'terms_of_service' => 'nullable|string|max:5000',
            'privacy_policy' => 'nullable|string|max:5000',

            // Integration
            'enable_api_access' => 'nullable|boolean',
            'webhook_url' => 'nullable|url|max:500',

            // JSON Fields
            'faqs' => 'nullable',
            'verification_questions' => 'nullable',
            'custom_theme' => 'nullable',
        ]);

        /* -------- SLUG -------- */
        $slug = Str::slug($validated['name']);
        $i = 1;
        while ($this->community->where('slug', $slug)->exists()) {
            $slug = Str::slug($validated['name']) . '-' . $i++;
        }

        /* -------- FILES -------- */
        $avatar = $request->hasFile('avatar')
            ? $request->file('avatar')->store('communities/avatars', 'public')
            : null;

        $cover = $request->hasFile('cover_image')
            ? $request->file('cover_image')->store('communities/covers', 'public')
            : null;

        $logo = $request->hasFile('logo')
            ? $request->file('logo')->store('communities/logos', 'public')
            : null;

        /* -------- JSON -------- */
        $faqs = isset($validated['faqs'])
            ? json_encode(is_string($validated['faqs']) ? json_decode($validated['faqs'], true) : $validated['faqs'])
            : null;

        $verification = isset($validated['verification_questions'])
            ? json_encode(is_string($validated['verification_questions'])
                ? json_decode($validated['verification_questions'], true)
                : $validated['verification_questions'])
            : null;

        $theme = isset($validated['custom_theme'])
            ? (is_string($validated['custom_theme'])
                ? json_decode($validated['custom_theme'], true)
                : $validated['custom_theme'])
            : [];

        /* -------- CREATE COMMUNITY -------- */
        $communityId = $this->community->add([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'],
            'type' => $validated['type'],
            'visibility' => $validated['visibility'],
            'join_policy' => $validated['join_policy'],

        // Add all the missing fields
            'rules' => $validated['rules'] ?? null,
            'about' => $validated['about'] ?? null,
            'welcome_message' => $validated['welcome_message'] ?? null,
            'eligibility_criteria' => $validated['eligibility_criteria'] ?? null,
            'max_members' => $validated['max_members'] ?? null,
            'require_manual_approval' => $validated['require_manual_approval'] ?? false,
            'require_linkedin_verification' => $validated['require_linkedin_verification'] ?? false,
            'enable_api_access' => $validated['enable_api_access'] ?? false,
            'webhook_url' => $validated['webhook_url'] ?? null,
            'terms_of_service' => $validated['terms_of_service'] ?? null,
            'privacy_policy' => $validated['privacy_policy'] ?? null,
            'content_visibility' => $validated['content_visibility'] ?? 'members_only',

            'created_by' => (int) Auth::id(),
            'owner_id' => (int) Auth::id(),
            'status' => 'published',
            'avatar' => $avatar,
            'cover_image' => $cover,
            'logo' => $logo,
            'theme_color' => $theme['primary_color'] ?? $validated['theme_color'] ?? '#3B82F6',
            'badge_color' => $theme['secondary_color'] ?? $validated['badge_color'] ?? '#10B981',
            'faqs' => $faqs,
            'verification_questions' => $verification,
            'active_members_count' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /* -------- REST OF YOUR CODE (remains same) -------- */
        $this->communityTopic->add([
            'community_id' => $communityId,
            'topic_id' => $validated['topic_id'],
        ]);

        /* -------- OWNER MEMBER -------- */
        $this->communityMember->add([
            'community_id' => $communityId,
            'user_id' => (int) Auth::id(),
            'status' => 'active',
            'joined_at' => now(),
            'approved_at' => now(),
            'approved_by' => (int) Auth::id(),
            'member_rank' => 'legend', // Changed from 'founder' to 'legend'
            'member_level' => 1,
            'member_xp' => 0,
            'notifications_enabled' => true,
            'email_notifications' => true,
        ]);

        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagId) {
                $this->communityTag->add([
                    'community_id' => $communityId,
                    'tag_id' => $tagId,
                ]);
            }
            $this->tag->whereIn('id', $validated['tags'])->increment('usage_count');
        }

        // $this->interest->where('id', $validated['interest_id'])->increment('communities_count');
        // $this->topic->where('id', $validated['topic_id'])->increment('communities_count');

        $community = $this->community->find($communityId);
        $community->joined = true;

        return response()->json([
            'message' => 'Community created successfully',
            'community' => $community,
        ], 201);
    }

    /* =========================================================================
     | UPDATE COMMUNITY
     |========================================================================*/

    public function update(Request $request, $communityId)
    {
        $community = $this->community->findOrFail($communityId);

        if ((int) $community->owner_id !== (int) Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:communities,name,' . $communityId,
            'description' => 'sometimes|string|max:1000',
            'topic_id' => 'sometimes|exists:topics,id',
            'tags' => 'nullable|array|max:10',
            'tags.*' => 'integer|exists:tags,id',
            'avatar' => 'nullable|image|max:5120',
            'cover_image' => 'nullable|image|max:5120',
            'logo' => 'nullable|image|max:5120',
            'faqs' => 'nullable',
            'verification_questions' => 'nullable',
            'custom_theme' => 'nullable',
        ]);

        /* -------- SLUG -------- */
        if (isset($validated['name'])) {
            $slug = Str::slug($validated['name']);
            $i = 1;
            while ($this->community->where('slug', $slug)->where('id', '!=', $communityId)->exists()) {
                $slug = Str::slug($validated['name']) . '-' . $i++;
            }
            $validated['slug'] = $slug;
        }

        /* -------- FILE UPDATES -------- */
        foreach (['avatar', 'cover_image', 'logo'] as $img) {
            if ($request->hasFile($img)) {
                if ($community->$img) {
                    Storage::disk('public')->delete($community->$img);
                }
                $validated[$img] = $request->file($img)->store("communities/{$img}s", 'public');
            }
        }

        /* -------- JSON -------- */
        foreach (['faqs', 'verification_questions'] as $field) {
            if (isset($validated[$field])) {
                $validated[$field] = json_encode(
                    is_string($validated[$field])
                        ? json_decode($validated[$field], true)
                        : $validated[$field]
                );
            }
        }

        $validated['updated_at'] = now();
        $this->community->modify($communityId, $validated);

        /* -------- UPDATE TOPIC -------- */
        if (isset($validated['topic_id'])) {
            $this->communityTopic->where('community_id', $communityId)->delete();
            $this->communityTopic->add([
                'community_id' => $communityId,
                'topic_id' => $validated['topic_id'],
            ]);
        }

        /* -------- SYNC TAGS -------- */
        if (isset($validated['tags'])) {
            $existing = $this->communityTag
                ->where('community_id', $communityId)
                ->pluck('tag_id')
                ->toArray();

            $toAdd = array_diff($validated['tags'], $existing);
            $toRemove = array_diff($existing, $validated['tags']);

            foreach ($toAdd as $tagId) {
                $this->communityTag->add([
                    'community_id' => $communityId,
                    'tag_id' => $tagId,
                ]);
            }

            foreach ($toRemove as $tagId) {
                $this->communityTag->removeByCommunityAndTag($communityId, $tagId);
            }

            if ($toAdd) $this->tag->whereIn('id', $toAdd)->increment('usage_count');
            if ($toRemove) $this->tag->whereIn('id', $toRemove)->decrement('usage_count');
        }

        $community = $this->community->find($communityId);
        $community->joined = true;

        return response()->json([
            'message' => 'Community updated successfully',
            'community' => $community,
        ]);
    }
    /**
     * Join a community
     * POST /communities/{community}/join
     */
    public function join(Community $community)
    {
        $userId = (int) Auth::id();

        // Check if user is already a member
        $existingMember = $this->communityMember
            ->where('community_id', $community->id)
            ->where('user_id', $userId)
            ->first();

        if ($existingMember) {
            return response()->json([
                'success' => false,
                'message' => 'You are already a member of this community'
            ], 400);
        }

        // Check if community has reached max members
        if ($community->max_members && $community->active_members_count >= $community->max_members) {
            return response()->json([
                'success' => false,
                'message' => 'This community has reached its maximum member limit'
            ], 400);
        }

        // Add user to community
        $this->communityMember->add([
            'community_id' => $community->id,
            'user_id' => $userId,
            'status' => 'active',
            'joined_at' => now(),
            'approved_at' => now(),
            'approved_by' => $userId,
            'member_rank' => 'newbie', // ✅ Changed from 'newcomer' to 'newbie'
            'member_level' => 1,
            'member_xp' => 0,
            'notifications_enabled' => true,
            'email_notifications' => true,
        ]);

        // Increment active members count
        $this->community->modify($community->id, [
            'active_members_count' => $community->active_members_count + 1,
            'updated_at' => now(),
        ]);

        // Get updated community
        $updatedCommunity = $this->community->find($community->id);
        $updatedCommunity->joined = true;

        return response()->json([
            'success' => true,
            'message' => 'Successfully joined the community',
            'community' => $updatedCommunity
        ]);
    }

    /**
     * Leave a community
     * POST /communities/{community}/leave
     */
    public function leave(Community $community)
    {
        $userId = (int) Auth::id();

        // Check if user is a member
        $member = $this->communityMember
            ->where('community_id', $community->id)
            ->where('user_id', $userId)
            ->first();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'You are not a member of this community'
            ], 400);
        }

        // Check if user is the creator/owner
        if ((int) $community->created_by === $userId || (int) $community->owner_id === $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Community creators cannot leave their own community. Transfer ownership first.'
            ], 400);
        }

        // Remove user from community
        $this->communityMember
            ->where('community_id', $community->id)
            ->where('user_id', $userId)
            ->delete();

        // Decrement active members count
        $this->community->modify($community->id, [
            'active_members_count' => max(0, $community->active_members_count - 1),
            'updated_at' => now(),
        ]);

        // Get updated community
        $updatedCommunity = $this->community->find($community->id);
        $updatedCommunity->joined = false;

        return response()->json([
            'success' => true,
            'message' => 'Successfully left the community',
            'community' => $updatedCommunity
        ]);
    }
}
