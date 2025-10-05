<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('UserList', [
            'users' => $users,
        ]);
    }

    public function assignRole(User $user, Request $request)
    {
        $request->validate([
            'roleIds' => 'required|array',
            'roleIds.*' => 'exists:roles,id',
        ]);

        // Sync roles - this will remove any roles not in the array
        $user->syncRoles($request->roleIds);

        return response()->json(['message' => 'Roles updated successfully']);
    }

    public function removeRole(User $user, Request $request)
    {
        $request->validate([
            'roleIds' => 'required|array',
            'roleIds.*' => 'exists:roles,id',
        ]);

        // Remove specific roles one by one
        foreach ($request->roleIds as $roleId) {
            $role = \Spatie\Permission\Models\Role::findById($roleId);
            if ($role) {
                $user->removeRole($role);
            }
        }

        return response()->json(['message' => 'Roles removed successfully']);
    }

    /**
     * Get roles of a user.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoles(User $user)
    {
        $roles = $user->getRoleNames();
        return response()->json(['roles' => $roles]);
    }

    /**
     * Get all available roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllRoles()
    {
        $roles = Role::all(['id', 'name']);
        return response()->json(['roles' => $roles]);
    }

    /**
     * Get permissions of a role.
     *
     * @param int $roleId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRolePermissions($roleId)
    {
        $role = Role::findById($roleId);
        if (!$role) {
            return response()->json(['error' => 'Role not found'], 404);
        }
        $permissions = $role->permissions()->pluck('name');
        return response()->json(['permissions' => $permissions]);
    }
}
