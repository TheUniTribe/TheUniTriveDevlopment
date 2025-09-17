import React, { useState } from 'react';
import { Plus, ArrowUp, MessageCircle, Bookmark, Share, Filter, Search, Code, DollarSign, GraduationCap, User, Settings, Bell, Mail, HelpCircle, Menu, X } from 'lucide-react';

const Discussion = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
    const discussions = [
    {
      id: 1,
      author: 'Sarah Johnson',
      authorAvatar: 'SJ',
      category: 'Computer Science',
      time: '2h ago',
      title: 'What are the best resources for learning React.js as a beginner?',
      content: "I'm trying to build my first web application and want to use React. There are so many tutorials out there, but I'm not sure which ones are most effective for someone with basic JavaScript knowledge. Any recommendations?",
      upvotes: 142,
      comments: 23,
      tags: ['React', 'JavaScript', 'WebDev']
    },
    {
      id: 2,
      author: 'Michael Chen',
      authorAvatar: 'MC',
      category: 'Finance Club',
      time: '1d ago',
      title: 'Tips for managing student loans while still in school?',
      content: "I'm starting to worry about my student loan debt accumulating. Are there strategies I should be implementing now to minimize the impact after graduation? Any advice would be appreciated!",
      upvotes: 89,
      comments: 17,
      tags: ['Finance', 'StudentLoans', 'Advice']
    },
    {
      id: 3,
      author: 'Emma Wilson',
      authorAvatar: 'EW',
      category: 'Career Advice',
      time: '3h ago',
      title: 'How to prepare for technical interviews at FAANG companies?',
      content: "I have interviews coming up at Google and Meta. What should I focus on for preparation? Any specific resources or practice problems you'd recommend?",
      upvotes: 234,
      comments: 45,
      tags: ['Interviews', 'FAANG', 'Career']
    },
    {
      id: 4,
      author: 'Alex Rodriguez',
      authorAvatar: 'AR',
      category: 'Startups',
      time: '5h ago',
      title: 'AMA: Software Engineer at Google',
      content: "Recent CS grad sharing my journey from student to Google SWE. Ask me anything about the interview process, day-to-day work, or career advice!",
      upvotes: 567,
      comments: 89,
      tags: ['AMA', 'Google', 'Career']
    }
  ];

    const groups = [
      {
        name: 'Computer Science',
        icon: Code,
        members: '2.4k members',
        description: 'Connect with fellow CS students, share resources, and get help with assignments.'
      },
      {
        name: 'Finance Club',
        icon: DollarSign,
        members: '1.8k members',
        description: 'Learn about investing, budgeting, and career opportunities in finance.'
      },
      {
        name: 'Class of 2025',
        icon: GraduationCap,
        members: '3.2k members',
        description: 'Connect with your graduating class for events, study groups, and social activities.'
      }
    ];
  
    const categories = [
    'All Posts',
    'Computer Science',
    'Finance Club',
  ];
  
    const RecommendedGroups = () => {
      return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Groups for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {groups.map((group, index) => {
              const IconComponent = group.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.members}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Join Group
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    };
  return (
      <div className="pt-16 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Header */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="hidden sm:flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button className="sm:hidden border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Category Filter */}
            <div className="lg:hidden mt-4 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFilter(category.toLowerCase().replace(' ', ''))}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-xs ${
                      selectedFilter === category.toLowerCase().replace(' ', '')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Groups Section */}
          <RecommendedGroups />

          {/* Discussions */}
          <div className="space-y-2">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-700">{discussion.authorAvatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{discussion.author}</span>
                      <span className="text-sm text-blue-600">• {discussion.category}</span>
                      <span className="text-sm text-gray-500">• {discussion.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{discussion.content}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <ArrowUp className="h-4 w-4" />
                        <span>{discussion.upvotes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.comments} comments</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >
      );
};
export default Discussion;
