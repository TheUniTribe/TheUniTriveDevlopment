import React from 'react';
import { ArrowUp, MessageCircle, Bookmark, Share } from 'lucide-react';

const PopularDiscussions: React.FC = () => {
  const discussions = [
    {
      author: 'Sarah Johnson',
      category: 'Computer Science',
      time: '2h ago',
      title: 'What are the best resources for learning React.js as a beginner?',
      content: "I'm trying to build my first web application and want to use React. There are so many tutorials out there, but I'm not sure which ones are most effective for someone with basic JavaScript knowledge. Any recommendations?",
      upvotes: 142,
      comments: 23,
      avatar: 'SJ'
    },
    {
      author: 'Michael Chen',
      category: 'Finance Club',
      time: '1d ago',
      title: 'Tips for managing student loans while still in school?',
      content: "I'm starting to worry about my student loan debt accumulating. Are there strategies I should be implementing now to minimize the impact after graduation? Any advice would be appreciated!",
      upvotes: 89,
      comments: 17,
      avatar: 'MC'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Popular Discussions</h2>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
            <span>🔥</span>
            <span>Filter</span>
          </button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            + Ask a Question
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {discussions.map((discussion, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{discussion.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{discussion.author}</span>
                  <span className="text-sm text-blue-600">• {discussion.category}</span>
                  <span className="text-sm text-gray-500">• {discussion.time}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{discussion.title}</h3>
                <p className="text-gray-600 mb-4">{discussion.content}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <ArrowUp className="h-4 w-4" />
                    <span>{discussion.upvotes}</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>{discussion.comments} comments</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Bookmark className="h-4 w-4" />
                  </button>
                  <button className="flex items-center space-x-1 hover:text-blue-600">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDiscussions;