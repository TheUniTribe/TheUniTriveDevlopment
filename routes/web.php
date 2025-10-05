<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\RolePermissionController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/home', function () {
    return Inertia::render('Home', [
        'content' => session('content', 'dashboard') // Default to 'home' if no content in session
    ]);
})->name('home');

Route::post('/register', [RegisterController::class, 'registration'])->name('register');;
Route::post('/login', [LoginController::class, 'login'])->name('login');;
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/login/{provider}', [SocialAuthController::class, 'redirectToProvider'])
    ->name('social.login');

Route::get('/login/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])
    ->name('social.callback');
    
Route::get('/discussionforum', function () {
    return Inertia::render('DiscussionForum'); // Your Inertia page component
})->name('discussionforum');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/{user}', [ProfileController::class, 'editUser'])->name('profile.editUser');

    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');

    Route::post('/users/{user}/assign-role', [\App\Http\Controllers\UserController::class, 'assignRole'])->name('users.assignRole');
    Route::post('/users/{user}/remove-role', [\App\Http\Controllers\UserController::class, 'removeRole'])->name('users.removeRole');

    Route::get('/users/roles', [\App\Http\Controllers\UserController::class, 'getAllRoles'])->name('users.getAllRoles');
    Route::get('/roles/{roleId}/permissions', [\App\Http\Controllers\UserController::class, 'getRolePermissions'])->name('roles.getPermissions');
    Route::get('/rolePermissions', [RolePermissionController::class, 'index'])
        ->name('rolePermissions');
    Route::prefix('role-permissions')->group(function () {
        Route::post('/permissions', [RolePermissionController::class, 'storePermission']);
        Route::post('/{role}/permissions', [RolePermissionController::class, 'assignPermission']);
        Route::delete('/{role}/permissions/{permission}', [RolePermissionController::class, 'revokePermission']);
    });

    // Location API routes for cascading dropdowns
    Route::get('/countries', [\App\Http\Controllers\LocationController::class, 'countries']);
    Route::get('/regions', [\App\Http\Controllers\LocationController::class, 'regions']);
    Route::get('/cities', [\App\Http\Controllers\LocationController::class, 'cities']);
    Route::get('/pincodes', [\App\Http\Controllers\LocationController::class, 'pincodes']);

    // Forum routes
    Route::get('/forums', [\App\Http\Controllers\ForumController::class, 'index'])->name('forums.index');
    Route::post('/forums', [\App\Http\Controllers\ForumController::class, 'store'])->name('forums.store');
    Route::get('/forums/{id}', [\App\Http\Controllers\ForumController::class, 'show'])->name('forums.show');
    Route::put('/forums/{id}', [\App\Http\Controllers\ForumController::class, 'update'])->name('forums.update');
    Route::delete('/forums/{id}', [\App\Http\Controllers\ForumController::class, 'destroy'])->name('forums.destroy');

    Route::resource('networks', \App\Http\Controllers\NetworkController::class);

    // Blog routes
    Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
    Route::post('/blog', [\App\Http\Controllers\BlogController::class, 'store'])->name('blog.store');
    Route::get('/blog/{id}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');
    Route::put('/blog/{id}', [\App\Http\Controllers\BlogController::class, 'update'])->name('blog.update');
    Route::delete('/blog/{id}', [\App\Http\Controllers\BlogController::class, 'destroy'])->name('blog.destroy');

    // Article routes
    Route::get('/articles', [\App\Http\Controllers\ArticleController::class, 'index'])->name('articles.index');
    Route::post('/articles', [\App\Http\Controllers\ArticleController::class, 'store'])->name('articles.store');
    Route::get('/articles/{id}', [\App\Http\Controllers\ArticleController::class, 'show'])->name('articles.show');
    Route::put('/articles/{id}', [\App\Http\Controllers\ArticleController::class, 'update'])->name('articles.update');
    Route::delete('/articles/{id}', [\App\Http\Controllers\ArticleController::class, 'destroy'])->name('articles.destroy');

    // Discussion Forum route - using /discussionforum outside auth middleware
    // The /discussionforum route is already defined above for all users
});
