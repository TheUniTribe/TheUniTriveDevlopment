<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommunityMember;

class CommunityMemberController extends Controller
{
    public function index()
    {
        $members = CommunityMember::with(['community', 'user'])->get();
        return view('communityMembers.index', compact('members'));
    }

    public function create()
    {
        return view('communityMembers.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:active,pending,suspended,banned,left',
            'join_message' => 'nullable|string',
        ]);

        CommunityMember::create($validated);

        return redirect()->route('communityMembers.index')->with('success', 'Community member added successfully.');
    }

    public function show(CommunityMember $communityMember)
    {
        return view('communityMembers.show', compact('communityMember'));
    }

    public function edit(CommunityMember $communityMember)
    {
        return view('communityMembers.edit', compact('communityMember'));
    }

    public function update(Request $request, CommunityMember $communityMember)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,pending,suspended,banned,left',
            'join_message' => 'nullable|string',
        ]);

        $communityMember->update($validated);

        return redirect()->route('communityMembers.index')->with('success', 'Community member updated successfully.');
    }

    public function destroy(CommunityMember $communityMember)
    {
        $communityMember->delete();

        return redirect()->route('communityMembers.index')->with('success', 'Community member removed successfully.');
    }
}
