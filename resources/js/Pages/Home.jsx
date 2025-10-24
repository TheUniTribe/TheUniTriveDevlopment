import React, { useReducer, useRef, useEffect, useMemo, useCallback, Suspense, lazy, useState } from "react";
import { X, Users, MessageCircle, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FocusLock from "react-focus-lock";

/**
 * @file Home.jsx - Main application component with comprehensive UI state management
 * @description Centralized application with normalized data structures, dynamic routing, 
 * and enhanced accessibility features. Features include panel management, modal systems,
 * and lazy-loaded components with error boundaries.
 * 
 * @module Home
 * @version 2.0.0
 * @since 1.0.0
 */

// =============================================================================
// LAZY COMPONENT IMPORTS
// =============================================================================

/**
 * Lazy-loaded component imports for code splitting and performance optimization
 * @namespace LazyComponents
 */
const LazyComponents = {
  Header: lazy(() => import("@/Components/Header")),
  LeftSidebar: lazy(() => import("@/Components/LeftSidebar")),
  RightSidebar: lazy(() => import("@/Components/RightSidebar")),
  Discussion: lazy(() => import("@/Components/Discussion")),
  JobsSection: lazy(() => import("@/Components/JobsSection")),
  MarketplaceSection: lazy(() => import("@/Components/MarketplaceSection")),
  LearningHub: lazy(() => import("@/Components/LearningHub")),
  Profile: lazy(() => import("@/Components/Profile")),
  Dashboard: lazy(() => import("@/Components/Dashboard")),
  Settings: lazy(() => import("@/Components/Settings")),
  Messages: lazy(() => import("@/Components/Messages")),
  Notifications: lazy(() => import("@/Components/Notifications")),
  DiscoverGroups: lazy(() => import("@/Components/DiscoverGroups")),
  Articles: lazy(() => import("@/Pages/Articles")),
  Question: lazy(() => import("@/Components/Question"))
};

// =============================================================================
// DATA NORMALIZATION CONSTANTS
// =============================================================================

/**
 * Normalized data structures for application state
 * @namespace DataConstants
 */

/**
 * @constant {Object} NOTIFICATION_TYPES - Available notification types
 */
const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  SOCIAL: 'social',
  EVENT: 'event'
};

/**
 * @constant {Object} EVENT_STATUS - Live event status types
 */
const EVENT_STATUS = {
  LIVE: 'live',
  STARTING_SOON: 'starting_soon'
};

/**
 * @constant {Object} PANEL_TYPES - Available overlay panel types
 */
const PANEL_TYPES = {
  NOTIFICATIONS: 'notifications',
  MESSAGES: 'messages',
  PROFILE: 'profile'
};

/**
 * @constant {Object} MODAL_TYPES - Available modal types
 */
const MODAL_TYPES = {
  LIVE_EVENTS: 'live',
  CREATE_POST: 'createPost'
};

/**
 * @constant {Object} MOCK_NOTIFICATIONS - Normalized notifications data
 * @property {Object} byId - Notification objects keyed by ID
 * @property {string[]} allIds - Array of notification IDs in order
 */
const MOCK_NOTIFICATIONS = {
  byId: {
    1: { 
      id: 1, 
      text: "New message from Sarah", 
      time: "10 min ago", 
      read: false, 
      icon: "MessageCircle", 
      type: NOTIFICATION_TYPES.MESSAGE 
    },
    2: { 
      id: 2, 
      text: "Your post got 15 likes", 
      time: "1 hour ago", 
      read: false, 
      icon: "Users", 
      type: NOTIFICATION_TYPES.SOCIAL 
    },
    3: { 
      id: 3, 
      text: "Campus event starting tomorrow", 
      time: "2 hours ago", 
      read: true, 
      icon: "Bell", 
      type: NOTIFICATION_TYPES.EVENT 
    },
  },
  allIds: [1, 2, 3],
};

/**
 * @constant {Object} MOCK_MESSAGES - Normalized messages data
 */
const MOCK_MESSAGES = {
  byId: {
    1: { 
      id: 1, 
      name: "Alex Johnson", 
      text: "Hey — are you going to the study session?", 
      time: "Just now", 
      unread: true, 
      avatar: "AJ" 
    },
    2: { 
      id: 2, 
      name: "Professor Miller", 
      text: "Reminder: Assignment due tomorrow", 
      time: "30 min ago", 
      unread: true, 
      avatar: "PM" 
    },
    3: { 
      id: 3, 
      name: "Campus News", 
      text: "New resources available in library", 
      time: "2 hours ago", 
      unread: false, 
      avatar: "CN" 
    },
  },
  allIds: [1, 2, 3],
};

/**
 * @constant {Array} MOCK_LIVE_EVENTS - Live events data
 */
const MOCK_LIVE_EVENTS = [
  { 
    id: 1, 
    title: "Tech Conference 2023", 
    organizer: "Computer Science Dept", 
    viewers: 245, 
    status: EVENT_STATUS.LIVE 
  },
  { 
    id: 2, 
    title: "Career Fair Orientation", 
    organizer: "Career Services", 
    viewers: 128, 
    status: EVENT_STATUS.LIVE 
  },
  { 
    id: 3, 
    title: "Alumni Networking Session", 
    organizer: "Alumni Association", 
    viewers: 87, 
    status: EVENT_STATUS.STARTING_SOON 
  },
];

/**
 * @constant {Object} MOCK_USERS - User data structure
 */
const MOCK_USERS = {
  current: { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com" 
  },
  other: { 
    id: 2, 
    name: "Sarah Wilson", 
    email: "sarah@example.com" 
  },
};

// =============================================================================
// MOCK USER DATABASE FOR PROFILE COMPONENT
// =============================================================================

/**
 * @constant {Object} MOCK_USERS_DB - Mock user database for dynamic profiles
 */
const MOCK_USERS_DB = {
  1: {
    id: 1,
    name: "John Doe",
    designation: "Software Developer",
    location: "New York, NY",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe"
    },
    aboutContent: "Passionate software developer with 5+ years of experience in React and Node.js. Love open source and teaching.",
    experienceContent: "Senior Developer at TechCorp (2020-Present)\nFull Stack Developer at StartupInc (2018-2020)",
    reputation: {
      stats: [
        { label: "Posts", value: 45 },
        { label: "Likes", value: 120 },
        { label: "Comments", value: 78 },
        { label: "Followers", value: 200 }
      ],
      details: [
        { category: "Discussions", count: 15, last: "2 days ago" },
        { category: "Articles", count: 8, last: "1 week ago" },
        { category: "Comments", count: 30, last: "5 hours ago" }
      ]
    },
    discussions: [
      {
        title: "How to get started with React?",
        tag: "React",
        when: "3 hours ago",
        snippet: "I'm new to React and looking for resources..."
      },
      {
        title: "Best practices for API design",
        tag: "API",
        when: "1 day ago",
        snippet: "What are some key principles for designing APIs?"
      }
    ],
    activities: [
      { icon: "📝", title: "Posted a new article", when: "1 hour ago" },
      { icon: "💬", title: "Commented on a discussion", when: "3 hours ago" },
      { icon: "👍", title: "Liked a post", when: "5 hours ago" }
    ],
    comments: [
      {
        id: 1,
        name: "Jane Smith",
        when: "2 hours ago",
        text: "Great profile! Keep up the good work.",
        avatar: "https://i.pravatar.cc/72?img=2"
      },
      {
        id: 2,
        name: "Mike Johnson",
        when: "1 day ago",
        text: "Interesting experience section.",
        avatar: "https://i.pravatar.cc/72?img=3"
      }
    ]
  },
  2: {
    id: 2,
    name: "Sarah Wilson",
    designation: "UX Designer",
    location: "San Francisco, CA",
    email: "sarah.wilson@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=480&auto=format&fit=crop",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahwilson",
      github: "https://github.com/sarahwilson",
      twitter: "https://twitter.com/sarahwilson"
    },
    aboutContent: "Creative UX designer passionate about user-centered design and creating intuitive interfaces.",
    experienceContent: "Lead UX Designer at DesignStudio (2019-Present)\nUI Designer at CreativeAgency (2017-2019)",
    reputation: {
      stats: [
        { label: "Posts", value: 32 },
        { label: "Likes", value: 156 },
        { label: "Comments", value: 45 },
        { label: "Followers", value: 320 }
      ],
      details: [
        { category: "Design Reviews", count: 12, last: "1 day ago" },
        { category: "Tutorials", count: 5, last: "2 weeks ago" },
        { category: "Comments", count: 28, last: "3 hours ago" }
      ]
    },
    discussions: [
      {
        title: "Design systems best practices",
        tag: "Design",
        when: "5 hours ago",
        snippet: "How do you maintain consistency across large design systems?"
      },
      {
        title: "User research methods",
        tag: "Research",
        when: "2 days ago",
        snippet: "What are your favorite user research techniques?"
      }
    ],
    activities: [
      { icon: "🎨", title: "Shared design resources", when: "2 hours ago" },
      { icon: "💬", title: "Participated in design critique", when: "1 day ago" },
      { icon: "📚", title: "Completed UX course", when: "3 days ago" }
    ],
    comments: [
      {
        id: 1,
        name: "Alex Chen",
        when: "4 hours ago",
        text: "Love your design portfolio!",
        avatar: "https://i.pravatar.cc/72?img=4"
      },
      {
        id: 2,
        name: "Emily Davis",
        when: "1 day ago",
        text: "Great insights on design systems.",
        avatar: "https://i.pravatar.cc/72?img=5"
      }
    ]
  }
};

// =============================================================================
// UI STATE MANAGEMENT
// =============================================================================

/**
 * @typedef {Object} UIState
 * @property {string|null} openPanel - Currently open panel type
 * @property {Object|null} modal - Active modal information
 * @property {string} modal.name - Modal type identifier
 * @property {Object} [modal.props] - Modal props
 */

/**
 * @constant {UIState} initialUI - Initial UI state
 */
const initialUI = {
  openPanel: null,
  modal: null,
};

/**
 * UI reducer function for state management
 * @function uiReducer
 * @param {UIState} state - Current UI state
 * @param {Object} action - Action object
 * @param {string} action.type - Action type
 * @param {string} [action.panel] - Panel type for panel actions
 * @param {Object} [action.modal] - Modal data for modal actions
 * @returns {UIState} New UI state
 */
function uiReducer(state, action) {
  switch (action.type) {
    case "OPEN_PANEL":
      return { ...state, openPanel: action.panel };
    case "CLOSE_PANEL":
      return { ...state, openPanel: null };
    case "TOGGLE_PANEL":
      return { ...state, openPanel: state.openPanel === action.panel ? null : action.panel };
    case "OPEN_MODAL":
      return { ...state, modal: action.modal };
    case "CLOSE_MODAL":
      return { ...state, modal: null };
    default:
      return state;
  }
}

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Custom hook for UI state management
 * @function useUIState
 * @param {string} [initialContent="home"] - Initial active page
 * @returns {Object} UI state and actions
 * @returns {UIState} return.ui - Current UI state
 * @returns {Object} return.activePage - Active page information
 * @returns {Function} return.togglePanel - Toggle panel visibility
 * @returns {Function} return.openModal - Open modal
 * @returns {Function} return.closeModal - Close modal
 * @returns {Function} return.navigateTo - Navigate to page
 * @returns {Function} return.dispatch - Raw dispatch function
 */
function useUIState(initialContent = "home") {
  const [ui, dispatch] = useReducer(uiReducer, initialUI);
  const [activePage, setActivePage] = useState({ 
    name: initialContent, 
    props: {} 
  });

  const togglePanel = useCallback((panel) => 
    dispatch({ type: "TOGGLE_PANEL", panel }), []);
  
  const openModal = useCallback((name, props = {}) => 
    dispatch({ type: "OPEN_MODAL", modal: { name, props } }), []);
  
  const closeModal = useCallback(() => 
    dispatch({ type: "CLOSE_MODAL" }), []);

  const navigateTo = useCallback((name, props = {}) => {
    setActivePage({ name, props });
    dispatch({ type: "CLOSE_PANEL" });
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  return {
    ui,
    activePage,
    togglePanel,
    openModal,
    closeModal,
    navigateTo,
    dispatch
  };
}

/**
 * Custom hook for notifications and messages data
 * @function useMessageData
 * @returns {Object} Message data and actions
 */
function useMessageData() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  /**
   * Mark notification as read
   * @function markNotificationRead
   * @param {number} id - Notification ID
   */
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => ({
      ...prev,
      byId: { 
        ...prev.byId, 
        [id]: { ...prev.byId[id], read: true } 
      },
    }));
  }, []);

  /**
   * Get notifications as array
   * @function getNotificationsList
   * @returns {Array} Array of notifications
   */
  const getNotificationsList = useCallback(() => 
    notifications.allIds.map((id) => notifications.byId[id]), 
    [notifications]
  );

  /**
   * Get messages as array
   * @function getMessagesList
   * @returns {Array} Array of messages
   */
  const getMessagesList = useCallback(() => 
    messages.allIds.map((id) => messages.byId[id]), 
    [messages]
  );

  /**
   * Get unread counts for notifications and messages
   * @function getUnreadCounts
   * @returns {Object} Unread counts
   */
  const getUnreadCounts = useCallback(() => ({
    notifications: notifications.allIds.filter(id => !notifications.byId[id].read).length,
    messages: messages.allIds.filter(id => messages.byId[id].unread).length,
  }), [notifications, messages]);

  return {
    notifications,
    messages,
    markNotificationRead,
    getNotificationsList,
    getMessagesList,
    getUnreadCounts
  };
}

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

/**
 * Error Boundary Component for graceful error handling
 * @class ErrorBoundary
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
          <p className="text-red-600 mt-2">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Overlay Panel Component for notifications, messages, and profile
 * @function OverlayPanel
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether panel is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {React.Ref} props.closeRef - Ref for close button
 * @param {string} [props.className="w-80"] - Additional CSS classes
 * @param {string} [props.top="top-[72px]"] - Top positioning
 * @param {string} [props.right="right-4"] - Right positioning
 * @param {string} [props.idSuffix=""] - ID suffix for accessibility
 * @param {string} [props.ariaLabel] - ARIA label for accessibility
 * @returns {React.Component} Overlay panel component
 */
function OverlayPanel({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  closeRef, 
  className = "w-80", 
  top = "top-[72px]", 
  right = "right-4", 
  idSuffix = "",
  ariaLabel 
}) {
  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen, closeRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            key={`overlay-${title}-${idSuffix}`}
            className="fixed inset-0 z-[1400] bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel Content */}
          <motion.div
            key={`panel-${title}-${idSuffix}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={`fixed ${top} ${right} z-[1500] ${className} bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200`}
            role="dialog"
            aria-labelledby={`${title}-title-${idSuffix}`}
            aria-label={ariaLabel || title}
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <FocusLock returnFocus>
              {/* Panel Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <h3 
                  id={`${title}-title-${idSuffix}`} 
                  className="text-sm font-semibold text-gray-900"
                >
                  {title}
                </h3>
                <button 
                  ref={closeRef} 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors rounded-md hover:bg-gray-100" 
                  aria-label={`Close ${title}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Panel Body */}
              <div className="max-h-72 overflow-y-auto">
                {children}
              </div>
            </FocusLock>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Live Events Modal Component
 * @function LiveEventsModal
 * @param {Object} props - Component props
 * @param {Array} props.events - Array of live events
 * @param {Function} props.onClose - Close handler
 * @param {React.Ref} props.closeRef - Ref for close button
 * @returns {React.Component} Live events modal component
 */
function LiveEventsModal({ events, onClose, closeRef }) {
  return (
    <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <FocusLock returnFocus>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 id="live-events-title" className="text-xl font-bold text-gray-900">
            Live Events
          </h2>
          <button 
            ref={closeRef} 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-100" 
            aria-label="Close live events modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 mb-4 last:mb-0 bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h4>
                  <p className="text-gray-600 text-sm">{event.organizer}</p>
                </div>
                <div className="flex items-center ml-4">
                  {event.status === EVENT_STATUS.LIVE && (
                    <span className="flex items-center px-2 py-1 bg-red-50 border border-red-200 rounded-full">
                      <span className="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                      <span className="text-xs font-medium text-red-700">LIVE</span>
                    </span>
                  )}
                  {event.status === EVENT_STATUS.STARTING_SOON && (
                    <span className="px-2 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
                      Starting Soon
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{event.viewers.toLocaleString()} watching</span>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm">
                  Join Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 text-center bg-gray-50">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close Events
          </button>
        </div>
      </FocusLock>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Main Home Component
 * @function Home
 * @param {Object} props - Component props
 * @returns {React.Component} Main application component
 */
export default function Home() {
  // ===========================================================================
  // INITIALIZATION & DATA HOOKS
  // ===========================================================================
  
  /**
   * Initialize Inertia.js props with fallbacks
   * @type {Object}
   */
  const inertiaProps = (() => {
    let content = "home";
    let auth = { user: MOCK_USERS.current };
    
    try {
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      const { usePage } = require("@inertiajs/react");
      const page = usePage?.();
      if (page?.props) {
        content = page.props.content || content;
        auth = page.props.auth || { user: MOCK_USERS.current };
      }
    } catch (error) {
      console.warn('Inertia.js not available, using mock data:', error.message);
    }
    
    return { content, auth };
  })();

  // Initialize custom hooks
  const { 
    ui, 
    activePage, 
    togglePanel, 
    openModal, 
    closeModal, 
    navigateTo, 
    dispatch 
  } = useUIState(inertiaProps.content);

  const {
    markNotificationRead,
    getNotificationsList,
    getMessagesList,
    getUnreadCounts
  } = useMessageData();

  // ===========================================================================
  // COMPONENT STATE & REFS
  // ===========================================================================
  
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Refs for focus management
  const refs = {
    notificationsClose: useRef(null),
    messagesClose: useRef(null),
    profileClose: useRef(null),
    liveClose: useRef(null),
    previousActive: useRef(null)
  };

  // ===========================================================================
  // COMPUTED VALUES & MEMOIZED DATA
  // ===========================================================================

  /**
   * Component mapping for dynamic page rendering
   * @constant {Object} componentMap
   */
  const componentMap = useMemo(() => ({
    dashboard: LazyComponents.Dashboard,
    home: LazyComponents.Dashboard,
    profile: LazyComponents.Profile,
    settings: LazyComponents.Settings,
    discussion: LazyComponents.Discussion,
    jobs: LazyComponents.JobsSection,
    marketplace: LazyComponents.MarketplaceSection,
    learning: LazyComponents.LearningHub,
    messages: LazyComponents.Messages,
    notifications: LazyComponents.Notifications,
    discoverGroups: LazyComponents.DiscoverGroups,
  }), []);

  /**
   * Categories based on active page
   * @constant {Array} categories
   */
  const categories = useMemo(() => {
    const categoryMap = {
      home: ["All Posts", "All Discussions", "All Jobs"],
      discussion: ["All Topics", "General", "Academic", "Career"],
      jobs: ["All Jobs", "Internships", "Full-time", "Part-time"],
      marketplace: ["All Items", "Books", "Electronics", "Clothing"],
      learning: ["All Courses", "Web Development", "Data Science", "Design"],
    };
    return categoryMap[activePage.name] || ["All Posts", "Discussions", "Jobs", "Marketplace"];
  }, [activePage.name]);

  // Get current active component
  const ActiveComponent = componentMap[activePage.name] || LazyComponents.Dashboard;

  // ===========================================================================
  // SIDE EFFECTS
  // ===========================================================================

  /**
   * Handle body scroll locking when modals are open
   */
  useEffect(() => {
    const shouldLockScroll = ui.modal?.name === MODAL_TYPES.LIVE_EVENTS || activeModal;
    
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [ui.modal, activeModal]);

  /**
   * Global keyboard event handler
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (ui.modal) {
          dispatch({ type: "CLOSE_MODAL" });
        } else if (ui.openPanel) {
          dispatch({ type: "CLOSE_PANEL" });
        } else if (activeModal) {
          setActiveModal(null);
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [ui.modal, ui.openPanel, activeModal, dispatch]);

  /**
   * Focus management for accessibility
   */
  useEffect(() => {
    const isAnyOverlayOpen = ui.openPanel || ui.modal || activeModal;
    
    if (isAnyOverlayOpen) {
      refs.previousActive.current = document.activeElement;
    } else {
      refs.previousActive.current?.focus?.();
    }
  }, [ui.openPanel, ui.modal, activeModal]);

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handle user sign out
   * @function handleSignOut
   */
  const handleSignOut = useCallback(() => {
    window.location.href = "/logout";
  }, []);

  // ===========================================================================
  // RENDER FUNCTIONS
  // ===========================================================================

  /**
   * Render notifications panel content
   * @function renderNotificationsPanel
   * @returns {React.Component} Notifications panel JSX
   */
  const renderNotificationsPanel = () => (
    <>
      <div>
        {getNotificationsList().map((notification) => (
          <div 
            key={notification.id} 
            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
              !notification.read ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
            }`}
          >
            <p className="text-sm text-gray-800">{notification.text}</p>
            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            {!notification.read && (
              <div className="mt-2">
                <button 
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium" 
                  onClick={() => markNotificationRead(notification.id)}
                >
                  Mark as read
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 text-center bg-gray-50">
        <button 
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium" 
          onClick={() => navigateTo("notifications")}
        >
          View all notifications
        </button>
      </div>
    </>
  );

  /**
   * Render messages panel content
   * @function renderMessagesPanel
   * @returns {React.Component} Messages panel JSX
   */
  const renderMessagesPanel = () => (
    <>
      <div>
        {getMessagesList().map((message) => (
          <div 
            key={message.id} 
            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
              message.unread ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {message.name}
                </p>
                <p className="text-sm text-gray-700 truncate mt-1">
                  {message.text}
                </p>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap ml-3">
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 text-center bg-gray-50">
        <button 
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium" 
          onClick={() => navigateTo("messages")}
        >
          View all messages
        </button>
      </div>
    </>
  );

  /**
   * Render profile panel content
   * @function renderProfilePanel
   * @returns {React.Component} Profile panel JSX
   */
  const renderProfilePanel = () => (
    <>
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {inertiaProps.auth?.user?.name || "User"}
        </p>
        <p className="text-xs text-gray-500 truncate mt-1">
          {inertiaProps.auth?.user?.email || "user@example.com"}
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        <button 
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
          onClick={() => navigateTo("profile", { userId: inertiaProps.auth?.user?.id })}
        >
          <span className="text-sm text-gray-800 font-medium">My Profile</span>
        </button>
        
        <button 
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
          onClick={() => navigateTo("profile", { userId: MOCK_USERS.other.id })}
        >
          <span className="text-sm text-gray-800">View Sarah's Profile</span>
        </button>
        
        <button 
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors"
          onClick={() => navigateTo("settings")}
        >
          <span className="text-sm text-gray-800">Settings</span>
        </button>
        
        <button 
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center transition-colors text-red-600 hover:text-red-800"
          onClick={handleSignOut}
        >
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </>
  );

  // ===========================================================================
  // MAIN COMPONENT RENDER
  // ===========================================================================

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 relative">
      
      {/* Application Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-gray-200 shadow-sm">
        <ErrorBoundary fallback={
          <div className="p-3 text-red-600 bg-red-50 border-b border-red-200">
            Header failed to load
          </div>
        }>
          <Suspense fallback={
            <div className="p-3 bg-gray-100 animate-pulse">Loading header...</div>
          }>
            <LazyComponents.Header
              SetPage={(page, props = {}) => navigateTo(page, props)}
              togglePanel={togglePanel}
              openModal={openModal}
              ui={ui}
              unreadCounts={getUnreadCounts()}
              isLiveModalOpen={ui.modal?.name === MODAL_TYPES.LIVE_EVENTS}
              setIsLiveModalOpen={(open) => open ? openModal(MODAL_TYPES.LIVE_EVENTS) : closeModal()}
              isMessagesOpen={ui.openPanel === PANEL_TYPES.MESSAGES}
              setIsMessagesOpen={(open) => open ? togglePanel(PANEL_TYPES.MESSAGES) : null}
              isNotificationsOpen={ui.openPanel === PANEL_TYPES.NOTIFICATIONS}
              setIsNotificationsOpen={(open) => open ? togglePanel(PANEL_TYPES.NOTIFICATIONS) : null}
              isProfileOpen={ui.openPanel === PANEL_TYPES.PROFILE}
              setIsProfileOpen={(open) => open ? togglePanel(PANEL_TYPES.PROFILE) : dispatch({ type: "CLOSE_PANEL" })}
              notifications={getNotificationsList()}
              messages={getMessagesList()}
              currentUserId={inertiaProps.auth?.user?.id}
            />
          </Suspense>
        </ErrorBoundary>
      </header>

      {/* Left Navigation Sidebar */}
      <aside className="fixed top-[60px] left-0 hidden lg:flex flex-col h-[calc(100vh-60px)] w-64 border-r border-gray-200 bg-white z-40">
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary fallback={
            <div className="p-4 text-red-600 bg-red-50">Sidebar failed to load</div>
          }>
            <Suspense fallback={
              <div className="p-4 bg-gray-100 animate-pulse">Loading sidebar...</div>
            }>
              <LazyComponents.LeftSidebar
                categories={categories}
                selectedFilter={activePage.name}
                setSelectedFilter={(page) => navigateTo(page)}
                setPage={(page, props = {}) => navigateTo(page, props)}
                setActiveModal={setActiveModal}
                currentUserId={inertiaProps.auth?.user?.id}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </aside>

      {/* Right Content Sidebar */}
      {!activeModal && (
        <aside className="fixed top-[60px] right-0 hidden xl:flex flex-col h-[calc(100vh-60px)] w-72 border-l border-gray-200 bg-white z-40">
          <div className="flex-1 overflow-y-auto">
            <ErrorBoundary fallback={
              <div className="p-4 text-red-600 bg-red-50">Right sidebar failed to load</div>
            }>
              <Suspense fallback={
                <div className="p-4 bg-gray-100 animate-pulse">Loading right sidebar...</div>
              }>
                <LazyComponents.RightSidebar 
                  activePage={activePage.name} 
                  rightMenuOpen={rightMenuOpen} 
                  setRightMenuOpen={setRightMenuOpen} 
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="absolute top-[60px] bottom-0 left-0 right-0 lg:left-64 xl:right-72 overflow-y-auto bg-white">
        <div className="p-4 md:p-6 min-h-full">
          <ErrorBoundary fallback={
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Page failed to load</h3>
              <p className="text-red-600 mb-4">There was an error loading this page.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          }>
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            }>
              <ActiveComponent {...activePage.props} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Live Events Modal */}
      <AnimatePresence>
        {ui.modal?.name === MODAL_TYPES.LIVE_EVENTS && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1500] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch({ type: "CLOSE_MODAL" })}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-events-title"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <LiveEventsModal 
                events={MOCK_LIVE_EVENTS}
                onClose={() => dispatch({ type: "CLOSE_MODAL" })}
                closeRef={refs.liveClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <OverlayPanel 
        isOpen={ui.openPanel === PANEL_TYPES.NOTIFICATIONS} 
        onClose={() => dispatch({ type: "CLOSE_PANEL" })} 
        title="Notifications" 
        closeRef={refs.notificationsClose}
        ariaLabel="Notifications panel"
      >
        {renderNotificationsPanel()}
      </OverlayPanel>

      {/* Messages Panel */}
      <OverlayPanel 
        isOpen={ui.openPanel === PANEL_TYPES.MESSAGES} 
        onClose={() => dispatch({ type: "CLOSE_PANEL" })} 
        title="Messages" 
        closeRef={refs.messagesClose}
        ariaLabel="Messages panel"
      >
        {renderMessagesPanel()}
      </OverlayPanel>

      {/* Profile Panel */}
      <OverlayPanel 
        isOpen={ui.openPanel === PANEL_TYPES.PROFILE} 
        onClose={() => dispatch({ type: "CLOSE_PANEL" })} 
        title="Account" 
        closeRef={refs.profileClose} 
        className="w-64" 
        idSuffix="profile"
        ariaLabel="Account menu"
      >
        {renderProfilePanel()}
      </OverlayPanel>

      {/* Fullscreen Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {activeModal}
            </h2>
            <button 
              onClick={() => setActiveModal(null)} 
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
            >
              Back to Dashboard
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              }>
                {activeModal === "articles" && <LazyComponents.Articles />}
                {activeModal === "questions" && <LazyComponents.Question />}
                {activeModal === "discussions" && <LazyComponents.Discussion />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}