<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display user profile with all related data
     */
    public function index(User $user): JsonResponse
    {
        $user->load(['educations', 'experiences', 'links', 'roles']);

        $profileData = [
            'user' => $this->getUserData($user),
            'educations' => $this->getEducationsData($user),
            'experiences' => $this->getExperiencesData($user),
            'network' => $this->getNetworkData($user),
            'reputation' => $this->getReputationData($user),
            'is_owner' => $user->is(auth()->user()),
        ];

        return response()->json($profileData, 200);
    }

    /**
     * Update user profile (accepts partial updates)
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $this->validateUpdateRequest($request, $user);


        // Handle profile picture upload
        if ($request->hasFile('profile_pic')) {
            $this->handleProfilePictureUpload($request, $user);
        }
        // dd($request->all());
        // Update basic user fields
        $this->updateBasicFields($request, $user);

        // Update nested relationships
        $this->updateRelationships($request, $user);

        // Reload and return fresh data
        $user->load(['educations', 'experiences', 'links', 'roles']);

        $profileData = [
            'user' => $this->getUserData($user),
            'educations' => $this->getEducationsData($user),
            'experiences' => $this->getExperiencesData($user),
            'network' => $this->getNetworkData($user),
            'reputation' => $this->getReputationData($user),
            'is_owner' => $user->is(auth()->user()),
        ];

        return response()->json($profileData, 200);
    }

    // ============================================
    // VALIDATION
    // ============================================

    private function validateUpdateRequest(Request $request, User $user): array
    {
        // dd($request->all());
        return $request->validate([
            // Basic fields
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100', 'unique:users,username,' . $user->id],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:500'],
            'about' => ['nullable', 'string'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'in:male,female,other,prefer_not_to_say'],
            'website_url' => ['nullable', 'url', 'max:255'],

            // Profile picture
            'profile_pic' => ['nullable', 'file', 'image', 'max:2048'],
            'profile_pic_name' => ['nullable', 'string', 'max:255'],

            // Social links
            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required_with:social_links', 'in:twitter,linkedin,instagram,facebook,youtube,tiktok,github,website,custom'],
            'social_links.*.url' => ['required_with:social_links', 'url', 'max:500'],

            // Educations
            'educations' => ['nullable', 'array'],
            'educations.*.id' => ['nullable', 'integer', 'exists:user_educations,id'],
            'educations.*.institution' => ['string', 'max:255'],
            'educations.*.degree' => ['string', 'max:255'],
            'educations.*.specialization' => ['nullable', 'string', 'max:255'],
            'educations.*.start_date' => ['nullable', 'date'],
            'educations.*.end_date' => ['nullable', 'date', 'after:educations.*.start_date'],

            // Experiences
            'experiences' => ['nullable', 'array'],
            'experiences.*.id' => ['nullable', 'integer', 'exists:user_experiences,id'],
            'experiences.*.title' => ['required_with:experiences', 'string', 'max:100'],
            'experiences.*.company' => ['required_with:experiences', 'string', 'max:255'],
            'experiences.*.location' => ['nullable', 'string', 'max:255'],
            'experiences.*.start_date' => ['required_with:experiences', 'date'],
            'experiences.*.end_date' => ['nullable', 'date', 'after_or_equal:experiences.*.start_date'],
            'experiences.*.description' => ['nullable', 'string', 'max:1000'],
            'experiences.*.current' => ['nullable', 'boolean'],
        ]);
    }

    // ============================================
    // FILE HANDLING
    // ============================================

    private function handleProfilePictureUpload(Request $request, User $user): void
    {
        $file = $request->file('profile_pic');
        $origName = $request->input('profile_pic_name', $file->getClientOriginalName());
        $safeName = time() . '_' . preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $origName);

        $path = $file->storeAs('avatars', $safeName, 'public');
        $user->profile_pic = asset(Storage::url($path));
    }

    // ============================================
    // UPDATE OPERATIONS
    // ============================================

    private function updateBasicFields(Request $request, User $user): void
    {
        $fillableFields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'phone',
            'location',
            'title',
            'bio',
            'website_url',
            'gender',
            'date_of_birth',
            'about',
        ];

        $dataToUpdate = array_intersect_key(
            $request->all(),
            array_flip($fillableFields)
        );

        if (!empty($dataToUpdate)) {
            $user->update($dataToUpdate);
        }
    }

    private function updateRelationships(Request $request, User $user): void
    {
        if ($request->has('educations')) {
            $this->updateEducations($user, $request->input('educations', []));
        }

        if ($request->has('social_links')) {
            $this->updateSocialLinks($user, $request->input('social_links', []));
        }

        if ($request->has('experiences')) {
            $this->updateExperiences($user, $request->input('experiences', []));
        }
    }

    private function updateEducations(User $user, array $educations): void
    {
        $existingIds = $user->educations()->pluck('id')->toArray();

        foreach ($educations as $edu) {
            $data = [
                'institution' => $edu['institution'],
                'degree' => $edu['degree'],
                'specialization' => $edu['specialization'],
                'start_date' => $edu['start_date'],
                'end_date' => $edu['end_date'],
            ];

            $user->educations()->updateOrCreate(
                ['id' => $edu['id']],
                $data
            );
        }
        $user->educations()->whereNotIn('id', $existingIds)->delete();
    }

    private function updateExperiences(User $user, array $experiences): void
    {
        $existingIds = $user->experiences()->pluck('id')->toArray();

        foreach ($experiences as $exp) {
            if (!empty($exp['title']) && !empty($exp['company']) && !empty($exp['start_date'])) {
                $data = [
                    'title' => $exp['title'],
                    'company' => $exp['company'],
                    'location' => $exp['location'] ?? null,
                    'start_date' => $exp['start_date'],
                    'end_date' => $exp['end_date'] ?? null,
                    'description' => $exp['description'] ?? null,
                ];

                if (!empty($exp['id']) && in_array($exp['id'], $existingIds)) {
                    // Update existing record
                    $user->experiences()->where('id', $exp['id'])->update($data);
                } else {
                    // Create new record
                    $user->experiences()->create($data);
                }
            }
        }

        // Delete experiences that are no longer in the list
        $incomingIds = collect($experiences)->pluck('id')->filter()->values()->all();
        $user->experiences()->whereNotIn('id', $incomingIds)->delete();
    }

    private function updateSocialLinks(User $user, array $socialLinks): void
    {
        $allowedPlatforms = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube', 'tiktok', 'github', 'website', 'custom'];

        // Delete all existing links and recreate them
        $user->links()->delete();

        foreach ($socialLinks as $linkData) {
            if (in_array($linkData['platform'] ?? '', $allowedPlatforms) && !empty($linkData['url'])) {
                $data = [
                    'platform' => $linkData['platform'],
                    'url' => $linkData['url'],
                    'label' => $linkData['platform'] === 'custom' ? ($linkData['label'] ?? '') : $linkData['platform'],
                    'is_public' => $linkData['is_public'] ?? true,
                ];

                $user->links()->create($data);
            }
        }
    }

    // ============================================
    // DATA EXTRACTION FOR FRONTEND
    // ============================================

    private function getUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'full_name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
            'profile_pic' => $user->profile_pic,
            'is_verified' => (bool) $user->is_verified,
            'account_status' => $user->account_status,
            'created_at' => $user->created_at?->toDateTimeString(),
            'roles' => $user->roles->pluck('name')->toArray(),
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
            'social_links' => $user->links->toArray(),
        ];
    }

    private function getEducationsData(User $user): array
    {
        return $user->educations->map(function ($education) {
            return [
                'id' => $education->id,
                'institution' => $education->institution,
                'degree' => $education->degree,
                'specialization' => $education->specialization,
                'start_date' => $education->start_date,
                'end_date' => $education->end_date,
            ];
        })->toArray();
    }

    private function getExperiencesData(User $user): array
    {
        return $user->experiences->map(function ($experience) {
            return [
                'id' => $experience->id,
                'title' => $experience->title,
                'company' => $experience->company,
                'location' => $experience->location,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
                'description' => $experience->description,
                'current' => is_null($experience->end_date),
            ];
        })->toArray();
    }

    private function getNetworkData(User $user): array
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

    private function getReputationData(User $user): array
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

    // ============================================
    // INDIVIDUAL CRUD OPERATIONS FOR EDUCATIONS
    // ============================================

    /**
     * Store a new education record
     */
    public function storeEducation(Request $request, User $user): JsonResponse
    {
        // $this->authorize('update', $user);

        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ]);

        $education = $user->educations()->create($validated);

        return response()->json([
            'education' => [
                'id' => $education->id,
                'institution' => $education->institution,
                'degree' => $education->degree,
                'specialization' => $education->specialization,
                'start_date' => $education->start_date,
                'end_date' => $education->end_date,
            ]
        ], 201);
    }

    /**
     * Update an existing education record
     */
    public function updateEducation(Request $request, User $user, $educationId): JsonResponse
    {
        // $this->authorize('update', $user);

        $education = $user->educations()->findOrFail($educationId);

        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['nullable', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ]);

        $education->update($validated);

        return response()->json([
            'education' => [
                'id' => $education->id,
                'institution' => $education->institution,
                'degree' => $education->degree,
                'specialization' => $education->specialization,
                'start_date' => $education->start_date,
                'end_date' => $education->end_date,
            ]
        ], 200);
    }

    /**
     * Delete an education record
     */
    public function destroyEducation(User $user, $educationId): JsonResponse
    {
        // $this->authorize('update', $user);

        $education = $user->educations()->findOrFail($educationId);
        $education->delete();

        return response()->json(['message' => 'Education deleted successfully'], 200);
    }

    // ============================================
    // INDIVIDUAL CRUD OPERATIONS FOR EXPERIENCES
    // ============================================

    /**
     * Store a new experience record
     */
    public function storeExperience(Request $request, User $user): JsonResponse
    {
        // $this->authorize('update', $user);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'company' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'current' => ['nullable', 'boolean'],
        ]);

        // If current is true, set end_date to null
        if ($validated['current'] ?? false) {
            $validated['end_date'] = null;
        }

        $experience = $user->experiences()->create($validated);

        return response()->json([
            'experience' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'company' => $experience->company,
                'location' => $experience->location,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
                'description' => $experience->description,
                'current' => is_null($experience->end_date),
            ]
        ], 201);
    }

    /**
     * Update an existing experience record
     */
    public function updateExperience(Request $request, User $user, $experienceId): JsonResponse
    {
        // $this->authorize('update', $user);

        $experience = $user->experiences()->findOrFail($experienceId);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'company' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['nullable', 'string', 'max:1000'],
            'current' => ['nullable', 'boolean'],
        ]);

        // If current is true, set end_date to null
        if ($validated['current'] ?? false) {
            $validated['end_date'] = null;
        }

        $experience->update($validated);

        return response()->json([
            'experience' => [
                'id' => $experience->id,
                'title' => $experience->title,
                'company' => $experience->company,
                'location' => $experience->location,
                'start_date' => $experience->start_date,
                'end_date' => $experience->end_date,
                'description' => $experience->description,
                'current' => is_null($experience->end_date),
            ]
        ], 200);
    }

    /**
     * Delete an experience record
     */
    public function destroyExperience(User $user, $experienceId): JsonResponse
    {
        // $this->authorize('update', $user);

        $experience = $user->experiences()->findOrFail($experienceId);
        $experience->delete();

        return response()->json(['message' => 'Experience deleted successfully'], 200);
    }
}
