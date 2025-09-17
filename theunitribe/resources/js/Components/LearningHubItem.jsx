// src/components/LearningHubItem.js
import React from 'react';

const LearningHubItem = ({ title, description, students }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="text-xs text-gray-500">{students.toLocaleString()} students enrolled</div>
    </div>
  );
};

export default LearningHubItem;