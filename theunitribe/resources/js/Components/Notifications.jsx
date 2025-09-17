import React, { useState, useMemo } from 'react';

// Mock data for notifications
const mockNotifications = [
  { id: 1, title: "New Message", description: "You have received a new message from John", priority: "high", time: "2 min ago", read: false },
  { id: 2, title: "System Update", description: "System maintenance scheduled for tomorrow", priority: "medium", time: "1 hour ago", read: true },
  { id: 3, title: "Event Reminder", description: "Team meeting in 30 minutes", priority: "high", time: "5 hours ago", read: false },
  { id: 4, title: "Welcome", description: "Welcome to our platform! Start by completing your profile.", priority: "low", time: "1 day ago", read: true },
];

// Mock data for users
const mockUsers = [
  { id: 1, name: "John Doe", avatar: "JD", online: true },
  { id: 2, name: "Alice Smith", avatar: "AS", online: false },
  { id: 3, name: "Bob Johnson", avatar: "BJ", online: true },
  { id: 4, name: "Emma Wilson", avatar: "EW", online: true },
];

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const priorityClasses = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800"
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityClasses[priority]}`}>
      {priority}
    </span>
  );
};

// Notifications Component
const Notifications = ({ notifications = mockNotifications }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(notification =>
      activeTab === 'unread' ? !notification.read : notification.read
    );
  }, [notifications, activeTab]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${activeTab === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${!notification.read ? 'bg-blue-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h3>
                    <PriorityBadge priority={notification.priority} />
                  </div>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
