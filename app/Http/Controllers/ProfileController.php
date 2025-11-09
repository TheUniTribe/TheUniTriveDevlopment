<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function index(User $user): JsonResponse
    {
        // Eager load relationships including Spatie roles
        $user->load(['educations', 'experiences', 'roles']);

        $profileData = $this->buildProfileData($user);
   $profileData['is_owner'] = auth()->check() && auth()->id() === $user->id;
        return response()->json($profileData);
    }

    private function buildProfileData($user): array
    {
        return [
            'user' => $this->extractUserBasicInfo($user),
            'profile' => $this->extractProfileInfo($user),
            'professional' => $this->extractProfessionalInfo($user),
            'network' => $this->buildNetworkInfo($user),
            'content' => $this->buildContentInfo($user),
            'reputation' => $this->buildReputationInfo($user),
        ];
    }

    private function extractUserBasicInfo($user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'full_name' => $user->getFullNameAttribute(),
            'profile_picture' => $user->profile_picture ?? $this->getDefaultAvatar(),
            'last_activity_at' => $user->last_activity_at,
            'is_verified' => $user->is_verified,
            'account_status' => $user->account_status,

            // ✅ Spatie roles (simple list)
            'roles' => $user->getRoleNames(), // e.g. ["admin", "writer"]
        ];
    }

    private function extractProfileInfo($user): array
    {
        return [
            'title' => $user->title,
            'bio' => $user->bio,
            'about' => $user->about,
            'location' => $user->location,
            'website_url' => $user->website_url,
            'phone' => $user->phone,
            'date_of_birth' => $user->date_of_birth,
            'gender' => $user->gender,
            'account_type' => $user->account_type,
            'profile_completeness' => $user->profile_completeness,
            'social_links' => $user->getSocialLinksAttribute(),
        ];
    }

    private function extractProfessionalInfo($user): array
    {
        return [
            'educations' => $user->educations->map(fn($education) => [
                'id' => $education->id,
                'institution' => $education->institution,
                'degree' => $education->degree,
                'specialization' => $education->specialization,
                'start_year' => $education->start_year,
                'end_year' => $education->end_year,
            ]),
            'experiences' => $user->experiences->map(fn($experience) => [
                'id' => $experience->id,
                'title' => $experience->title,
                'company' => $experience->company,
                'location' => $experience->location,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
            ]),
        ];
    }

    private function buildNetworkInfo($user): array
    {
        return [
            'followers' => $user->followers ?? 0,
            'following' => $user->following ?? 0,
            'connections' => $user->connections ?? 0,
            'follower_breakdown' => [
                'Engineering' => 50,
                'Design' => 30,
                'Product' => 20,
            ],
        ];
    }

    private function buildContentInfo($user): array
    {
        return [
            'about' => $user->about ?? 'No about information available.',
            'experience' => $user->experience ?? 'No experience information available.',
            'discussions' => [],
            'activities' => [],
            'comments' => [],
            'badges' => [],
        ];
    }

    private function buildReputationInfo($user): array
    {
        return [
            'stats' => [
                ['label' => 'Posts', 'value' => 0],
                ['label' => 'Likes', 'value' => 0],
                ['label' => 'Comments', 'value' => 0],
                ['label' => 'Followers', 'value' => $user->followers ?? 0],
            ],
            'details' => [
                ['category' => 'Discussions', 'count' => 0, 'last' => 'Never'],
                ['category' => 'Articles', 'count' => 0, 'last' => 'Never'],
                ['category' => 'Comments', 'count' => 0, 'last' => 'Never'],
            ],
        ];
    }

    private function getDefaultAvatar(): string
    {
        return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop';
    }
}
