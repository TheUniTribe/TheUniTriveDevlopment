import React from 'react';

const StudyResources: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Study Resources</h3>
      <div className="space-y-3">
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="font-medium text-gray-900 text-sm">Finals Week Study Groups</div>
          <div className="text-xs text-gray-600 mt-1">Join or create study groups for upcoming finals</div>
        </div>
      </div>
      <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium mt-4 hover:bg-gray-800 transition-colors">
        Find a Group
      </button>
    </div>
  );
};

export default StudyResources;