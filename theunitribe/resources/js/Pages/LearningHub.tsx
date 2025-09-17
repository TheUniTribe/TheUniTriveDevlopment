import React, { useState } from 'react';
import { Play, BookOpen, Clock, Users, Star, Award, Search, Filter } from 'lucide-react';

const LearningHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Financial Aid 101',
      category: 'Financial Education',
      instructor: 'Sarah Johnson',
      duration: '2 hours',
      students: 1245,
      rating: 4.8,
      level: 'Beginner',
      description: 'Learn how to maximize your financial aid opportunities and manage student loans effectively.',
      lessons: [
        'Understanding FAFSA',
        'Types of Financial Aid',
        'Scholarship Strategies',
        'Loan Management'
      ],
      progress: 0
    },
    {
      id: 2,
      title: 'Python for Beginners',
      category: 'Technical Education',
      instructor: 'Michael Chen',
      duration: '8 hours',
      students: 3781,
      rating: 4.9,
      level: 'Beginner',
      description: 'Start your coding journey with this beginner-friendly Python programming course.',
      lessons: [
        'Python Basics',
        'Variables and Data Types',
        'Control Structures',
        'Functions and Modules',
        'File Handling',
        'Error Handling'
      ],
      progress: 25
    },
    {
      id: 3,
      title: 'Web Development Fundamentals',
      category: 'Technical Education',
      instructor: 'Emma Wilson',
      duration: '12 hours',
      students: 2156,
      rating: 4.7,
      level: 'Intermediate',
      description: 'Build modern websites with HTML, CSS, and JavaScript from scratch.',
      lessons: [
        'HTML Structure',
        'CSS Styling',
        'JavaScript Basics',
        'Responsive Design',
        'DOM Manipulation',
        'Project Building'
      ],
      progress: 60
    },
    {
      id: 4,
      title: 'Data Analysis with R',
      category: 'Technical Education',
      instructor: 'Dr. Alex Rodriguez',
      duration: '10 hours',
      students: 892,
      rating: 4.6,
      level: 'Intermediate',
      description: 'Master data analysis and visualization using R programming language.',
      lessons: [
        'R Basics',
        'Data Import/Export',
        'Data Cleaning',
        'Statistical Analysis',
        'Data Visualization',
        'Reporting'
      ],
      progress: 0
    },
    {
      id: 5,
      title: 'Budgeting for College Life',
      category: 'Financial Education',
      instructor: 'Jordan Kim',
      duration: '3 hours',
      students: 2034,
      rating: 4.5,
      level: 'Beginner',
      description: 'Essential budgeting skills every college student needs to know.',
      lessons: [
        'Creating a Budget',
        'Tracking Expenses',
        'Saving Strategies',
        'Emergency Funds'
      ],
      progress: 100
    },
    {
      id: 6,
      title: 'Scholarship Application Tips',
      category: 'Financial Education',
      instructor: 'Taylor Davis',
      duration: '1.5 hours',
      students: 1567,
      rating: 4.7,
      level: 'Beginner',
      description: 'Maximize your chances of winning scholarships with proven strategies.',
      lessons: [
        'Finding Scholarships',
        'Application Essays',
        'Interview Preparation',
        'Follow-up Strategies'
      ],
      progress: 0
    }
  ];

  const categories = [
    'All Courses',
    'Financial Education',
    'Technical Education',
    'Career Development',
    'Study Skills'
  ];

  const achievements = [
    { title: 'First Course Completed', icon: '🎓', earned: true },
    { title: 'Python Basics Master', icon: '🐍', earned: true },
    { title: 'Financial Literacy', icon: '💰', earned: false },
    { title: 'Web Developer', icon: '🌐', earned: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.toLowerCase().replace(' ', ''))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === category.toLowerCase().replace(' ', '')
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">My Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Courses Completed</span>
                  <span className="font-medium">1/6</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '17%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="font-medium">8.5/36.5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg ${
                  achievement.earned ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <span className="text-lg">{achievement.icon}</span>
                  <span className={`text-sm ${
                    achievement.earned ? 'text-yellow-800 font-medium' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Course
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Featured Course */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Featured Course</h2>
                <h3 className="text-lg font-semibold mb-2">Complete Web Development Bootcamp</h3>
                <p className="text-blue-100 mb-4">
                  Master full-stack web development with this comprehensive course covering HTML, CSS, JavaScript, React, and Node.js.
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>⭐ 4.9 rating</span>
                  <span>👥 5,234 students</span>
                  <span>⏱️ 40 hours</span>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Enroll Now
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                        {course.title}
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Course Content</h4>
                    <div className="space-y-1">
                      {course.lessons.slice(0, 3).map((lesson, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Play className="h-3 w-3" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                      {course.lessons.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{course.lessons.length - 3} more lessons
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">by {course.instructor}</span>
                    <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      course.progress > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}>
                      {course.progress > 0 ? 'Continue' : 'Start Course'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Learning Path</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Financial Basics</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Programming Fundamentals</div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">3</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Advanced Skills</div>
                  <div className="text-xs text-gray-600">Locked</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Study Schedule</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-medium text-gray-900 text-sm">Python Basics</div>
                <div className="text-xs text-gray-600">Today, 3:00 PM</div>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <div className="font-medium text-gray-900 text-sm">Web Development</div>
                <div className="text-xs text-gray-600">Tomorrow, 2:00 PM</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Study Groups</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">Python Study Group</div>
                <div className="text-gray-600">5 members • Next: Wed 7PM</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Financial Literacy Club</div>
                <div className="text-gray-600">12 members • Next: Fri 6PM</div>
              </div>
            </div>
            <button className="w-full mt-4 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Find Study Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;