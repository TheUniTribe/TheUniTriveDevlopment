import React from 'react';
import { MessageCircle } from 'lucide-react';

const YourNetwork: React.FC = () => {
  const connections = [
    { name: 'Emma Wilson', role: 'Computer Science • Junior', avatar: 'EW' },
    { name: 'Jason Park', role: 'Business • Senior', avatar: 'JP' },
    { name: 'Sophia Rodriguez', role: 'Engineering • Sophomore', avatar: 'SR' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Your Network</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
      </div>
      <div className="space-y-3">
        {connections.map((connection, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">{connection.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">{connection.name}</div>
              <div className="text-xs text-gray-600">{connection.role}</div>
            </div>
            <MessageCircle className="h-4 w-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
          </div>
        ))}
      </div>
      <button className="text-sm text-blue-600 hover:text-blue-800 mt-3">
        ➕ Grow your network
      </button>
    </div>
  );
};

export default YourNetwork;