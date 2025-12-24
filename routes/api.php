<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InterestController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupTagController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Resource routes for Interests, Topics, Tags, Groups, GroupTag
Route::apiResource('interests', InterestController::class);
Route::apiResource('topics', TopicController::class);
Route::apiResource('tags', TagController::class);
Route::apiResource('groups', GroupController::class);
Route::apiResource('group-tags', GroupTagController::class);
