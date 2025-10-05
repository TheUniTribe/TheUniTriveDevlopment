<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::firstOrCreate(['name' => 'view profiles']);
        Permission::firstOrCreate(['name' => 'edit profiles']);
        Permission::firstOrCreate(['name' => 'delete posts']);
        Permission::firstOrCreate(['name' => 'create posts']);
        Permission::firstOrCreate(['name' => 'moderate comments']);
        Permission::firstOrCreate(['name' => 'send messages']);

        // create roles and assign created permissions

        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);
        $roleAdmin->syncPermissions(Permission::all());

        $roleModerator = Role::firstOrCreate(['name' => 'moderator']);
        $roleModerator->syncPermissions(['delete posts', 'moderate comments']);

        $roleUser = Role::firstOrCreate(['name' => 'user']);
        $roleUser->syncPermissions(['view profiles', 'create posts', 'send messages']);

        $roleGuest = Role::firstOrCreate(['name' => 'guest']);
        $roleGuest->syncPermissions(['view profiles']);
    }
}
