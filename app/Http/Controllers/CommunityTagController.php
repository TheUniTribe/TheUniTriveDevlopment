<?php

namespace App\Http\Controllers;

use App\Models\CommunityTag;
use Illuminate\Http\Request;

class CommunityTagController extends Controller
{
    /**
     * ADD
     * Create a new community-tag record
     */
    public function store(Request $request, CommunityTag $communityTag)
    {
        $id = $communityTag->add([
            'community_id' => $request->community_id,
            'tag_id' => $request->tag_id,
        ]);

        return response()->json([
            'id' => $id,
        ]);
    }

    /**
     * MODIFY
     * Update an existing community-tag record
     *
     * Uses Route Model Binding
     */
    public function update(Request $request, CommunityTag $communityTag)
    {
        $updated = $communityTag->modify($communityTag->id, [
            'community_id' => $request->community_id,
            'tag_id' => $request->tag_id,
        ]);

        return response()->json([
            'updated' => $updated,
        ]);
    }

    /**
     * REMOVE
     * Delete a community-tag record by ID
     *
     * Uses Route Model Binding
     */
    public function destroy(CommunityTag $communityTag)
    {
        $deleted = $communityTag->remove($communityTag->id);

        return response()->json([
            'deleted' => $deleted,
        ]);
    }

    /**
     * REMOVE (by community + tag)
     * Composite-key delete
     */
    public function removeByCommunityAndTag(
        int $communityId,
        int $tagId,
        CommunityTag $communityTag
    ) {
        $deleted = $communityTag->removeByCommunityAndTag(
            $communityId,
            $tagId
        );

        return response()->json([
            'deleted' => $deleted,
        ]);
    }
}
