<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\{
    ProfileController,
    LoginController,
    RegisterController,
    Auth\SocialAuthController,
    RolePermissionController,
    CommunityController,
    InterestController,
    TopicController,
    TagController,
    UserController,
    LocationController,
    ForumController,
    NetworkController,
    BlogController,
    ArticleController
};

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Auth::check()
        ? redirect('/home')
        : Inertia::render('Welcome');
});

/* -------------------- AUTH -------------------- */
Route::post('/register', [RegisterController::class, 'registration'])->name('register');
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

/* -------------------- SOCIAL LOGIN -------------------- */
Route::get('/login/{provider}', [SocialAuthController::class, 'redirectToProvider']);
Route::get('/login/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);

/*
|--------------------------------------------------------------------------
| PUBLIC DISCOVERY (Domain Correct)
|--------------------------------------------------------------------------
*/

/* -------- Interests -------- */
Route::get('/interests', [InterestController::class, 'index']);
Route::get('/interests/{interest}/topics', [TopicController::class, 'byInterest']);

/* -------- Topics -------- */
Route::get('/topics', [TopicController::class, 'index']);
Route::get('/topics/{topic}/communities', [CommunityController::class, 'byTopic']);

/* -------- Tags -------- */
Route::get('/tags', [TagController::class, 'index']);
Route::get('/tags/{tag}/communities', [CommunityController::class, 'byTag']);
Route::get('/communities/{community}/tags', [CommunityController::class, 'tagsByCommunity']);

/*
|--------------------------------------------------------------------------
| PUBLIC COMMUNITY ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('communities')->group(function () {

    Route::get('/', [CommunityController::class, 'index']);
    Route::get('/published', [CommunityController::class, 'published']);
    Route::get('/trending', [CommunityController::class, 'trending']);
    Route::get('/featured', [CommunityController::class, 'featured']);
    Route::get('/search', [CommunityController::class, 'search']);
    Route::get('/leaderboard/top', [CommunityController::class, 'leaderboard']);

    // MUST be last (slug-based public page)
    Route::get('/{slug}', [CommunityController::class, 'show']);
});

/* -------------------- Profiles (Public) -------------------- */
Route::get('/profiles/{user}', [ProfileController::class, 'index']);

/* -------------------- Discussion Forum (Public) -------------------- */
Route::get('/discussionforum', fn() => Inertia::render('DiscussionForum'));

/*
|--------------------------------------------------------------------------
| DEV / UTILITY (PROTECT IN PROD)
|--------------------------------------------------------------------------
*/

Route::get('/run-seeder', function () {
    Artisan::call('migrate:fresh', ['--seed' => true]);

    return response()->json([
        'message' => 'Database reset & seeded',
        'output'  => Artisan::output()
    ]);
});

Route::get(
    '/show-usernames',
    fn() =>
    response()->json(DB::table('users')->pluck('email'))
);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /* -------------------- Dashboard -------------------- */
    Route::get(
        '/home',
        fn() =>
        Inertia::render('Home', ['content' => session('content', 'dashboard')])
    )->name('home');

    /* -------------------- Profile -------------------- */
    Route::prefix('profiles/{user}')->group(function () {

        Route::post('/', [ProfileController::class, 'update']);
        Route::patch('/', [ProfileController::class, 'update']);
        Route::delete('/', [ProfileController::class, 'destroy']);

        Route::post('/educations', [ProfileController::class, 'storeEducation']);
        Route::put('/educations/{education}', [ProfileController::class, 'updateEducation']);
        Route::delete('/educations/{education}', [ProfileController::class, 'destroyEducation']);

        Route::post('/experiences', [ProfileController::class, 'storeExperience']);
        Route::put('/experiences/{experience}', [ProfileController::class, 'updateExperience']);
        Route::delete('/experiences/{experience}', [ProfileController::class, 'destroyExperience']);
    });

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED COMMUNITY ACTIONS
    |--------------------------------------------------------------------------
    */

    Route::prefix('communities')->group(function () {

        /* -------- CRUD -------- */
        Route::post('/', [CommunityController::class, 'store']);
        Route::put('/{community}', [CommunityController::class, 'update']);
        Route::patch('/{community}', [CommunityController::class, 'update']);
        Route::delete('/{community}', [CommunityController::class, 'destroy']);

        /* -------- Member Actions -------- */
        Route::post('/{community}/join', [CommunityController::class, 'join']);
        Route::post('/{community}/leave', [CommunityController::class, 'leave']);

        /* -------- Workflow -------- */
        Route::post('/{community}/submit', [CommunityController::class, 'submitForApproval']);
        Route::post('/{community}/archive', [CommunityController::class, 'archive']);
        Route::post('/{community}/unarchive', [CommunityController::class, 'unarchive']);

        /* -------- Admin / Moderation -------- */
        Route::post('/{community}/approve', [CommunityController::class, 'approve']);
        Route::post('/{community}/reject', [CommunityController::class, 'reject']);
        Route::post('/{community}/block', [CommunityController::class, 'block']);
        Route::post('/{community}/unblock', [CommunityController::class, 'unblock']);
        Route::post('/{community}/verify', [CommunityController::class, 'verify']);
        Route::post('/{community}/unverify', [CommunityController::class, 'unverify']);
        Route::post('/{community}/feature', [CommunityController::class, 'feature']);
        Route::post('/{community}/unfeature', [CommunityController::class, 'unfeature']);
    });

    /* -------------------- Admin: Interests / Topics / Tags -------------------- */
    Route::resource('interests', InterestController::class)->except(['index']);
    Route::resource('topics', TopicController::class)->except(['index']);
    Route::resource('tags', TagController::class)->except(['index']);

    /* -------------------- Users / Roles -------------------- */
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/{user}/assign-role', [UserController::class, 'assignRole']);
        Route::post('/{user}/remove-role', [UserController::class, 'removeRole']);
        Route::get('/roles', [UserController::class, 'getAllRoles']);
        Route::get('/roles/{role}/permissions', [UserController::class, 'getRolePermissions']);
    });

    /* -------------------- Role Permissions -------------------- */
    Route::prefix('role-permissions')->group(function () {
        Route::post('/permissions', [RolePermissionController::class, 'storePermission']);
        Route::post('/{role}/permissions', [RolePermissionController::class, 'assignPermission']);
        Route::delete('/{role}/permissions/{permission}', [RolePermissionController::class, 'revokePermission']);
    });

    /* -------------------- Locations -------------------- */
    Route::prefix('locations')->group(function () {
        Route::get('/countries', [LocationController::class, 'countries']);
        Route::get('/regions', [LocationController::class, 'regions']);
        Route::get('/cities', [LocationController::class, 'cities']);
        Route::get('/pincodes', [LocationController::class, 'pincodes']);
    });

    /* -------------------- Content -------------------- */
    Route::resource('forums', ForumController::class);
    Route::resource('blog', BlogController::class);
    Route::resource('articles', ArticleController::class);
    Route::resource('networks', NetworkController::class);
});
