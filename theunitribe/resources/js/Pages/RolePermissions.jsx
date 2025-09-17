import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
  FiPlus, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiUsers,
  FiKey,
  FiShield,
  FiEdit,
  FiSearch
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';

export default function RolePermissions({ auth }) {
    const { props: { roles: initialRoles, permissions: initialPermissions, initialDataLoaded } } = usePage();
    const [roles, setRoles] = useState(initialRoles);
    const [permissions, setPermissions] = useState(initialPermissions);
    const [selectedRole, setSelectedRole] = useState(initialRoles[0] || null);
    const [newPermission, setNewPermission] = useState('');
    const [loading, setLoading] = useState({
        create: false,
        assign: null,
        revoke: null
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('permissions');

    // Filter permissions based on search term
    const filteredPermissions = permissions.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const availablePermissions = filteredPermissions.filter(p => 
        !selectedRole?.permissions?.some(rp => rp.id === p.id)
    );

    // Debounce search
    const debouncedSearch = debounce((term) => {
        setSearchTerm(term);
    }, 300);

    const handleCreatePermission = async () => {
        if (!newPermission.trim()) return;
        
        setLoading({...loading, create: true});
        try {
            const response = await axios.post('/role-permissions/permissions', {
                name: newPermission
            });
            
            setPermissions([...permissions, { id: response.data.id, name: newPermission }]);
            setNewPermission('');
            showSuccess('Permission created successfully');
            setErrors({});
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                showError('Failed to create permission');
            }
        } finally {
            setLoading({...loading, create: false});
        }
    };

    const handleAssignPermission = async (permissionId) => {
        setLoading({...loading, assign: permissionId});
        try {
            await axios.post(`/role-permissions/${selectedRole.id}/permissions`, {
                permission_id: permissionId
            });
            
            // Update the selected role's permissions
            const updatedRoles = roles.map(role => {
                if (role.id === selectedRole.id) {
                    const permission = permissions.find(p => p.id === permissionId);
                    return {
                        ...role,
                        permissions: [...(role.permissions || []), permission]
                    };
                }
                return role;
            });
            
            setRoles(updatedRoles);
            setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id));
            showSuccess('Permission assigned successfully');
        } catch (error) {
            showError('Failed to assign permission');
            console.error('Failed to assign permission:', error);
        } finally {
            setLoading({...loading, assign: null});
        }
    };

    const handleRevokePermission = async (permissionId) => {
        setLoading({...loading, revoke: permissionId});
        try {
            await axios.delete(`/role-permissions/${selectedRole.id}/permissions/${permissionId}`);
            
            // Update the selected role's permissions
            const updatedRoles = roles.map(role => {
                if (role.id === selectedRole.id) {
                    return {
                        ...role,
                        permissions: (role.permissions || []).filter(p => p.id !== permissionId)
                    };
                }
                return role;
            });
            
            setRoles(updatedRoles);
            setSelectedRole(updatedRoles.find(r => r.id === selectedRole.id));
            showSuccess('Permission revoked successfully');
        } catch (error) {
            showError('Failed to revoke permission');
            console.error('Failed to revoke permission:', error);
        } finally {
            setLoading({...loading, revoke: null});
        }
    };

    const showSuccess = (message) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 5000);
    };

    const showError = (message) => {
        setErrors({general: message});
        setTimeout(() => setErrors({}), 5000);
    };

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Role & Permission Management</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            {roles.length} roles, {permissions.length} permissions
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Role Permissions" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Status Messages */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <FiCheck className="mr-2" />
                                    {success}
                                </div>
                            </motion.div>
                        )}
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <FiX className="mr-2" />
                                    {errors.general}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Roles Panel */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FiUsers className="mr-2 text-indigo-600" />
                                    Roles
                                </h3>
                            </div>
                            <div className="p-4">
                                {initialDataLoaded ? (
                                    <div className="space-y-2">
                                        {roles.map(role => (
                                            <motion.div
                                                key={role.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ duration: 0.2 }}
                                                onClick={() => setSelectedRole(role)}
                                                className={`p-3 rounded-lg cursor-pointer transition-all ${
                                                    selectedRole?.id === role.id
                                                        ? 'bg-indigo-50 border-l-4 border-indigo-500 shadow-xs'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-medium text-gray-800">{role.name}</span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Created: {new Date(role.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs bg-indigo-100 text-indigo-800 rounded-full px-2 py-1">
                                                        {role.permissions?.length || 0} permissions
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Permissions Panel */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FiKey className="mr-2 text-blue-600" />
                                    {selectedRole ? `${selectedRole.name} Permissions` : 'Select a Role'}
                                </h3>
                            </div>
                            <div className="p-4">
                                {selectedRole ? (
                                    selectedRole.permissions?.length > 0 ? (
                                        <motion.div 
                                            className="space-y-2"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                visible: {
                                                    transition: {
                                                        staggerChildren: 0.05
                                                    }
                                                }
                                            }}
                                        >
                                            {selectedRole.permissions.map(permission => (
                                                <motion.div 
                                                    key={permission.id}
                                                    variants={itemVariants}
                                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <FiShield className="text-blue-500 mr-2" />
                                                        <span className="font-medium">{permission.name}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRevokePermission(permission.id)}
                                                        className={`p-2 rounded-full transition-colors ${
                                                            loading.revoke === permission.id 
                                                                ? 'text-gray-400' 
                                                                : 'text-red-500 hover:bg-red-50 hover:text-red-700'
                                                        }`}
                                                        disabled={loading.revoke === permission.id}
                                                        title="Revoke permission"
                                                    >
                                                        {loading.revoke === permission.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                        ) : (
                                                            <FiTrash2 size={16} />
                                                        )}
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FiKey className="mx-auto text-gray-300 text-4xl mb-2" />
                                            <p className="text-gray-500">No permissions assigned to this role</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-8">
                                        <FiUsers className="mx-auto text-gray-300 text-4xl mb-2" />
                                        <p className="text-gray-500">Please select a role to view permissions</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Permissions Panel */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <FiShield className="mr-2 text-green-600" />
                                        Permission Manager
                                    </h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setActiveTab('permissions')}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                activeTab === 'permissions' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            Permissions
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('create')}
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                activeTab === 'create' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            Create New
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                {activeTab === 'create' ? (
                                    <div className="mb-6">
                                        <label htmlFor="new-permission" className="block text-sm font-medium text-gray-700 mb-2">
                                            Create New Permission
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                id="new-permission"
                                                type="text"
                                                value={newPermission}
                                                onChange={(e) => setNewPermission(e.target.value)}
                                                placeholder="e.g., edit-posts"
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                disabled={loading.create}
                                                onKeyPress={(e) => e.key === 'Enter' && handleCreatePermission()}
                                            />
                                            <button
                                                onClick={handleCreatePermission}
                                                disabled={loading.create || !newPermission.trim()}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                                            >
                                                {loading.create ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <>
                                                        <FiPlus className="mr-1" />
                                                        Create
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <FiX className="mr-1" />
                                                {errors.name[0]}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative mb-4">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiSearch className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search permissions..."
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                onChange={(e) => debouncedSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {availablePermissions.length > 0 ? (
                                                <AnimatePresence>
                                                    {availablePermissions.map(permission => (
                                                        <motion.div
                                                            key={permission.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex items-center">
                                                                <FiShield className="text-green-500 mr-2" />
                                                                <span>{permission.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAssignPermission(permission.id)}
                                                                className={`p-2 rounded-full transition-colors ${
                                                                    loading.assign === permission.id 
                                                                        ? 'text-gray-400' 
                                                                        : 'text-green-500 hover:bg-green-50 hover:text-green-700'
                                                                }`}
                                                                disabled={loading.assign === permission.id}
                                                                title="Assign to role"
                                                            >
                                                                {loading.assign === permission.id ? (
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                                                ) : (
                                                                    <FiPlus size={16} />
                                                                )}
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <FiShield className="mx-auto text-gray-300 text-4xl mb-2" />
                                                    <p className="text-gray-500">
                                                        {searchTerm 
                                                            ? 'No permissions match your search'
                                                            : 'No available permissions to assign'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}