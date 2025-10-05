<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ForumController extends Controller
{
    public function index()
    {
        $forums = Forum::all();
        return Inertia::render('Forum', [
            'forums' => $forums,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
        ]);

        Forum::create($request->only('title', 'description', 'category'));

        return Redirect::route('forums.index')->with('success', 'Forum created successfully.');
    }

    public function show($id)
    {
        $forum = Forum::findOrFail($id);
        return Inertia::render('Forum/Show', [
            'forum' => $forum,
        ]);
    }

    public function update(Request $request, $id)
    {
        $forum = Forum::findOrFail($id);
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
        ]);
        $forum->update($request->only('title', 'description', 'category'));

        return Redirect::route('forums.index')->with('success', 'Forum updated successfully.');
    }

    public function destroy($id)
    {
        $forum = Forum::findOrFail($id);
        $forum->delete();

        return Redirect::route('forums.index')->with('success', 'Forum deleted successfully.');
    }
}
