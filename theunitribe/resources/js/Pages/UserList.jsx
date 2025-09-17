import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { 
  FiUser, FiMail, FiKey, FiPlus, FiMinus,
  FiCheck, FiRefreshCw, FiFilter, FiSearch,
  FiSave, FiX, FiEdit, FiAlertCircle
} from 'react-icons/fi';

export default function UserList({ users: initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [currentUserRoles, setCurrentUserRoles] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [originalRoles, setOriginalRoles] = useState({});

    // Initialize state from props
    useEffect(() => {
        const initialSelectedRoles = {};
        const initialCurrentUserRoles = {};
        
        initialUsers.forEach(user => {
            initialSelectedRoles[user.id] = user.roles?.map(role => role.id) || [];
            initialCurrentUserRoles[user.id] = user.roles?.map(role => role.id) || [];
        });
        
        setSelectedRoles(initialSelectedRoles);
        setCurrentUserRoles(initialCurrentUserRoles);
    }, [initialUsers]);

    // Fetch available roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/users/roles');
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
        
        fetchRoles();
    }, []);

    // Filter users based on search term and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole ? 
            (currentUserRoles[user.id] || []).includes(parseInt(filterRole)) : true;
        
        return matchesSearch && matchesRole;
    });

    const toggleRoleSelection = (userId, roleId) => {
        setSelectedRoles(prev => {
            const currentRoles = prev[userId] || [];
            const roleIndex = currentRoles.indexOf(roleId);
            
            let updatedRoles;
            if (roleIndex > -1) {
                updatedRoles = [
                    ...currentRoles.slice(0, roleIndex),
                    ...currentRoles.slice(roleIndex + 1)
                ];
            } else {
                updatedRoles = [...currentRoles, roleId];
            }
            
            return {
                ...prev,
                [userId]: updatedRoles,
            };
        });
    };

    const updateLoadingState = (userId, isLoading) => {
        setLoadingStates(prev => ({
            ...prev,
            [userId]: isLoading
        }));
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const startEditing = (userId) => {
        setEditingUser(userId);
        setOriginalRoles({
            ...originalRoles,
            [userId]: [...(selectedRoles[userId] || [])]
        });
    };

    const cancelEditing = (userId) => {
        setSelectedRoles({
            ...selectedRoles,
            [userId]: [...(originalRoles[userId] || [])]
        });
        setEditingUser(null);
    };

    const hasChanges = (userId) => {
        const current = selectedRoles[userId] || [];
        const original = originalRoles[userId] || [];
        return JSON.stringify(current.sort()) !== JSON.stringify(original.sort());
    };

    const handleAssignRoles = async (userId) => {
        const rolesToAssign = selectedRoles[userId] || [];
        if (rolesToAssign.length === 0) return;

        updateLoadingState(userId, true);
        
        try {
            await axios.post(route('users.assignRole', userId), {
                roleIds: rolesToAssign
            });
            
            // Update the UI immediately
            setCurrentUserRoles(prev => ({
                ...prev,
                [userId]: rolesToAssign
            }));
            
            // Update the users data to reflect changes
            setUsers(prev => prev.map(user => {
                if (user.id === userId) {
                    return {
                        ...user,
                        roles: rolesToAssign.map(roleId => 
                            roles.find(role => role.id === roleId) || { id: roleId, name: 'Unknown' }
                        )
                    };
                }
                return user;
            }));
            
            showSuccess('Roles updated successfully');
            setEditingUser(null);
        } catch (error) {
            console.error('Role assignment failed:', error);
            showSuccess(`Failed to update roles: ${error.response?.data?.message || error.message}`);
        } finally {
            updateLoadingState(userId, false);
        }
    };

    const isRoleSelected = (userId, roleId) => {
        return (selectedRoles[userId] || []).includes(roleId);
    };

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown Role';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                            {users.length} users, {roles.length} roles
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="User List" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {successMessage && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            successMessage.includes('Failed') 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                        }`}>
                            <div className="flex items-center">
                                {successMessage.includes('Failed') ? (
                                    <FiX className="mr-2" />
                                ) : (
                                    <FiCheck className="mr-2" />
                                )}
                                {successMessage}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-6 bg-white shadow-sm sm:rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiFilter className="text-gray-400" />
                                </div>
                                <select
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <FiUser className="mr-1" /> User
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <FiMail className="mr-1" /> Email
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <FiKey className="mr-1" /> Current Roles
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role Management
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {user.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-wrap gap-1">
                                                            {currentUserRoles[user.id]?.length > 0 ? (
                                                                currentUserRoles[user.id].map(roleId => (
                                                                    <span 
                                                                        key={roleId}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                                    >
                                                                        {getRoleName(roleId)}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No roles</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="space-y-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                {roles.map((role) => (
                                                                    <button
                                                                        key={role.id}
                                                                        onClick={() => toggleRoleSelection(user.id, role.id)}
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center ${
                                                                            isRoleSelected(user.id, role.id)
                                                                                ? 'bg-indigo-600 text-white shadow-md'
                                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                        } ${
                                                                            editingUser === user.id ? 'cursor-pointer' : 'cursor-not-allowed'
                                                                        }`}
                                                                        disabled={editingUser !== user.id}
                                                                    >
                                                                        {role.name}
                                                                        {isRoleSelected(user.id, role.id) && (
                                                                            <FiCheck className="ml-1" size={12} />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="flex gap-2">
                                                                {editingUser === user.id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleAssignRoles(user.id)}
                                                                            disabled={!hasChanges(user.id) || loadingStates[user.id]}
                                                                            className={`flex items-center px-3 py-1 text-xs font-medium rounded-md ${
                                                                                hasChanges(user.id)
                                                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                            }`}
                                                                        >
                                                                            {loadingStates[user.id] ? (
                                                                                <FiRefreshCw className="animate-spin mr-1" size={14} />
                                                                            ) : (
                                                                                <>
                                                                                    <FiSave className="mr-1" size={14} />
                                                                                    Save Changes
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => cancelEditing(user.id)}
                                                                            className="flex items-center px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                                                        >
                                                                            <FiX className="mr-1" size={14} />
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => startEditing(user.id)}
                                                                        className="flex items-center px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                                    >
                                                                        <FiEdit className="mr-1" size={14} />
                                                                        Edit Roles
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {editingUser === user.id && hasChanges(user.id) && (
                                                                <div className="text-xs text-yellow-600 flex items-center">
                                                                    <FiAlertCircle className="mr-1" size={12} />
                                                                    You have unsaved changes
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                    No users found matching your criteria
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}