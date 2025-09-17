// src/components/Feed.js
import React from 'react';
import Post from './Post';
import LiveEvent from './LiveEvent';

const Feed = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Feed</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm">Question</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm">Article</button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm">Media</button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <input 
            type="text" 
            placeholder="Ask a question or share something..." 
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <LiveEvent />
      
      <div className="space-y-6">
        <Post 
          name="Michael Park" 
          major="Computer Sciences" 
          time="20m ago"
          title="Best resources for learning React in 2025?"
          content="I'm looking to build my first portfolio project and wondering what resources you'd recommend for someone just starting with React. Any courses or tutorials that worked well for you?"
          comments={42}
        />
        
        <Post 
          name="Emma Wilson" 
          major="Business" 
          time="50m ago"
          title="Just launched my first startup project!"
          content="After months of work, I'm excited to share my project that helps students find affordable textbooks. Would love your feedback!"
          image={true}
          comments={87}
        />
      </div>
    </div>
  );
};

export default Feed;