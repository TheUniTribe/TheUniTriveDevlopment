import React from 'react';
import { Code, DollarSign, GraduationCap } from 'lucide-react';

const RecommendedGroups = () => {
  const groups = [
    {
      name: 'Computer Science',
      icon: Code,
      members: '2.4k members',
      description: 'Connect with fellow CS students, share resources, and get help with assignments.'
    },
    {
      name: 'Finance Club',
      icon: DollarSign,
      members: '1.8k members',
      description: 'Learn about investing, budgeting, and career opportunities in finance.'
    },
    {
      name: 'Class of 2025',
      icon: GraduationCap,
      members: '3.2k members',
      description: 'Connect with your graduating class for events, study groups, and social activities.'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Groups for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, index) => {
          const IconComponent = group.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-600">{group.members}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{group.description}</p>
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Join Group
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedGroups;