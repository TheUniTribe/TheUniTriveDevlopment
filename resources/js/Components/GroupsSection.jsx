// src/components/GroupsSection.js
import React from 'react';
import { FaPlus } from 'react-icons/fa';

const GroupsSection = () => {
  const groups = [
    { name: "MIT CS Class of 2025", icon: "</>" },
    { name: "AI & Startups", icon: "🤖" },
    { name: "Campus Basketball", icon: "🏀" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">My Groups</h3>
      
      <div className="space-y-4">
        {groups.map((group, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 cursor-pointer">
            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              {group.icon}
            </div>
            <span className="font-medium">{group.name}</span>
          </div>
        ))}
        
        <button className="flex items-center w-full p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg">
          <FaPlus className="mr-3" />
          <span>Join More Groups</span>
        </button>
      </div>
    </div>
  );
};

export default GroupsSection;