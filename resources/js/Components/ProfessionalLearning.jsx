import React from 'react';
import { BookOpen, Users, Video, BarChart2 } from 'react-feather';

const ProfessionalLearning = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional & Learning Event
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Professional Tech Hub Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 transition-transform duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Users className="text-indigo-600 w-8 h-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Professional Tech Hub</h3>
                    <p className="text-indigo-600 font-medium">Live Webinar</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Connect with industry experts and advance your career through interactive sessions.
                </p>
              </div>
              
              {/* Learning Hub Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 transition-transform duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <BookOpen className="text-green-600 w-8 h-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Learning Hub</h3>
                    <p className="text-green-600 font-medium">Professional Development</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Learn with professionals who share their knowledge and experience.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Learn with professionals and their knowledge
              </h3>
              <button className="mt-4 bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
                Explore All Resources
              </button>
            </div>
          </div>
          
          {/* Right Content - Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl h-64">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                alt="Team collaborating"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg">Career Workshops</h3>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-xl h-64">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80"
                alt="Online learning"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg">Webinars</h3>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-xl h-64">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                alt="Data analysis"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg">Tech Talks</h3>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-xl h-64">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80"
                alt="Networking event"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-bold text-lg">Networking</h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfessionalLearning;