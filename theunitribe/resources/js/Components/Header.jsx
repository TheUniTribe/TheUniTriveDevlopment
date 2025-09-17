import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Bell,
  Mail,
  Home,
  MessageCircle,
  Briefcase,
  ShoppingBag,
  BookOpen,
  X,
  Menu,
  MicVocal,
  User,
  Settings,
  LogOut,
  Users
} from 'lucide-react';



const Header = ({ SetPage = () => {} }) => {
  const { auth } = usePage().props;
  const { post } = useForm();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [isMessagesDropdownOpen, setIsMessagesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  const [activePage, setActivePage] = useState('dashboard');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isLiveHovered, setIsLiveHovered] = useState(false);
  
  const notificationRef = useRef(null);
  const messagesRef = useRef(null);
  const profileRef = useRef(null);
  const liveModalRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Menu items data for consistency across desktop and mobile
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'discussion', label: 'Forum', icon: MessageCircle },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'marketplace', label: 'Market', icon: ShoppingBag },
    { id: 'learning', label: 'Learn', icon: BookOpen },
  ];

  // Split logo text for letter animation
  const logoText = "TheUni";
  const logoSuffix = "Tribe";

  // Handle navigation without page refresh - memoized with useCallback
  const handleNavigation = useCallback((pageName, event) => {
    event.preventDefault();
    setActivePage(pageName);
    SetPage(pageName);
  }, [SetPage]);

  // Mock notifications data
  const notifications = [
    { id: 1, text: 'New message from Sarah', time: '10 min ago', read: false },
    { id: 2, text: 'Your post got 15 likes', time: '1 hour ago', read: false },
    { id: 3, text: 'Campus event starting tomorrow', time: '2 hours ago', read: true },
  ];

  // Mock messages data
  const messages = [
    { id: 1, name: 'Alex Johnson', text: 'Hey, are you going to the study session?', time: 'Just now', unread: true },
    { id: 2, name: 'Professor Miller', text: 'Reminder: Assignment due tomorrow', time: '30 min ago', unread: true },
    { id: 3, name: 'Campus News', text: 'New resources available in library', time: '2 hours ago', unread: false },
  ];

  // Mock live events data
  const liveEvents = [
    { id: 1, title: 'Tech Conference 2023', organizer: 'Computer Science Dept', viewers: 245, status: 'live' },
    { id: 2, title: 'Career Fair Orientation', organizer: 'Career Services', viewers: 128, status: 'live' },
    { id: 3, title: 'Alumni Networking Session', organizer: 'Alumni Association', viewers: 87, status: 'starting_soon' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Logo letter animation on page load
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
    
    window.addEventListener('scroll', handleScroll);
    
    // Handle click outside dropdowns and modal
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsDropdownOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
      // Only close modal if clicking outside AND not clicking any live button
      if (liveModalRef.current && !liveModalRef.current.contains(event.target) && 
          !event.target.closest('[data-live-button]') &&
          !event.target.closest('[data-mobile-live]')) {
        setIsLiveModalOpen(false);
      }
    };

    // Handle ESC key press
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsNotificationsDropdownOpen(false);
        setIsMessagesDropdownOpen(false);
        setIsProfileDropdownOpen(false);
        setIsLiveModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timeout);
    };
  }, []);

  // Focus trap for dropdowns
  useEffect(() => {
    if (isNotificationsDropdownOpen && notificationRef.current) {
      const focusableElements = notificationRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  }, [isNotificationsDropdownOpen]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 
        ${isScrolled 
          ? 'backdrop-blur-md bg-white/80 shadow-lg py-1' 
          : 'bg-white shadow-md py-2'}`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-4">
              <Link
                href="/home"
                className="flex items-center space-x-2 group"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                {/* Enhanced Logo */}
                <div className="flex items-center space-x-2 group cursor-pointer">
                  {/* Academic-inspired icon */}
                  <div className="relative">
                    <div className={`absolute inset bg-blue-50 rounded-full transform scale-0 transition-all duration-400 ${isLogoHovered ? 'scale-100' : ''}`}></div>
                    <span className="relative z-10 text-blue-600 transition-all duration-300 group-hover:rotate-12">
                      <GraduationCap className="h-6 w-6" />
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
                          } ${isLogoHovered ? 'text-blue-700' : 'text-gray-900'}`}
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
                        } ${isLogoHovered ? 'text-teal-600' : 'text-blue-600'}`}
                        style={{
                          transitionDelay: `${logoText.length * 80 + 80}ms`,
                          transitionProperty: 'opacity, transform, color'
                        }}
                      >
                        {logoSuffix}
                      </span>
                    </span>

                    {/* Academic underline effect */}
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500 ${isLogoHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                  </div>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 h-full">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`group flex items-center h-full transition-all duration-200 relative ${
                      activePage === item.id
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={(e) => handleNavigation(item.id, e)}
                  >
                    <div className="flex items-center h-full px-2 py-2 rounded-md group-hover:bg-indigo-50 transition-colors duration-200">
                      <div className="p-1 mr-1">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-base">{item.label}</span>
                    </div>
                    {activePage === item.id && (
                      <div className="absolute bottom-0 left-8 right-0 h-0.5 bg-indigo-600"></div>
                    )}
                  </button>
                );
              })}
              
              {/* Enhanced Live Now Button */}
              <button
                data-live-button
                onClick={() => setIsLiveModalOpen(true)}
                onMouseEnter={() => setIsLiveHovered(true)}
                onMouseLeave={() => setIsLiveHovered(false)}
                className="group flex items-center h-full transition-all duration-200 relative"
              >
                <div className="flex items-center px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <div className="relative p-1 mr-1.5 rounded-md bg-white/10">
                    <MicVocal className="h-4 w-4 text-white" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center">
                      <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                    </span>
                  </div>
                  <span className="text-base font-medium">Live Now</span>
                </div>
                
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className={`absolute top-0 left-0 h-full w-8 bg-white/20 -skew-x-12 transition-all duration-700 ease-in-out ${isLiveHovered ? 'animate-shine' : 'opacity-0'}`}></div>
                </div>
              </button>
            </nav>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:block relative" ref={messagesRef}>
                <button 
                  className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-200 rounded-md hover:bg-indigo-50"
                  onClick={() => {
                    setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
                    setIsNotificationsDropdownOpen(false);
                  }}
                  aria-expanded={isMessagesDropdownOpen}
                  aria-controls="messages-dropdown"
                >
                  <Mail className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                </button>
                
                <AnimatePresence>
                  {isMessagesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50"
                      id="messages-dropdown"
                      role="menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Messages</h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">3 new</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {messages.map(message => (
                          <div key={message.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${message.unread ? 'bg-blue-50' : ''}`}>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-900">{message.name}</span>
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.text}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        className="block w-full text-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150"
                        onClick={(e) => {
           
                          handleNavigation('messages', e);
            
                        }}
                      >
                        View all messages
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={notificationRef}>
                <button 
                  className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-200 rounded-md hover:bg-indigo-50"
                  onClick={() => {
                    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
                    setIsMessagesDropdownOpen(false);
                  }}
                  aria-expanded={isNotificationsDropdownOpen}
                  aria-controls="notifications-dropdown"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">2</span>
                </button>
                
                <AnimatePresence>
                  {isNotificationsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50"
                      id="notifications-dropdown"
                      role="menu"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">2 new</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${!notification.read ? 'bg-blue-50' : ''}`}>
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                                            <button
                        className="block w-full text-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150"
                        onClick={(e) => {
           
                          handleNavigation('notifications', e);
            
                        }}
                      >
                        View all messages
                      </button>
                      {/* <Link href="/notifications" className="block text-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150">
                        View all notifications
                      </Link> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={profileRef}>
                <button 
                  className="text-gray-600 hover:text-indigo-600 flex items-center space-x-2 focus:outline-none transition-colors duration-200"
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsNotificationsDropdownOpen(false);
                    setIsMessagesDropdownOpen(false);
                  }}
                  aria-expanded={isProfileDropdownOpen}
                  aria-controls="profile-dropdown"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center transition-all duration-300 hover:from-indigo-200 hover:to-purple-200 hover:shadow-sm">
                    <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50"
                      id="profile-dropdown"
                      role="menu"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-900 font-medium truncate">{auth.user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{auth.user?.email || 'user@example.com'}</p>
                      </div>
                      <Link href="#" onClick={(e) => handleNavigation("profile", e)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                      <Link href="#" onClick={(e) => handleNavigation("settings", e)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                        <Settings className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => post("/logout")}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                data-mobile-menu-button
                className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg z-40 overflow-hidden"
            id="mobile-menu"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button 
                    key={item.id}
                    className={`flex items-center px-3 py-3 rounded-md transition-colors duration-150 w-full ${
                      activePage === item.id
                        ? 'bg-indigo-100 text-indigo-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleNavigation(item.id, e);
                    }}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="ml-3 text-base font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Enhanced Mobile Live Now Button */}
              <button
                data-mobile-live
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLiveModalOpen(true);
                }}
                className="flex items-center w-full px-3 py-3 rounded-md transition-colors duration-150 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
              >
                <div className="relative">
                  <MicVocal className="h-4 w-4 text-white" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                  </span>
                </div>
                <span className="ml-3 text-base font-medium">Live Now</span>
              </button>

              {/* Mobile notifications and messages */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  className="flex items-center w-full px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsMessagesDropdownOpen(true);
                  }}
                >
                  <Mail className="h-4 w-4" />
                  <span className="ml-3 text-base font-medium">Messages</span>
                  <span className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                </button>

                <button
                  className="flex items-center w-full px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsNotificationsDropdownOpen(true);
                  }}
                >
                  <Bell className="h-4 w-4" />
                  <span className="ml-3 text-base font-medium">Notifications</span>
                  <span className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">2</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Events Modal */}
      <AnimatePresence>
        {isLiveModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLiveModalOpen(false)}
          >
            <motion.div 
              ref={liveModalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Live Events</h3>
                <button
                  onClick={() => setIsLiveModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                {liveEvents.map(event => (
                  <div key={event.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
                      </div>
                      <div className="flex items-center">
                        {event.status === 'live' && (
                          <span className="flex items-center mr-3">
                            <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                            <span className="text-xs font-medium text-red-600">LIVE</span>
                          </span>
                        )}
                        {event.status === 'starting_soon' && (
                          <span className="text-xs font-medium text-orange-600">Starting Soon</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {event.viewers} watching
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200">
                      Join Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                More events coming soon. Check back later!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Add shine animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Header;