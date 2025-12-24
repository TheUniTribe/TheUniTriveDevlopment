<?php

namespace App\Http\Controllers;

use App\Models\GroupTag;
use Illuminate\Http\Request;

class GroupTagController extends Controller
{
    public function index()
    {
        $groupTags = GroupTag::with('group', 'tag')->get();
        return response()->json($groupTags);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'tag_id' => 'required|exists:tags,id',
        ]);

        $groupTag = GroupTag::create($request->only('group_id', 'tag_id'));
        return response()->json($groupTag, 201);
    }

    public function show($id)
    {
        $groupTag = GroupTag::with('group', 'tag')->findOrFail($id);
        return response()->json($groupTag);
    }

    public function update(Request $request, $id)
    {
        $groupTag = GroupTag::findOrFail($id);
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'tag_id' => 'required|exists:tags,id',
        ]);
        $groupTag->update($request->only('group_id', 'tag_id'));
        return response()->json($groupTag);
    }

    public function destroy($id)
    {
        $groupTag = GroupTag::findOrFail($id);
        $groupTag->delete();
        return response()->json(null, 204);
    }
}
