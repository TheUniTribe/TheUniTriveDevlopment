// src/components/ProfileSection.js
import React from 'react';
import { FaUser } from 'react-icons/fa';

const ProfileSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
          <FaUser className="text-gray-500 text-2xl" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">Alex Johnson</h2>
          <p className="text-gray-600">MIT CS '25</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Profile Completion</span>
          <span className="font-bold">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>
      
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-300">
        Complete Profile
      </button>
    </div>
  );
};

export default ProfileSection;