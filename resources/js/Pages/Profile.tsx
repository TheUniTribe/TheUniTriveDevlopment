import React, { useState } from 'react';
import { Edit, MapPin, Calendar, Mail, Phone, Award, BookOpen, Users, MessageCircle, Settings, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const userPosts = [
    {
      id: 1,
      type: 'question',
      title: 'Best resources for learning React.js as a beginner?',
      content: "I'm trying to build my first web application and want to use React. There are so many tutorials out there, but I'm not sure which ones are most effective for someone with basic JavaScript knowledge. Any recommendations?",
      timestamp: '2 hours ago',
      upvotes: 142,
      comments: 23,
      category: 'Computer Science'
    },
    {
      id: 2,
      type: 'article',
      title: 'My Journey from Student to Google SWE',
      content: "After months of preparation and interviews, I'm excited to share that I've accepted a Software Engineer position at Google! Here's what I learned during the process...",
      timestamp: '1 week ago',
      upvotes: 567,
      comments: 89,
      category: 'Career'
    }
  ];

  const registeredEvents = [
    {
      id: 1,
      title: 'Virtual Career Fair',
      date: 'May 30, 2025',
      time: '2:00 PM - 6:00 PM',
      location: 'Online',
      status: 'upcoming',
      type: 'Career'
    },
    {
      id: 2,
      title: 'Python Workshop',
      date: 'June 5, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Computer Science Building',
      status: 'upcoming',
      type: 'Learning'
    },
    {
      id: 3,
      title: 'Alumni Networking Event',
      date: 'May 15, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Student Center',
      status: 'attended',
      type: 'Networking'
    }
  ];

  const achievements = [
    { title: 'Top Contributor', description: 'Most helpful answers this month', icon: '🏆', date: 'May 2025' },
    { title: 'Python Expert', description: 'Completed Python certification', icon: '🐍', date: 'April 2025' },
    { title: 'Community Builder', description: 'Started 3 study groups', icon: '👥', date: 'March 2025' },
    { title: 'Early Adopter', description: 'One of the first 100 users', icon: '⭐', date: 'January 2025' }
  ];

  const connections = [
    { name: 'Emma Wilson', role: 'Computer Science • Junior', avatar: 'EW', mutualConnections: 5 },
    { name: 'Jason Park', role: 'Business • Senior', avatar: 'JP', mutualConnections: 3 },
    { name: 'Sophia Rodriguez', role: 'Engineering • Sophomore', avatar: 'SR', mutualConnections: 8 },
    { name: 'Michael Chen', role: 'Finance • Junior', avatar: 'MC', mutualConnections: 2 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Left Sidebar - Profile Info */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            
            {/* Profile Picture */}
            <div className="relative px-6 pb-6">
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-2xl font-bold text-blue-600">AJ</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-1 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                    <Camera className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-gray-900">Alex Johnson</h1>
                <p className="text-gray-600">Computer Science • Junior</p>
                <p className="text-sm text-gray-500 mt-1">MIT Class of 2025</p>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Cambridge, MA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined January 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>alex.johnson@mit.edu</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-semibold text-gray-900">156</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">2.4k</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">892</div>
                    <div className="text-xs text-gray-600">Following</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                <Edit className="h-4 w-4 inline mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-4 shadow-sm mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Post Likes</span>
                <span className="font-medium">5,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Comments</span>
                <span className="font-medium">892</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Alex Johnson</h2>
                <p className="text-gray-600 mt-1">
                  Passionate CS student interested in AI/ML and web development. 
                  Always eager to learn and help fellow students succeed.
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">AI/ML</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Web Dev</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Python</span>
                </div>
              </div>
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline mr-2" />
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Award className="h-4 w-4 inline mr-2" />
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'connections'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Connections
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">AJ</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Alex Johnson</div>
                          <div className="text-sm text-gray-500">{post.timestamp} • {post.category}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>👍 {post.upvotes}</span>
                        <span>💬 {post.comments}</span>
                        <span>🔗 Share</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <div>{event.date} • {event.time}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            event.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Connections Tab */}
              {activeTab === 'connections' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connections.map((connection, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{connection.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{connection.name}</h3>
                          <p className="text-sm text-gray-600">{connection.role}</p>
                          <p className="text-xs text-gray-500">{connection.mutualConnections} mutual connections</p>
                        </div>
                        <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">My Groups</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">MIT CS Class of 2025</div>
                  <div className="text-xs text-gray-600">1,245 members</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">AI & Startups</div>
                  <div className="text-xs text-gray-600">842 members</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Web Development</div>
                  <div className="text-xs text-gray-600">567 members</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <span className="text-gray-900">Posted a question in</span>
                  <span className="text-blue-600"> Computer Science</span>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <span className="text-gray-900">Joined</span>
                  <span className="text-blue-600"> Python Study Group</span>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <span className="text-gray-900">Completed</span>
                  <span className="text-blue-600"> Python Basics Course</span>
                  <div className="text-xs text-gray-500">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;