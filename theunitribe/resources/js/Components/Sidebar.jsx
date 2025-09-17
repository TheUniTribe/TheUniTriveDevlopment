// src/components/Sidebar.js
import React from 'react';
import MarketplaceItem from './MarketplaceItem';
import LearningHubItem from './LearningHubItem';
import Chat from './Chat';

const Sidebar = () => {
  return (
    <div className="space-y-6">
      {/* Jobs & Internships */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold mb-4">Jobs & Internships</h3>
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="font-bold">Software Engineering Intern</div>
            <div className="text-sm text-gray-600">Google • Mountain View, CA</div>
            <div className="text-xs text-gray-500">Summer 2025 • Remote</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-bold">Product Management Intern</div>
            <div className="text-sm text-gray-600">Microsoft • Richmond, WA</div>
            <div className="text-xs text-gray-500">Fall 2025 • On-site</div>
          </div>
          <button className="w-full text-indigo-600 font-medium text-sm hover:underline">
            View All
          </button>
        </div>
      </div>
      
      {/* Marketplace */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold mb-4">Marketplace</h3>
        <div className="space-y-4">
          <MarketplaceItem 
            title="Calculus Textbook" 
            price="$45" 
            seller="Jamie" 
            distance="2 miles away" 
          />
          <MarketplaceItem 
            title="Desk Lamp (Like New)" 
            price="$20" 
            seller="Chris" 
            distance="0.5 miles away" 
          />
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
            Post Item for Sale
          </button>
        </div>
      </div>
      
      {/* Learning Hub */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-lg font-bold mb-4">Learning Hub</h3>
        <div className="space-y-4">
          <LearningHubItem 
            title="Financial Aid 101" 
            description="Learn how to maximize your financial aid opportunities" 
            students={1245} 
          />
          <LearningHubItem 
            title="Python for Beginners" 
            description="Start your coding journey with this beginner-friendly course" 
            students={3781} 
          />
          <button className="w-full text-indigo-600 font-medium text-sm hover:underline">
            View All
          </button>
        </div>
      </div>
      
      {/* Chat */}
      <Chat />
    </div>
  );
};

export default Sidebar;