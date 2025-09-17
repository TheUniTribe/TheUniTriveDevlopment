import React from 'react';
import { Plus, Code, Lightbulb, Globe, Calendar, BookOpen, Star, Award, Clock } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      {/* My Groups */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">My Groups</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <Code className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-900">MIT CS Class of 2025</span>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <Lightbulb className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-900">AI & Startups</span>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <Globe className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-900">Web Development</span>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 mt-4">
          <Plus className="h-4 w-4" />
          <span>Join more groups</span>
        </button>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Trending Topics</h3>
        <div className="space-y-2">
          <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#internships2025</span>
          <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">#scholarships</span>
          <span className="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">#studentloans</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          <div className="text-sm">
            <div className="font-medium text-gray-900">Career Fair Prep</div>
            <div className="text-gray-600">Tomorrow, 3:00 PM</div>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">Alumni AMA: Tech Startups</div>
            <div className="text-gray-600">May 28, 2025 • 6:00 PM</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;