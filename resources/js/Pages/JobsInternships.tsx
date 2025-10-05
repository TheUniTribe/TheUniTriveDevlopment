import React, { useState } from 'react';
import { MapPin, Clock, Bookmark, Search, Filter, Briefcase, Building } from 'lucide-react';

const JobsInternships: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Summer 2025',
      remote: false,
      tags: ['Python', 'React', 'Summer 2025'],
      description: 'Join our team to work on cutting-edge technology that impacts billions of users worldwide. You\'ll collaborate with experienced engineers on real projects.',
      posted: '2 days ago',
      applicants: '50+',
      salary: '$8,000/month'
    },
    {
      id: 2,
      title: 'Product Manager Intern',
      company: 'Meta',
      location: 'Redmond, WA',
      type: 'Fall 2025',
      remote: false,
      tags: ['Product Strategy', 'Analytics', 'Fall 2025'],
      description: 'Drive product strategy and work cross-functionally with engineering, design, and data science teams to build products used by billions.',
      posted: '1 day ago',
      applicants: '30+',
      salary: '$7,500/month'
    },
    {
      id: 3,
      title: 'Data Science Intern',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      type: 'Summer 2025',
      remote: true,
      tags: ['Python', 'Machine Learning', 'SQL'],
      description: 'Work on recommendation algorithms and data analysis to improve user experience for millions of Netflix subscribers.',
      posted: '3 days ago',
      applicants: '75+',
      salary: '$9,000/month'
    },
    {
      id: 4,
      title: 'UX Design Intern',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Summer 2025',
      remote: false,
      tags: ['Figma', 'User Research', 'Prototyping'],
      description: 'Design intuitive user experiences for Apple products used by millions worldwide. Work with world-class design teams.',
      posted: '1 week ago',
      applicants: '100+',
      salary: '$8,500/month'
    }
  ];

  const featuredCompanies = [
    { name: 'Google', openings: 15, logo: 'G' },
    { name: 'Meta', openings: 12, logo: 'M' },
    { name: 'Apple', openings: 8, logo: 'A' },
    { name: 'Microsoft', openings: 20, logo: 'MS' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">All locations</option>
                  <option value="remote">Remote</option>
                  <option value="california">California</option>
                  <option value="newyork">New York</option>
                  <option value="washington">Washington</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All types</option>
                  <option value="internship">Internship</option>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Entry Level</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Mid Level</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Senior Level</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Featured Companies</h3>
            <div className="space-y-3">
              {featuredCompanies.map((company, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{company.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{company.name}</div>
                    <div className="text-xs text-gray-600">{company.openings} openings</div>
                  </div>
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
              <h1 className="text-2xl font-bold text-gray-900">Jobs & Internships</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Post a Job
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                          {job.remote && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Remote</span>}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
                    <Bookmark className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{job.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Posted {job.posted}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {job.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-x-3">
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Jobs
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Job Alerts</h3>
            <p className="text-sm text-gray-600 mb-4">Get notified when new jobs match your preferences</p>
            <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Create Job Alert
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Career Resources</h3>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📝 Resume Builder
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                💼 Interview Prep Guide
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📊 Salary Calculator
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                🎯 Career Path Explorer
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Career Events</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-medium text-gray-900 text-sm">Virtual Career Fair</div>
                <div className="text-xs text-gray-600">May 30, 2025 • 2:00 PM</div>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <div className="font-medium text-gray-900 text-sm">Resume Workshop</div>
                <div className="text-xs text-gray-600">June 5, 2025 • 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsInternships;