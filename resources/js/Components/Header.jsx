// Header.jsx
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

// ICON WRAPPER + ICONS
const IconWrapper = ({ children, className = "", size = "w-4 h-4" }) => (
  <svg className={`${size} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

// Define all the icons that were missing
const HomeIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </IconWrapper>
);

const GraduationCapIcon = () => (
  <IconWrapper>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </IconWrapper>
);

const MessageCircleIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </IconWrapper>
);

const BriefcaseIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
  </IconWrapper>
);

const ShoppingBagIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </IconWrapper>
);

const BookOpenIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </IconWrapper>
);

const BellIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </IconWrapper>
);

const MailIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </IconWrapper>
);

const MicIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </IconWrapper>
);

const UserIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </IconWrapper>
);

const SettingsIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </IconWrapper>
);

const LogOutIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </IconWrapper>
);

const UsersIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </IconWrapper>
);

const MenuIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </IconWrapper>
);

const XIcon = () => (
  <IconWrapper>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </IconWrapper>
);

// Enhanced CONFIG with better colors and structure
const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/dashboard', color: 'from-blue-500 to-blue-600' },
  { id: 'discussion', label: 'Forum', icon: MessageCircleIcon, href: '/forum', color: 'from-green-500 to-green-600' },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseIcon, href: '/jobs', color: 'from-amber-500 to-amber-600' },
  { id: 'marketplace', label: 'Market', icon: ShoppingBagIcon, href: '/marketplace', color: 'from-emerald-500 to-emerald-600' },
  { id: 'learning', label: 'Learn', icon: BookOpenIcon, href: '/learn', color: 'from-purple-500 to-purple-600' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: 'New message from Sarah', time: '10 min ago', read: false, icon: MessageCircleIcon, type: 'message' },
  { id: 2, text: 'Your post got 15 likes', time: '1 hour ago', read: false, icon: UsersIcon, type: 'social' },
  { id: 3, text: 'Campus event starting tomorrow', time: '2 hours ago', read: true, icon: BellIcon, type: 'event' },
];

const MOCK_MESSAGES = [
  { id: 1, name: 'Alex Johnson', text: 'Hey, are you going to the study session?', time: 'Just now', unread: true, avatar: 'AJ' },
  { id: 2, name: 'Professor Miller', text: 'Reminder: Assignment due tomorrow', time: '30 min ago', unread: true, avatar: 'PM' },
  { id: 3, name: 'Campus News', text: 'New resources available in library', time: '2 hours ago', unread: false, avatar: 'CN' },
];

// ENHANCED SUB-COMPONENTS
const LogoComponent = memo(({ logoText, logoSuffix, isHovered, visibleLetters }) => (
  <Link href="/home" className="flex items-center space-x-2 group">
    <div className="flex items-center space-x-3 group cursor-pointer">
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"
          animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span 
          className="relative z-10 text-blue-600 block"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <GraduationCapIcon />
        </motion.span>
      </div>

      <div className="relative">
        <span className="text-2xl font-bold font-serif tracking-tight bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
          {logoText.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: visibleLetters > index ? 1 : 0, x: visibleLetters > index ? 0 : -10 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: visibleLetters > logoText.length ? 1 : 0, x: visibleLetters > logoText.length ? 0 : -10 }}
            transition={{ delay: logoText.length * 0.08 + 0.1, duration: 0.5 }}
          >
            {logoSuffix}
          </motion.span>
        </span>

        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  </Link>
));

const NavigationItem = memo(({ item, activePage, onNavigate }) => {
  const IconComponent = item.icon;
  const isActive = activePage === item.id;
  
  return (
    <motion.button
      className={`group flex items-center h-full transition-all duration-300 relative ${
        isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
      }`}
      onClick={(e) => onNavigate(item.id, e)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`flex items-center h-full px-3 py-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm' 
          : 'group-hover:bg-gray-50 group-hover:shadow-sm'
      }`}>
        <div className={`p-1.5 mr-2 rounded-lg transition-colors duration-300 ${
          isActive ? 'bg-blue-100 text-blue-600' : 'group-hover:bg-blue-100 group-hover:text-blue-600'
        }`}>
          <IconComponent />
        </div>
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      
      {isActive && (
        <motion.div 
          className="absolute bottom-0 left-3 right-3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full"
          layoutId="activeIndicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
});

const LiveButton = memo(({ onClick, onMouseEnter, onMouseLeave, isHovered, variant = 'desktop' }) => {
  const buttonClass = variant === 'mobile'
    ? "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
    : "group flex items-center h-full transition-all duration-300 relative";

  return (
    <motion.button
      data-live-button={variant === 'desktop'}
      data-mobile-live={variant === 'mobile'}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={buttonClass}
    >
      <div className={`flex items-center ${
        variant === 'desktop' 
          ? 'px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-red-500 to-pink-600 text-white relative overflow-hidden' 
          : ''
      }`}>
        <div className="relative p-1.5 mr-2 rounded-lg bg-white/20 backdrop-blur-sm" aria-hidden>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MicIcon />
          </motion.div>
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
          </span>
        </div>
        <span className="text-sm font-semibold">Live Now</span>
        
        {variant === 'desktop' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{ x: isHovered ? ['0%', '100%'] : '0%' }}
            transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
          />
        )}
      </div>
    </motion.button>
  );
});

// ENHANCED Dropdown components
const Dropdown = memo(({ isOpen, ref, title, items, onClose, type = 'notifications' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200/80 backdrop-blur-lg z-[9999] overflow-hidden"
        role="menu"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <span className="text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-2.5 py-1 rounded-full shadow-sm">
            {items.filter(item => type === 'messages' ? item.unread : !item.read).length} new
          </span>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`px-5 py-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-b-0 ${
                (type === 'messages' ? item.unread : !item.read) ? 'bg-blue-50/50' : ''
              }`}
            >
              {type === 'messages' ? (
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {item.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold text-gray-900 truncate">{item.name}</span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{item.text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      item.type === 'message' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'social' ? 'bg-green-100 text-green-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {item.icon && <item.icon />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{item.text}</p>
                    <p className="text-xs text-gray-500 mt-1.5">{item.time}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <button className="block w-full text-center px-5 py-3 text-sm font-medium text-indigo-600 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-200 bg-gray-50/50">
          View all {title.toLowerCase()}
        </button>
      </motion.div>
    )}
  </AnimatePresence>
));

const ProfileDropdown = memo(({ isOpen, ref, user, onNavigate, onLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200/80 backdrop-blur-lg z-[9999] overflow-hidden"
        role="menu"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500 truncate mt-1">{user?.email || 'user@example.com'}</p>
        </div>
        
        <div className="py-2">
          <motion.button 
            whileHover={{ x: 4 }}
            onClick={(e) => onNavigate("profile", e)} 
            className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="p-1.5 mr-3 rounded-lg bg-blue-100 text-blue-600">
              <UserIcon />
            </div>
            <span>Profile</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ x: 4 }}
            onClick={(e) => onNavigate("settings", e)} 
            className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="p-1.5 mr-3 rounded-lg bg-purple-100 text-purple-600">
              <SettingsIcon />
            </div>
            <span>Settings</span>
          </motion.button>
        </div>
        
        <div className="border-t border-gray-100">
          <motion.button 
            whileHover={{ x: 4 }}
            onClick={onLogout} 
            className="flex items-center w-full px-5 py-3 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200"
          >
            <div className="p-1.5 mr-3 rounded-lg bg-red-100 text-red-600">
              <LogOutIcon />
            </div>
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

// ENHANCED HEADER
const Header = ({
  SetPage = () => {},
  customMenuItems = [],
  customStyles = {},
  // controlled props (optional)
  isLiveModalOpen,
  setIsLiveModalOpen,
  isNotificationsOpen,
  setIsNotificationsOpen,
  isMessagesOpen,
  setIsMessagesOpen,
  isProfileOpen,
  setIsProfileOpen,
}) => {
  const { auth } = usePage().props;
  const { post } = useForm();

  // local fallbacks if parent doesn't control panels
  const [localProfileOpen, setLocalProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isLiveHovered, setIsLiveHovered] = useState(false);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuItems = [...MENU_ITEMS, ...customMenuItems];
  const logoText = "TheUni";
  const logoSuffix = "Tribe";

  // Determine whether profile is controlled by parent
  const profileControlled = typeof setIsProfileOpen === 'function';
  const profileOpen = profileControlled ? !!isProfileOpen : localProfileOpen;

  const messagesControlled = typeof setIsMessagesOpen === 'function';
  const notificationsControlled = typeof setIsNotificationsOpen === 'function';

  const handleNavigation = useCallback((pageName, event) => {
    event?.preventDefault?.();
    setActivePage(pageName);
    SetPage(pageName);
  }, [SetPage]);

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

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

    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }

      if (notificationsControlled && !event.target.closest('[data-notifications]')) {
        setIsNotificationsOpen(false);
      }
      if (messagesControlled && !event.target.closest('[data-messages]')) {
        setIsMessagesOpen(false);
      }

      if (typeof setIsLiveModalOpen === 'function' && !event.target.closest('[data-live-button]') && !event.target.closest('[data-mobile-live]')) {
        setIsLiveModalOpen(false);
      }

      if (!profileControlled) {
        if (profileRef.current && !profileRef.current.contains(event.target)) setLocalProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        if (notificationsControlled) setIsNotificationsOpen(false);
        if (messagesControlled) setIsMessagesOpen(false);
        if (typeof setIsLiveModalOpen === 'function') setIsLiveModalOpen(false);
        if (!profileControlled) setLocalProfileOpen(false);
        if (profileControlled) setIsProfileOpen?.(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(timeout);
    };
  }, [
    isMobileMenuOpen,
    visibleLetters,
    setIsNotificationsOpen,
    setIsMessagesOpen,
    setIsLiveModalOpen,
    setIsProfileOpen,
    notificationsControlled,
    messagesControlled,
    profileControlled
  ]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-white/90 shadow-2xl py-1 border-b border-white/20' 
            : 'bg-white shadow-lg py-2'
        }`} 
        style={customStyles}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div 
              className="flex items-center space-x-4"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <LogoComponent 
                logoText={logoText} 
                logoSuffix={logoSuffix} 
                isHovered={isLogoHovered} 
                visibleLetters={visibleLetters} 
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 h-full">
              {menuItems.map(item => (
                <NavigationItem 
                  key={item.id} 
                  item={item} 
                  activePage={activePage} 
                  onNavigate={handleNavigation} 
                />
              ))}

              {/* Live trigger */}
              <LiveButton
                onClick={() => typeof setIsLiveModalOpen === 'function' && setIsLiveModalOpen(true)}
                onMouseEnter={() => setIsLiveHovered(true)}
                onMouseLeave={() => setIsLiveHovered(false)}
                isHovered={isLiveHovered}
                variant="desktop"
              />
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Messages trigger */}
              <div className="hidden md:block relative" data-messages>
                <motion.button
                  className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-300 rounded-xl hover:bg-indigo-50"
                  onClick={() => {
                    if (messagesControlled) {
                      setIsMessagesOpen(!isMessagesOpen);
                      notificationsControlled && setIsNotificationsOpen(false);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MailIcon />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg">
                    {MOCK_MESSAGES.filter(msg => msg.unread).length}
                  </span>
                </motion.button>
              </div>

              {/* Notifications trigger */}
              <div className="relative" data-notifications>
                <motion.button
                  className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-300 rounded-xl hover:bg-indigo-50"
                  onClick={() => {
                    if (notificationsControlled) {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      messagesControlled && setIsMessagesOpen(false);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BellIcon />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg">
                    {MOCK_NOTIFICATIONS.filter(notif => !notif.read).length}
                  </span>
                </motion.button>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  className="text-gray-600 hover:text-indigo-600 flex items-center space-x-2 focus:outline-none transition-colors duration-300"
                  onClick={() => {
                    if (profileControlled) {
                      setIsProfileOpen(prev => !prev);
                    } else {
                      setLocalProfileOpen(prev => !prev);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-9 w-9 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center transition-all duration-300 hover:from-indigo-200 hover:to-purple-200 hover:shadow-lg shadow-md">
                    <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </motion.button>

                {!profileControlled && (
                  <ProfileDropdown 
                    isOpen={localProfileOpen} 
                    ref={profileRef} 
                    user={auth.user} 
                    onNavigate={handleNavigation} 
                    onLogout={handleLogout} 
                  />
                )}
              </div>

              {/* Mobile menu toggle */}
              <motion.button 
                data-mobile-menu-button 
                className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-xl hover:bg-gray-100" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl z-[9998] overflow-hidden border-t border-gray-200/50"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {menuItems.map(item => {
                const IconComponent = item.icon;
                const isActive = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 w-full ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => { setIsMobileMenuOpen(false); handleNavigation(item.id, e); }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 mr-3 rounded-lg ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent />
                    </div>
                    <span className="text-base font-medium">{item.label}</span>
                  </motion.button>
                );
              })}

              <div className="pt-2">
                <LiveButton
                  onClick={() => { 
                    setIsMobileMenuOpen(false); 
                    typeof setIsLiveModalOpen === 'function' && setIsLiveModalOpen(true); 
                  }}
                  variant="mobile"
                />
              </div>

              <div className="pt-4 border-t border-gray-200/50 space-y-2">
                <motion.button 
                  className="flex items-center w-full px-4 py-4 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  onClick={() => { 
                    setIsMobileMenuOpen(false); 
                    if (typeof setIsMessagesOpen === 'function') setIsMessagesOpen(true); 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 mr-3 rounded-lg bg-blue-100 text-blue-600">
                    <MailIcon />
                  </div>
                  <span className="text-base font-medium">Messages</span>
                  <span className="ml-auto h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {MOCK_MESSAGES.filter(msg => msg.unread).length}
                  </span>
                </motion.button>

                <motion.button 
                  className="flex items-center w-full px-4 py-4 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  onClick={() => { 
                    setIsMobileMenuOpen(false); 
                    if (typeof setIsNotificationsOpen === 'function') setIsNotificationsOpen(true); 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 mr-3 rounded-lg bg-amber-100 text-amber-600">
                    <BellIcon />
                  </div>
                  <span className="text-base font-medium">Notifications</span>
                  <span className="ml-auto h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {MOCK_NOTIFICATIONS.filter(notif => !notif.read).length}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);