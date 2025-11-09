<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * Follow a user.
     */
    public function follow(Request $request, $userId)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($userId);

        if ($user->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot follow yourself.'], 400);
        }

        $follow = Follow::where('follower_id', $user->id)
                         ->where('followed_id', $targetUser->id)
                         ->first();

        if ($follow) {
            return response()->json(['message' => 'Already following this user.'], 400);
        }

        Follow::create([
            'follower_id' => $user->id,
            'followed_id' => $targetUser->id,
            'is_accepted' => $targetUser->account_type === 'private' ? false : true,
            'source' => $request->input('source', 'manual'),
        ]);

        return response()->json(['message' => 'Follow request sent.'], 201);
    }

    /**
     * Unfollow a user.
     */
    public function unfollow($userId)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($userId);

        $follow = Follow::where('follower_id', $user->id)
                         ->where('followed_id', $targetUser->id)
                         ->first();

        if (!$follow) {
            return response()->json(['message' => 'Not following this user.'], 400);
        }

        $follow->delete();

        return response()->json(['message' => 'Unfollowed successfully.']);
    }

    /**
     * Accept a follow request.
     */
    public function acceptFollow($followId)
    {
        $user = Auth::user();
        $follow = Follow::where('followed_id', $user->id)
                         ->where('id', $followId)
                         ->firstOrFail();

        $follow->update(['is_accepted' => true]);

        return response()->json(['message' => 'Follow request accepted.']);
    }

    /**
     * Block a user.
     */
    public function block($userId)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($userId);

        $follow = Follow::where('follower_id', $user->id)
                         ->where('followed_id', $targetUser->id)
                         ->first();

        if ($follow) {
            $follow->update(['blocked_at' => now()]);
        } else {
            Follow::create([
                'follower_id' => $user->id,
                'followed_id' => $targetUser->id,
                'blocked_at' => now(),
            ]);
        }

        return response()->json(['message' => 'User blocked.']);
    }

    /**
     * Unblock a user.
     */
    public function unblock($userId)
    {
        $user = Auth::user();
        $targetUser = User::findOrFail($userId);

        $follow = Follow::where('follower_id', $user->id)
                         ->where('followed_id', $targetUser->id)
                         ->first();

        if ($follow && $follow->blocked_at) {
            $follow->update(['blocked_at' => null]);
        }

        return response()->json(['message' => 'User unblocked.']);
    }
}
