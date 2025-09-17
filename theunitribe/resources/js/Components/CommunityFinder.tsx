import React from 'react';

interface CommunityFinderProps {
  onJoinNetwork?: () => void;
}

const CommunityFinder: React.FC<CommunityFinderProps> = ({ onJoinNetwork }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Find Your Community</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select your university</option>
              <option>MIT</option>
              <option>Stanford</option>
              <option>Harvard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select year</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select interests</option>
              <option>Computer Science</option>
              <option>Business</option>
              <option>Engineering</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onJoinNetwork}>
              <h4 className="font-medium text-gray-900">MIT CS Class of 2025</h4>
              <p className="text-sm text-gray-600">1,245 members</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onJoinNetwork}>
              <h4 className="font-medium text-gray-900">AI & Startups</h4>
              <p className="text-sm text-gray-600">842 members</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFinder;