import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect. Learn. Thrive.
          </h1>
          <p className="text-gray-600 mb-6 max-w-lg">
            Join your university's student network to access resources, 
            opportunities, and connections that will help you succeed academically 
            and professionally.
          </p>
          <div className="flex space-x-4">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Join Your Student Network
            </button>
            <button className="text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="ml-8">
          <div className="w-80 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Student community illustration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;