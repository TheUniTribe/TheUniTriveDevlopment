<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index()
    {
        $groups = Group::with('owner', 'parent')->get();
        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:groups',
            'description' => 'nullable|string',
            'about' => 'nullable|string',
            'type' => 'nullable|string',
            'parent_id' => 'nullable|exists:groups,id',
            'owner_id' => 'required|exists:users,id',
            'visibility' => 'required|in:public,private,hidden',
            'join_policy' => 'required|in:open,approval,invite_only',
            'group_rank' => 'numeric|min:0|max:5',
            'is_trending' => 'boolean',
            'ranking_metrics' => 'nullable|array',
            'avatar' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
            'member_count' => 'integer|min:0',
            'post_count' => 'integer|min:0',
            'resource_count' => 'integer|min:0',
            'is_active' => 'boolean',
            'last_activity_at' => 'nullable|date',
        ]);

        $group = Group::create($request->all());
        return response()->json($group, 201);
    }

    public function show($id)
    {
        $group = Group::with('owner', 'parent', 'tags')->findOrFail($id);
        return response()->json($group);
    }

    public function update(Request $request, $id)
    {
        $group = Group::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:groups,slug,' . $id,
            'description' => 'nullable|string',
            'about' => 'nullable|string',
            'type' => 'nullable|string',
            'parent_id' => 'nullable|exists:groups,id',
            'owner_id' => 'required|exists:users,id',
            'visibility' => 'required|in:public,private,hidden',
            'join_policy' => 'required|in:open,approval,invite_only',
            'group_rank' => 'numeric|min:0|max:5',
            'is_trending' => 'boolean',
            'ranking_metrics' => 'nullable|array',
            'avatar' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
            'member_count' => 'integer|min:0',
            'post_count' => 'integer|min:0',
            'resource_count' => 'integer|min:0',
            'is_active' => 'boolean',
            'last_activity_at' => 'nullable|date',
        ]);
        $group->update($request->all());
        return response()->json($group);
    }

    public function destroy($id)
    {
        $group = Group::findOrFail($id);
        $group->delete();
        return response()->json(null, 204);
    }
}
