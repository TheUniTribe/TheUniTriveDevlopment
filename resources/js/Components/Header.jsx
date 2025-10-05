import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// ICON IMPORTS - Using simple SVG icons to avoid external dependencies
// =============================================================================

const IconWrapper = ({ children, className = "" }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {children}
    </svg>
);

// Academic/Education themed icons
const GraduationCapIcon = () => (
    <IconWrapper>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </IconWrapper>
);

const HomeIcon = () => (
    <IconWrapper>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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

// =============================================================================
// CONSTANTS AND CONFIGURATION
// =============================================================================

/**
 * Configuration for navigation menu items
 * @type {Array<{id: string, label: string, icon: React.ComponentType, href: string}>}
 */
const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/dashboard' },
    { id: 'discussion', label: 'Forum', icon: MessageCircleIcon, href: '/forum' },
    { id: 'jobs', label: 'Jobs', icon: BriefcaseIcon, href: '/jobs' },
    { id: 'marketplace', label: 'Market', icon: ShoppingBagIcon, href: '/marketplace' },
    { id: 'learning', label: 'Learn', icon: BookOpenIcon, href: '/learn' },
];

/**
 * Mock data for notifications
 * @type {Array<{id: number, text: string, time: string, read: boolean}>}
 */
const MOCK_NOTIFICATIONS = [
    { id: 1, text: 'New message from Sarah', time: '10 min ago', read: false },
    { id: 2, text: 'Your post got 15 likes', time: '1 hour ago', read: false },
    { id: 3, text: 'Campus event starting tomorrow', time: '2 hours ago', read: true },
];

/**
 * Mock data for messages
 * @type {Array<{id: number, name: string, text: string, time: string, unread: boolean}>}
 */
const MOCK_MESSAGES = [
    { id: 1, name: 'Alex Johnson', text: 'Hey, are you going to the study session?', time: 'Just now', unread: true },
    { id: 2, name: 'Professor Miller', text: 'Reminder: Assignment due tomorrow', time: '30 min ago', unread: true },
    { id: 3, name: 'Campus News', text: 'New resources available in library', time: '2 hours ago', unread: false },
];

/**
 * Mock data for live events
 * @type {Array<{id: number, title: string, organizer: string, viewers: number, status: 'live' | 'starting_soon'}>}
 */
const MOCK_LIVE_EVENTS = [
    { id: 1, title: 'Tech Conference 2023', organizer: 'Computer Science Dept', viewers: 245, status: 'live' },
    { id: 2, title: 'Career Fair Orientation', organizer: 'Career Services', viewers: 128, status: 'live' },
    { id: 3, title: 'Alumni Networking Session', organizer: 'Alumni Association', viewers: 87, status: 'starting_soon' },
];

// =============================================================================
// REUSABLE COMPONENTS
// =============================================================================

/**
 * Logo Component with hover animations
 * @param {Object} props
 * @param {string} props.logoText - Main logo text
 * @param {string} props.logoSuffix - Secondary logo text
 * @param {boolean} props.isHovered - Hover state
 * @param {number} props.visibleLetters - Number of visible letters for animation
 */
const LogoComponent = memo(({ logoText, logoSuffix, isHovered, visibleLetters }) => (
    <Link href="/home" className="flex items-center space-x-2 group">
        <div className="flex items-center space-x-2 group cursor-pointer">
            {/* Academic-inspired icon */}
            <div className="relative">
                <div className={`absolute inset bg-blue-50 rounded-full transform scale-0 transition-all duration-400 ${isHovered ? 'scale-100' : ''}`}></div>
                <span className="relative z-10 text-blue-600 transition-all duration-300 group-hover:rotate-12">
                    <GraduationCapIcon />
                </span>
            </div>

            {/* Animated text */}
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
    </Link>
));

/**
 * Navigation Item Component
 * @param {Object} props
 * @param {Object} props.item - Menu item configuration
 * @param {string} props.activePage - Currently active page
 * @param {Function} props.onNavigate - Navigation handler
 */
const NavigationItem = memo(({ item, activePage, onNavigate }) => {
    const IconComponent = item.icon;
    
    return (
        <button
            className={`group flex items-center h-full transition-all duration-200 relative ${
                activePage === item.id ? 'text-gray-900 font-semibold' : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={(e) => onNavigate(item.id, e)}
            aria-current={activePage === item.id ? 'page' : undefined}
        >
            <div className="flex items-center h-full px-2 py-2 rounded-md group-hover:bg-indigo-50 transition-colors duration-200">
                <div className="p-1 mr-1">
                    <IconComponent />
                </div>
                <span className="text-base">{item.label}</span>
            </div>
            {activePage === item.id && (
                <div className="absolute bottom-0 left-8 right-0 h-0.5 bg-indigo-600"></div>
            )}
        </button>
    );
});

/**
 * Live Button Component with shine effect
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.isHovered - Hover state
 * @param {string} props.variant - Button variant ('desktop' | 'mobile')
 */
const LiveButton = memo(({ onClick, isHovered, variant = 'desktop' }) => {
    const buttonClass = variant === 'mobile' 
        ? "flex items-center w-full px-3 py-3 rounded-md transition-colors duration-150 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
        : "group flex items-center h-full transition-all duration-200 relative";

    return (
        <button
            data-live-button={variant === 'desktop'}
            data-mobile-live={variant === 'mobile'}
            onClick={onClick}
            onMouseEnter={variant === 'desktop' ? () => {} : undefined}
            onMouseLeave={variant === 'desktop' ? () => {} : undefined}
            className={buttonClass}
        >
            <div className={`flex items-center ${variant === 'desktop' ? 'px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white' : ''}`}>
                <div className="relative p-1 mr-1.5 rounded-md bg-white/10">
                    <MicIcon />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center">
                        <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                    </span>
                </div>
                <span className="text-base font-medium">Live Now</span>
            </div>
            
            {variant === 'desktop' && (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className={`absolute top-0 left-0 h-full w-8 bg-white/20 -skew-x-12 transition-all duration-700 ease-in-out ${isHovered ? 'animate-shine' : 'opacity-0'}`}></div>
                </div>
            )}
        </button>
    );
});

/**
 * Dropdown Component for notifications, messages, etc.
 * @param {Object} props
 * @param {boolean} props.isOpen - Dropdown open state
 * @param {React.Ref} props.ref - Dropdown ref
 * @param {string} props.title - Dropdown title
 * @param {Array} props.items - Dropdown items
 * @param {React.ComponentType} props.icon - Item icon component
 * @param {Function} props.onClose - Close handler
 * @param {string} props.type - Dropdown type ('notifications' | 'messages')
 */
const Dropdown = memo(({ isOpen, ref, title, items, icon: Icon, onClose, type = 'notifications' }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50"
                role="menu"
            >
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        {items.filter(item => type === 'messages' ? item.unread : !item.read).length} new
                    </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            (type === 'messages' ? item.unread : !item.read) ? 'bg-blue-50' : ''
                        }`}>
                            {type === 'messages' ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                        <span className="text-xs text-gray-500">{item.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{item.text}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-800">{item.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <button className="block w-full text-center px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150">
                    View all {title.toLowerCase()}
                </button>
            </motion.div>
        )}
    </AnimatePresence>
));

/**
 * Profile Dropdown Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Dropdown open state
 * @param {React.Ref} props.ref - Dropdown ref
 * @param {Object} props.user - User data
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.onLogout - Logout handler
 */
const ProfileDropdown = memo(({ isOpen, ref, user, onNavigate, onLogout }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50"
                role="menu"
            >
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <button onClick={(e) => onNavigate("profile", e)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <UserIcon />
                    <span className="ml-3">Profile</span>
                </button>
                <button onClick={(e) => onNavigate("settings", e)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <SettingsIcon />
                    <span className="ml-3">Settings</span>
                </button>
                <div className="border-t border-gray-100"></div>
                <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <LogOutIcon />
                    <span className="ml-3">Sign Out</span>
                </button>
            </motion.div>
        )}
    </AnimatePresence>
));

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Header Component
 * 
 * A comprehensive header component with navigation, user menu, notifications,
 * and live events features. Built for Inertia.js with responsive design.
 * 
 * @param {Object} props
 * @param {Function} props.SetPage - Function to set the current page
 * @param {Array} props.customMenuItems - Additional menu items (optional)
 * @param {Object} props.customStyles - Custom styling options (optional)
 * 
 * @example
 * <Header SetPage={setCurrentPage} />
 */
const Header = ({ SetPage = () => {}, customMenuItems = [], customStyles = {} }) => {
    const { auth } = usePage().props;
    const { post } = useForm();
    
    // State management
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
    
    // Refs for click outside detection
    const notificationRef = useRef(null);
    const messagesRef = useRef(null);
    const profileRef = useRef(null);
    const liveModalRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Combine default and custom menu items
    const menuItems = [...MENU_ITEMS, ...customMenuItems];
    const logoText = "TheUni";
    const logoSuffix = "Tribe";

    /**
     * Handle navigation between pages
     * @param {string} pageName - Target page name
     * @param {Event} event - Click event
     */
    const handleNavigation = useCallback((pageName, event) => {
        event.preventDefault();
        setActivePage(pageName);
        SetPage(pageName);
    }, [SetPage]);

    /**
     * Handle user logout
     */
    const handleLogout = () => {
        post("/logout");
    };

    // Effects for scroll handling and animations
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Logo letter animation
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
        
        // Click outside handlers
        const handleClickOutside = (event) => {
            const refs = [
                { ref: notificationRef, setter: setIsNotificationsDropdownOpen },
                { ref: messagesRef, setter: setIsMessagesDropdownOpen },
                { ref: profileRef, setter: setIsProfileDropdownOpen },
                { ref: mobileMenuRef, setter: setIsMobileMenuOpen },
                { ref: liveModalRef, setter: setIsLiveModalOpen }
            ];

            refs.forEach(({ ref, setter }) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setter(false);
                }
            });

            // Special handling for mobile menu and live modal
            if (!event.target.closest('[data-mobile-menu-button]') && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
            
            if (!event.target.closest('[data-live-button]') && 
                !event.target.closest('[data-mobile-live]') && 
                isLiveModalOpen) {
                setIsLiveModalOpen(false);
            }
        };

        // ESC key handler
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
    }, [isMobileMenuOpen, isLiveModalOpen, logoText.length, visibleLetters]);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 
                ${isScrolled 
                    ? 'backdrop-blur-md bg-white/80 shadow-lg py-1' 
                    : 'bg-white shadow-md py-2'}`}
                style={customStyles}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-10">
                        {/* Logo */}
                        <div className="flex items-center space-x-4">
                            <LogoComponent
                                logoText={logoText}
                                logoSuffix={logoSuffix}
                                isHovered={isLogoHovered}
                                visibleLetters={visibleLetters}
                            />
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6 h-full">
                            {menuItems.map((item) => (
                                <NavigationItem
                                    key={item.id}
                                    item={item}
                                    activePage={activePage}
                                    onNavigate={handleNavigation}
                                />
                            ))}
                            
                            <LiveButton
                                onClick={() => setIsLiveModalOpen(true)}
                                isHovered={isLiveHovered}
                                variant="desktop"
                            />
                        </nav>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {/* Messages Dropdown */}
                            <div className="hidden md:block relative" ref={messagesRef}>
                                <button 
                                    className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-200 rounded-md hover:bg-indigo-50"
                                    onClick={() => {
                                        setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
                                        setIsNotificationsDropdownOpen(false);
                                    }}
                                    aria-expanded={isMessagesDropdownOpen}
                                >
                                    <MailIcon />
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                        {MOCK_MESSAGES.filter(msg => msg.unread).length}
                                    </span>
                                </button>
                                
                                <Dropdown
                                    isOpen={isMessagesDropdownOpen}
                                    ref={messagesRef}
                                    title="Messages"
                                    items={MOCK_MESSAGES}
                                    icon={MailIcon}
                                    onClose={() => setIsMessagesDropdownOpen(false)}
                                    type="messages"
                                />
                            </div>

                            {/* Notifications Dropdown */}
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    className="text-gray-600 hover:text-indigo-600 relative p-2 transition-all duration-200 rounded-md hover:bg-indigo-50"
                                    onClick={() => {
                                        setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
                                        setIsMessagesDropdownOpen(false);
                                    }}
                                    aria-expanded={isNotificationsDropdownOpen}
                                >
                                    <BellIcon />
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                        {MOCK_NOTIFICATIONS.filter(notif => !notif.read).length}
                                    </span>
                                </button>
                                
                                <Dropdown
                                    isOpen={isNotificationsDropdownOpen}
                                    ref={notificationRef}
                                    title="Notifications"
                                    items={MOCK_NOTIFICATIONS}
                                    icon={BellIcon}
                                    onClose={() => setIsNotificationsDropdownOpen(false)}
                                    type="notifications"
                                />
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button 
                                    className="text-gray-600 hover:text-indigo-600 flex items-center space-x-2 focus:outline-none transition-colors duration-200"
                                    onClick={() => {
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                        setIsNotificationsDropdownOpen(false);
                                        setIsMessagesDropdownOpen(false);
                                    }}
                                    aria-expanded={isProfileDropdownOpen}
                                >
                                    <div className="h-8 w-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center transition-all duration-300 hover:from-indigo-200 hover:to-purple-200 hover:shadow-sm">
                                        <div className="h-7 w-7 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                            {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                </button>
                                
                                <ProfileDropdown
                                    isOpen={isProfileDropdownOpen}
                                    ref={profileRef}
                                    user={auth.user}
                                    onNavigate={handleNavigation}
                                    onLogout={handleLogout}
                                />
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                data-mobile-menu-button
                                className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        ref={mobileMenuRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white shadow-lg z-40 overflow-hidden"
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
                                        <IconComponent />
                                        <span className="ml-3 text-base font-medium">{item.label}</span>
                                    </button>
                                );
                            })}

                            <LiveButton
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsLiveModalOpen(true);
                                }}
                                variant="mobile"
                            />

                            {/* Mobile notifications and messages */}
                            <div className="pt-2 border-t border-gray-200">
                                <button
                                    className="flex items-center w-full px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsMessagesDropdownOpen(true);
                                    }}
                                >
                                    <MailIcon />
                                    <span className="ml-3 text-base font-medium">Messages</span>
                                    <span className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                        {MOCK_MESSAGES.filter(msg => msg.unread).length}
                                    </span>
                                </button>

                                <button
                                    className="flex items-center w-full px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsNotificationsDropdownOpen(true);
                                    }}
                                >
                                    <BellIcon />
                                    <span className="ml-3 text-base font-medium">Notifications</span>
                                    <span className="ml-auto h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                        {MOCK_NOTIFICATIONS.filter(notif => !notif.read).length}
                                    </span>
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
                                    <XIcon />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                                {MOCK_LIVE_EVENTS.map(event => (
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
                                                <UsersIcon />
                                                <span className="ml-1">{event.viewers} watching</span>
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

            {/* Shine animation styles */}
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

export default memo(Header);