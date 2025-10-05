import React, { useState } from 'react';
import { MapPin, Clock, Bookmark, Search, Filter, Briefcase, Building } from 'lucide-react';

const JobsSection = () => {
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                      {job.remote && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Remote
                        </span>
                      )}
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

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Load More Jobs
        </button>
      </div>
    </div>
  );
};

export default JobsSection;
