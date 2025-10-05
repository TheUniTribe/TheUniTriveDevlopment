import React, { useState, useEffect, useRef } from 'react';
import AuthModal from './AuthModal';

// EventsModal Component
const EventsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const modalRef = useRef(null);

  const events = [
    {
      id: 1,
      title: "Campus Tech Symposium 2024",
      time: "Live Now",
      date: "Oct 15, 2024",
      description: "Annual technology conference featuring industry leaders and student innovations.",
      status: "live",
      color: "bg-blue-100 border-blue-200",
      textColor: "text-blue-600",
      hoverColor: "hover:bg-blue-50",
      organizer: {
        name: "Tech Students Association",
        verified: true
      },
      location: "Main Auditorium",
      tags: ["Technology", "Networking", "Innovation"]
    },
    {
      id: 2,
      title: "Career Fair: Tech Industry",
      time: "Starts in 2 hours",
      date: "Oct 16, 2024",
      description: "Connect with top tech companies and explore internship opportunities.",
      status: "upcoming",
      color: "bg-purple-100 border-purple-200",
      textColor: "text-purple-600",
      hoverColor: "hover:bg-purple-50",
      organizer: {
        name: "University Career Center",
        verified: true
      },
      location: "Conference Center Hall B",
      tags: ["Career", "Recruitment", "Tech Jobs"]
    },
    {
      id: 3,
      title: "AI & Machine Learning Workshop",
      time: "Tomorrow, 3:00 PM",
      date: "Oct 17, 2024",
      description: "Hands-on session on building and training ML models with Python.",
      status: "upcoming",
      color: "bg-green-100 border-green-200",
      textColor: "text-green-600",
      hoverColor: "hover:bg-green-50",
      organizer: {
        name: "Data Science Club",
        verified: true
      },
      location: "Computer Lab 304",
      tags: ["Workshop", "AI", "Machine Learning"]
    }
  ];

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Filter events based on active tab
  const filteredEvents = events.filter(event => 
    activeTab === 'all' || event.status === activeTab
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-3 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Events</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-5 border-b border-gray-200">
          {['all', 'live', 'upcoming'].map(tab => (
            <button
              key={tab}
              className={`px-3 py-1.5 font-medium text-sm mr-2 ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All Events' : tab === 'live' ? 'Live Now' : 'Upcoming'}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div 
              key={event.id}
              className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${event.color} ${event.hoverColor}`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-10 w-10 rounded-md ${event.color} flex items-center justify-center ${event.textColor} mr-3`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <span className="text-xs font-medium text-gray-500">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center mt-1.5">
                    <p className={`text-xs font-medium ${event.textColor}`}>
                      {event.status === "live" ? (
                        <span className="inline-flex items-center">
                          <span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1.5"></span>
                          {event.time}
                        </span>
                      ) : event.time}
                    </p>
                    <span className="mx-1.5 text-gray-300">•</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  
                  {/* Organizer info */}
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500 mr-1">By</span>
                    <span className="text-xs font-medium text-gray-700 mr-1">{event.organizer.name}</span>
                    {event.organizer.verified && (
                      <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-2 leading-tight">{event.description}</p>
                  
                  {/* Tags */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};




// Navbar Component with Completely Redesigned Live Button
const Navbar = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiveHovered, setIsLiveHovered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authContent, setAuthContent] = useState("");
  const [livePulse, setLivePulse] = useState(true);
  
  const liveButtonRef = useRef(null);
  const logoText = "TheUni";
  const logoSuffix = "Tribe";
  
  useEffect(() => {
    let timeout;
    const animateLetters = () => {
      if (visibleLetters < logoText.length + 1) {
        timeout = setTimeout(() => {
          setVisibleLetters(prev => prev + 1);
          animateLetters();
        }, 120);
      }
    };
    animateLetters();
    
    // Pulse animation for live indicator
    const pulseInterval = setInterval(() => {
      setLivePulse(prev => !prev);
    }, 2000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(pulseInterval);
    };
  }, []);

  const openAuthModal = (mode, content) => {
    setAuthMode(mode);
    setAuthContent(content);
    setShowAuthModal(true);
  };

  const openEventsModal = (e) => {
    e.preventDefault();
    setShowEventsModal(true);
  };

  return (
    <>
      <nav className="bg-white fixed top-0 w-full z-50 shadow-sm py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Enhanced Logo */}
            <div 
              className="flex items-center space-x-2 group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Academic-inspired icon */}
              <div className="relative">
                <div className={`absolute inset bg-blue-50 rounded-full transform scale-0 transition-all duration-400 ${isHovered ? 'scale-100' : ''}`}></div>
                <span className="relative z-10 text-blue-600 transition-all duration-300 group-hover:rotate-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </span>
              </div>
              
              {/* Smoother text animation */}
              <div className="relative">
                <span className="text-2xl font-bold font-serif tracking-tight">
                  {logoText.split('').map((letter, index) => (
                    <span
                      key={index}
                      className={`inline-block transition-all duration-700 ease-out ${
                        visibleLetters > index ? 'opacity-100' : 'opacity-0 -translate-x-2'
                      } ${isHovered ? 'text-blue-700' : 'text-gray-900'}`}
                      style={{ 
                        transitionDelay: `${index * 80}ms`,
                        transitionProperty: 'opacity, transform, color'
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                  <span 
                    className={`inline-block transition-all duration-700 ease-out ${
                      visibleLetters > logoText.length ? 'opacity-100' : 'opacity-0 -translate-x-2'
                    } ${isHovered ? 'text-teal-600' : 'text-blue-600'}`}
                    style={{ 
                      transitionDelay: `${logoText.length * 80 + 80}ms`,
                      transitionProperty: 'opacity, transform, color'
                    }}
                  >
                    {logoSuffix}
                  </span>
                </span>
                
                {/* Academic underline effect */}
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500 ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Completely Redesigned Live Now Button */}
              <a 
                ref={liveButtonRef}
                href="#"
                onClick={openEventsModal}
                className="relative flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 group overflow-hidden border border-gray-200 bg-white hover:shadow-md"
                onMouseEnter={() => setIsLiveHovered(true)}
                onMouseLeave={() => setIsLiveHovered(false)}
              >
                {/* Live indicator with broadcast-inspired design */}
                <div className="relative mr-3 flex items-center justify-center">
                  {/* Broadcast waves effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`absolute h-6 w-6 rounded-full bg-red-100 transition-all duration-1000 ${livePulse ? 'scale-125 opacity-40' : 'scale-100 opacity-0'}`}></div>
                    <div className={`absolute h-5 w-5 rounded-full bg-red-200 transition-all duration-1000 ${livePulse ? 'scale-150 opacity-20' : 'scale-100 opacity-0'}`}></div>
                  </div>
                  
                  {/* Broadcast icon */}
                  <div className="relative h-4 w-4 flex items-center justify-center">
                    <svg 
                      className="h-4 w-4 text-red-600" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 1 7 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 0 1-1.564-.317z" />
                    </svg>
                  </div>
                </div>
                
                <span 
                  className={`text-sm font-medium tracking-wide transition-all ${
                    isLiveHovered ? 'text-red-700' : 'text-gray-700'
                  }`}
                >
                  Live Events
                </span>
                
                {/* Subtle hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 transition-opacity duration-300 ${isLiveHovered ? 'opacity-100' : ''}`}></div>
                
                {/* Red accent line on hover */}
                <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 ${isLiveHovered ? 'w-full' : ''}`}></div>
              </a>

              {/* Join Community Button */}
              <button
                onClick={() => openAuthModal('login', 'dashboard')}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center">
                  <svg 
                    className="h-5 w-5 mr-2 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-medium tracking-wide">
                    Join Community
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Professional progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 opacity-20"></div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
      <AuthModal
        mode={authMode}
        content={authContent}
        onClose={() => setShowAuthModal(false)}
        switchMode={(mode) => setAuthMode(mode)}
      />
      )}

      {/* Events Modal */}
      {showEventsModal && (
        <EventsModal onClose={() => setShowEventsModal(false)} />
      )}
    </>
  );
};

export default Navbar;