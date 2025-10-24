<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Display the user's profile.
     */
    public function index(User $user): Response
    {
        return Inertia::render('Profile/Index', [
            'user' => $user,
            'discussionItems' => [
                [
                    'id' => 1,
                    'title' => 'Optimizing React renders with memo',
                    'tag' => 'Popular',
                    'when' => '2d ago',
                    'snippet' => 'Tips on profiling components and reducing unnecessary re-renders...',
                ],
                [
                    'id' => 2,
                    'title' => 'Best practices for Tailwind theming',
                    'tag' => 'Latest',
                    'when' => '5h ago',
                    'snippet' => 'A compact strategy for color tokens and dark mode...',
                ],
                [
                    'id' => 3,
                    'title' => 'Best practices for React theming',
                    'tag' => 'Best',
                    'when' => '10h ago',
                    'snippet' => 'A compact strategy for color tokens and dark mode...',
                ],
            ],
            'repStats' => [
                ['label' => 'Upvotes', 'value' => 1280],
                ['label' => 'Marks Accepted', 'value' => 214],
                ['label' => 'Answers', 'value' => 356],
                ['label' => 'Badges', 'value' => 18],
            ],
            'repDetails' => [
                ['category' => 'React', 'count' => 620, 'last' => '2d ago'],
                ['category' => 'Tailwind', 'count' => 280, 'last' => '5h ago'],
                ['category' => 'JavaScript', 'count' => 380, 'last' => '1w ago'],
                ['category' => 'Badges Earned', 'count' => 18, 'last' => '1d ago'],
            ],
            'activities' => [
                ['id' => 1, 'icon' => '🧩', 'title' => 'Commented on Hooks vs Signals', 'when' => 'Yesterday'],
                ['id' => 2, 'icon' => '✅', 'title' => 'Answer accepted in Debouncing inputs', 'when' => '2 days ago'],
            ],
            'comments' => [
                [
                    'id' => 1,
                    'name' => 'Mark T.',
                    'when' => '1h ago',
                    'text' => 'Loved the memoization tip! It helped reduce our bundle size significantly.',
                    'avatar' => 'https://i.pravatar.cc/72?img=7',
                ],
                [
                    'id' => 2,
                    'name' => 'Isha P.',
                    'when' => '3h ago',
                    'text' => 'Please share more on performance budgets. We\'re struggling with this in our current project.',
                    'avatar' => 'https://i.pravatar.cc/72?img=14',
                ],
            ],
            'social' => [
                'LinkedIn' => 'https://linkedin.com/in/alexjohnson',
                'GitHub' => 'https://github.com/alexj',
                'Twitter' => 'https://twitter.com/alexdev',
            ],
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
