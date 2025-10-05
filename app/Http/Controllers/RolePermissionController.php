<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionController extends Controller
{
    public function index()
    {
        return Inertia::render('RolePermissions', [
            'roles' => Role::with('permissions:id,name')->get(),
            'permissions' => Permission::all(['id', 'name']),
            'initialDataLoaded' => true
        ]);
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name'
        ]);

        Permission::create(['name' => $request->name, 'guard_name' => 'web']);

        return response()->json([
            'message' => 'Permission created successfully'
        ]);
    }

    public function assignPermission(Request $request, Role $role)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id'
        ]);

        $role->givePermissionTo($request->permission_id);

        return response()->json([
            'message' => 'Permission assigned successfully'
        ]);
    }

    public function revokePermission(Role $role, Permission $permission)
    {
        $role->revokePermissionTo($permission);

        return response()->json([
            'message' => 'Permission revoked successfully'
        ]);
    }
}
