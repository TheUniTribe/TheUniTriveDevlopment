import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from '../Components/Dashboard/Card';
import { StatsGrid } from '../Components/Dashboard/StatsGrid';
import { QuickActions } from '../Components/Dashboard/QuickActions';
import { 
  FiUsers, FiActivity, FiCheckSquare, FiHeart, 
  FiShield, FiSettings, FiBarChart, FiClock, 
  FiDatabase, FiServer, FiHardDrive
} from 'react-icons/fi';

export default function Dashboard() {
    // Sample data - replace with actual data from your backend
    const stats = [
        { 
            title: 'Total Users', 
            value: '1,234', 
            change: '+12%', 
            icon: <FiUsers className="h-6 w-6 text-blue-500" />,
            color: 'bg-blue-50',
            changeType: 'positive'
        },
        { 
            title: 'Active Sessions', 
            value: '56', 
            change: '+3%', 
            icon: <FiActivity className="h-6 w-6 text-green-500" />,
            color: 'bg-green-50',
            changeType: 'positive'
        },
        { 
            title: 'Pending Tasks', 
            value: '8', 
            change: '-2', 
            icon: <FiCheckSquare className="h-6 w-6 text-yellow-500" />,
            color: 'bg-yellow-50',
            changeType: 'negative'
        },
        { 
            title: 'System Health', 
            value: '98%', 
            change: '±0%', 
            icon: <FiHeart className="h-6 w-6 text-red-500" />,
            color: 'bg-red-50',
            changeType: 'neutral'
        },
    ];

    const quickActions = [
        { 
            title: 'Manage Users', 
            href: route('users.index'),
            icon: <FiUsers className="h-5 w-5" />,
            color: 'bg-blue-100 text-blue-600',
            description: 'View and manage user accounts'
        },
        { 
            title: 'Role Permissions', 
            href: route('rolePermissions'),
            icon: <FiShield className="h-5 w-5" />,
            color: 'bg-green-100 text-green-600',
            description: 'Configure roles and access rights'
        },
        {
            title: 'Forums',
            href: route('forums.index'),
            icon: <FiActivity className="h-5 w-5" />,
            color: 'bg-indigo-100 text-indigo-600',
            description: 'View and participate in forums'
        },
        {
            title: 'Articles',
            href: route('articles.index'),
            icon: <FiCheckSquare className="h-5 w-5" />,
            color: 'bg-yellow-100 text-yellow-600',
            description: 'Read and manage articles'
        },
        {
            title: 'Networks',
            href: route('networks.index'),
            icon: <FiUsers className="h-5 w-5" />,
            color: 'bg-purple-100 text-purple-600',
            description: 'View and manage networks'
        }
    ];

    const activities = [
        { 
            id: 1, 
            user: 'John Doe', 
            action: 'created a new project', 
            time: '2 hours ago',
            icon: <FiUsers className="h-4 w-4 text-blue-500" />
        },
        { 
            id: 2, 
            user: 'Jane Smith', 
            action: 'updated settings', 
            time: '4 hours ago',
            icon: <FiSettings className="h-4 w-4 text-purple-500" />
        },
        { 
            id: 3, 
            user: 'Bob Johnson', 
            action: 'completed daily tasks', 
            time: '1 day ago',
            icon: <FiCheckSquare className="h-4 w-4 text-green-500" />
        },
        { 
            id: 4, 
            user: 'Alice Williams', 
            action: 'resolved system issue', 
            time: '2 days ago',
            icon: <FiHeart className="h-4 w-4 text-red-500" />
        },
    ];

    const systemStatus = [
        { 
            name: 'Database', 
            status: 'Operational', 
            icon: <FiDatabase className="h-5 w-5 text-green-500" />,
            statusColor: 'bg-green-100 text-green-800'
        },
        { 
            name: 'API', 
            status: 'Operational', 
            icon: <FiServer className="h-5 w-5 text-green-500" />,
            statusColor: 'bg-green-100 text-green-800'
        },
        { 
            name: 'Storage', 
            status: '78% used', 
            icon: <FiHardDrive className="h-5 w-5 text-yellow-500" />,
            statusColor: 'bg-yellow-100 text-yellow-800'
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-800">
                            Dashboard Overview
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Welcome back! Here's what's happening with your system.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FiClock className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <StatsGrid stats={stats} />
                    
                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card 
                                title="Recent Activity" 
                                action={<a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">View all</a>}
                            >
                                <div className="space-y-4">
                                    <ul className="divide-y divide-gray-200">
                                        {activities.map(activity => (
                                            <li key={activity.id} className="py-3">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className="p-1.5 rounded-md bg-gray-100">
                                                            {activity.icon}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                                        <p className="text-sm text-gray-600">{activity.action}</p>
                                                    </div>
                                                    <div className="ml-auto text-xs text-gray-500">
                                                        {activity.time}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {activities.length === 0 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No recent activity to display</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                        
                        {/* Sidebar */}
                        <div className="space-y-6">
                            <QuickActions actions={quickActions} />
                            
                            <Card title="System Status">
                                <div className="space-y-4">
                                    {systemStatus.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="p-2 rounded-md bg-gray-100">
                                                    {item.icon}
                                                </div>
                                                <span className="ml-3 text-sm font-medium text-gray-700">{item.name}</span>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Storage Usage</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                            style={{ width: '78%' }}
                                        ></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Performance Section */}
                    <div className="mt-8">
                        <Card title="Performance Metrics">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl">
                                    <div className="text-2xl font-bold text-indigo-700">98%</div>
                                    <div className="text-sm text-gray-600 mt-1">Uptime</div>
                                    <div className="mt-3 h-2 bg-indigo-200 rounded-full">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '98%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl">
                                    <div className="text-2xl font-bold text-emerald-700">2.3s</div>
                                    <div className="text-sm text-gray-600 mt-1">Avg. Response Time</div>
                                    <div className="mt-3 h-2 bg-emerald-200 rounded-full">
                                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl">
                                    <div className="text-2xl font-bold text-violet-700">1.2K</div>
                                    <div className="text-sm text-gray-600 mt-1">Daily Requests</div>
                                    <div className="mt-3 h-2 bg-violet-200 rounded-full">
                                        <div className="h-full bg-violet-600 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
