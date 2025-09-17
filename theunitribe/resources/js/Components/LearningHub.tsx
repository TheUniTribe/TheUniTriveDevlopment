import React from 'react';

interface LearningHubProps {
  onViewAll?: () => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ onViewAll }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Learning Hub</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Financial Education</h3>
          </div>
          <p className="text-gray-600 mb-4">Master your money management skills</p>
          <div className="space-y-2 mb-6">
            <div className="text-sm text-gray-700">▶ Student Loan Management</div>
            <div className="text-sm text-gray-700">▶ Budgeting for College Life</div>
            <div className="text-sm text-gray-700">▶ Scholarship Application Tips</div>
          </div>
          <button 
            onClick={onViewAll}
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Resources
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Technical Education</h3>
          </div>
          <p className="text-gray-600 mb-4">Build your technical skills</p>
          <div className="space-y-2 mb-6">
            <div className="text-sm text-gray-700">▶ Intro to Python Programming</div>
            <div className="text-sm text-gray-700">▶ Web Development Fundamentals</div>
            <div className="text-sm text-gray-700">▶ Data Analysis with R</div>
          </div>
          <button 
            onClick={onViewAll}
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Courses
          </button>
        </div>
      </div>
      
      {/* Explore All Resources Button */}
      <div className="text-center mt-8">
        <button 
          onClick={onViewAll}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Explore All Resources
        </button>
      </div>
    </section>
  );
};

export default LearningHub;