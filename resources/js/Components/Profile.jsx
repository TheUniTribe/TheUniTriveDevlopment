import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";

/**
 * @file Profile.jsx - Dynamic user profile component with user ID support
 * @description Feature-rich profile system that dynamically loads user data based on ID,
 * with tab navigation, social links, reputation tracking, and user interactions
 *
 * @module Profile
 * @version 4.0.0
 * @since 1.0.0
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

/**
 * Application constants and configuration
 * @namespace Constants
 */

/**
 * @constant {Object} DEFAULT_IMAGES - Default avatar images
 */
const DEFAULT_IMAGES = {
    AVATAR: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
    PLACEHOLDER: "https://i.pravatar.cc/72?img=1",
};

/**
 * @constant {Array} TAB_CONFIG - Profile tab configuration
 */
const TAB_CONFIG = [
    { key: "aboutus", label: "About" },
    { key: "experience", label: "Experience" },
    { key: "overview", label: "Overview" },
    { key: "discussions", label: "Discussions" },
    { key: "reputation", label: "Reputation" },
    { key: "activities", label: "Activities" },
    { key: "comments", label: "Comments" },
    { key: "connections", label: "Connections" },
];



// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Utility functions for common operations
 * @namespace Utils
 */

/**
 * CSS class name merger utility
 * @function cx
 * @param {...string} args - Class names to merge
 * @returns {string} Merged class names
 */
function cx(...args) {
    return args.filter(Boolean).join(" ");
}

/**
 * Simulate API call delay
 * @function simulateAPICall
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
const simulateAPICall = (delay = 500) => new Promise((resolve) => setTimeout(resolve, delay));

// =============================================================================
// MOCK DATABASE
// =============================================================================

/**
 * Mock database with multiple user profiles (Professional & Student)
 * @namespace MockDatabase
 */

/**
 * @constant {Object} MOCK_USERS_DB - Mock user database
 */
const MOCK_USERS_DB = {
    // Professional Profiles
    3: {
        id: 3,
        profileType: "professional",
        name: "John Doe",
        designation: "Senior Software Developer",
        company: "TechCorp",
        yearsExperience: 6,
        location: "New York, NY",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        department: "Engineering",
        roles: [
            { role: "Mentor", department: "Engineering", since: "2021-06-15", notes: "Frontend mentoring" },
            { role: "Frontend Specialist", department: "Engineering", since: "2019-09-01" },
        ],
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
        socialLinks: {
            linkedin: "https://linkedin.com/in/johndoe",
            github: "https://github.com/johndoe",
            twitter: "https://twitter.com/johndoe",
        },
        followers: 245,
        following: 128,
        connections: [2, 3, 4, 5],
        network: {
            followers: 245,
            following: 128,
            connections: [2, 3, 4, 5],
            followerBreakdown: {
                Engineering: 90,
                Design: 50,
                Product: 40,
                Other: 65,
            },
        },
        aboutContent: "Passionate software developer with 6 years of experience in React and Node.js. I enjoy open source and mentoring juniors.",
        experienceContent: "Senior Developer at TechCorp (2020-Present)\nFull Stack Developer at StartupInc (2018-2020)",
        reputation: {
            stats: [
                { label: "Posts", value: 45 },
                { label: "Likes", value: 120 },
                { label: "Comments", value: 78 },
                { label: "Followers", value: 245 },
            ],
            details: [
                { category: "Discussions", count: 15, last: "2 days ago" },
                { category: "Articles", count: 8, last: "1 week ago" },
                { category: "Comments", count: 30, last: "5 hours ago" },
            ],
        },
        discussions: [
            { title: "How to get started with React?", tag: "React", when: "3 hours ago", snippet: "Resources to get started..." },
            { title: "Best practices for API design", tag: "API", when: "1 day ago", snippet: "Key principles for designing APIs." },
        ],
        activities: [
            { icon: "📝", title: "Posted a new article", when: "1 hour ago" },
            { icon: "💬", title: "Commented on a discussion", when: "3 hours ago" },
        ],
        comments: [{ id: 1, name: "Jane Smith", when: "2 hours ago", text: "Great profile!", avatar: "https://i.pravatar.cc/72?img=2" }],
        badges: ["Mentor"],
    },
    2: {
        id: 2,
        profileType: "professional",
        name: "Sarah Wilson",
        designation: "UX Designer",
        company: "DesignStudio",
        yearsExperience: 7,
        location: "San Francisco, CA",
        email: "sarah.wilson@example.com",
        department: "Design",
        roles: [{ role: "Mentor", department: "Design", since: "2020-01-12" }],
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=480&auto=format&fit=crop",
        socialLinks: { linkedin: "https://linkedin.com/in/sarahwilson" },
        followers: 320,
        following: 210,
        connections: [1, 3],
        network: {
            followers: 320,
            following: 210,
            connections: [1, 3],
            followerBreakdown: {
                Design: 140,
                Engineering: 80,
                Product: 60,
                Other: 40,
            },
        },
        aboutContent: "Creative UX designer passionate about human-centered design and mentoring designers.",
        badges: ["mentee"],
    },

    // Student Profiles
    1: {
        id: 1,
        profileType: "student",
        name: "Alex Johnson",
        major: "Computer Science",
        university: "Stanford University",
        expectedGraduation: "May 2024",
        location: "Stanford, CA",
        email: "alex.johnson@stanford.edu",
        phone: "+1 (555) 987-6543",
        gpa: "3.8",
        academicLevel: "Junior",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=480&auto=format&fit=crop",
        socialLinks: {
            linkedin: "https://linkedin.com/in/alexjohnson",
            github: "https://github.com/alexjohnson",
            twitter: "https://twitter.com/alexjohnson",
        },
        followers: 156,
        following: 89,
        connections: [4, 5],
        network: {
            followers: 156,
            following: 89,
            connections: [4, 5],
            followerBreakdown: {
                "Computer Science": 80,
                Engineering: 45,
                Business: 20,
                Other: 11,
            },
        },
        aboutContent: "Passionate Computer Science student at Stanford University with interests in AI, machine learning, and software engineering. Actively seeking internships for Summer 2024.",
        experienceContent: "Software Engineering Intern at Google (Summer 2023)\nResearch Assistant - AI Lab (2022-Present)\nTeaching Assistant - Data Structures (Fall 2022)",
        reputation: {
            stats: [
                { label: "Posts", value: 23 },
                { label: "Likes", value: 89 },
                { label: "Comments", value: 45 },
                { label: "Followers", value: 156 },
            ],
            details: [
                { category: "Study Groups", count: 8, last: "1 day ago" },
                { category: "Projects", count: 12, last: "3 days ago" },
                { category: "Questions", count: 25, last: "2 hours ago" },
            ],
        },
        discussions: [
            { title: "Best resources for learning ML?", tag: "Machine Learning", when: "5 hours ago", snippet: "Looking for recommendations..." },
            { title: "Summer internship experiences", tag: "Career", when: "2 days ago", snippet: "Sharing my internship journey..." },
        ],
        activities: [
            { icon: "📚", title: "Joined Machine Learning Study Group", when: "2 hours ago" },
            { icon: "💼", title: "Applied for Summer Internship", when: "1 day ago" },
            { icon: "🏆", title: "Won Hackathon - AI Category", when: "3 days ago" },
        ],
        comments: [
            { id: 1, name: "Professor Smith", when: "1 day ago", text: "Excellent work on the research project!", avatar: "https://i.pravatar.cc/72?img=3" },
            { id: 2, name: "Emily Chen", when: "3 hours ago", text: "Great study tips!", avatar: "https://i.pravatar.cc/72?img=4" },
        ],
        badges: ["Mentor"],
        courses: ["Machine Learning", "Data Structures & Algorithms", "Computer Vision", "Database Systems", "Software Engineering"],
        skills: ["Python", "JavaScript", "React", "TensorFlow", "Java", "SQL"],
        projects: [
            { name: "AI Chatbot", description: "Built a conversational AI using TensorFlow", tech: ["Python", "TensorFlow", "NLP"] },
            { name: "Course Planner", description: "Web app for course scheduling", tech: ["React", "Node.js", "MongoDB"] },
        ],
    },
    4: {
        id: 4,
        profileType: "student",
        name: "Maria Garcia",
        major: "Business Administration",
        university: "Harvard University",
        expectedGraduation: "May 2025",
        location: "Cambridge, MA",
        email: "maria.garcia@harvard.edu",
        academicLevel: "Sophomore",
        gpa: "3.9",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=480&auto=format&fit=crop",
        socialLinks: {
            linkedin: "https://linkedin.com/in/mariagarcia",
            instagram: "https://instagram.com/mariagarcia",
        },
        followers: 210,
        following: 145,
        connections: [3, 5],
        network: {
            followers: 210,
            following: 145,
            connections: [3, 5],
            followerBreakdown: {
                Business: 120,
                Economics: 50,
                "Computer Science": 25,
                Other: 15,
            },
        },
        aboutContent: "Business Administration student at Harvard with focus on entrepreneurship and technology. President of Entrepreneurship Club and actively involved in startup competitions.",
        experienceContent: "Marketing Intern at TechStart (Summer 2023)\nPresident - Entrepreneurship Club (2023-Present)\nVolunteer - Local Business Incubator",
        badges: ["mentee"],
        courses: ["Financial Accounting", "Marketing Strategy", "Entrepreneurship", "Business Analytics", "Organizational Behavior"],
        skills: ["Marketing", "Financial Analysis", "Leadership", "Public Speaking", "Data Analysis"],
    },
};

// =============================================================================
// CUSTOM HOOKS (MOVED BEFORE COMPONENTS THAT USE THEM)
// =============================================================================

/**
 * Custom hooks for state management
 * @namespace Hooks
 */

/**
 * Profile management hook
 * @function useProfile
 * @param {number} userId - User ID to load profile for
 * @returns {Object} Profile state and methods
 */
function useProfile(userId) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].key);

    /**
     * Load user profile data
     */
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API call
                await simulateAPICall(800);

                const userData = MOCK_USERS_DB[userId];
                if (!userData) {
                    throw new Error(`User with ID ${userId} not found`);
                }

                setProfileData(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadProfile();
        }
    }, [userId]);

    /**
     * Add new comment to profile
     * @function addComment
     * @param {string} commentText - Comment content
     * @returns {Promise} Promise representing the API call
     */
    const addComment = async (commentText) => {
        await simulateAPICall(500);

        const newComment = {
            id: Date.now(), // Simple ID generation
            name: "You", // Since we don't have current user context
            when: "Just now",
            text: commentText,
            avatar: DEFAULT_IMAGES.PLACEHOLDER,
        };

        setProfileData((prev) => ({
            ...prev,
            comments: [newComment, ...prev.comments],
        }));
    };

    /**
     * Get connection user data
     * @function getConnectionData
     * @param {Array} connectionIds - Array of connection user IDs
     * @returns {Array} Array of connection user objects
     */
    const getConnectionData = (connectionIds = []) => {
        return connectionIds.map((id) => MOCK_USERS_DB[id]).filter(Boolean);
    };

    return {
        // State
        loading,
        error,
        profileData,
        activeTab,

        // Setters
        setActiveTab,

        // Methods
        addComment,
        getConnectionData,
    };
}

// =============================================================================
// ICONS COMPONENTS
// =============================================================================

/**
 * Beautiful SVG icons for social metrics
 * @namespace Icons
 */

/**
 * Followers icon component
 * @function FollowersIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Followers icon
 */
function FollowersIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
    );
}

/**
 * Following icon component
 * @function FollowingIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Following icon
 */
function FollowingIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * Connections icon component
 * @function ConnectionsIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Connections icon
 */
function ConnectionsIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/**
 * Email icon component
 * @function EmailIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Email icon
 */
function EmailIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
    );
}

/**
 * Star icon component for Top Contributor badge
 * @function StarIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Star icon
 */
function StarIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

/**
 * Verified icon component for Verified Mentor badge
 * @function VerifiedIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Verified icon
 */
function VerifiedIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * Graduation cap icon for student profiles
 * @function GraduationIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Graduation icon
 */
function GraduationIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
    );
}

/**
 * Book icon for courses
 * @function BookIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Book icon
 */
function BookIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
    );
}

/**
 * Trophy icon for achievements
 * @function TrophyIcon
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.Component} Trophy icon
 */
function TrophyIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.268a2 2 0 11-2 0V6a3 3 0 116 0v7a1 1 0 01-1 1h-1a1 1 0 100 2h1a3 3 0 001-.732V16a1 1 0 01-1 1h-3a1 1 0 100 2h3a3 3 0 003-3V6a5 5 0 00-10 0v8a5 5 0 0010 0V6a1 1 0 00-1-1h-1z"
                clipRule="evenodd"
            />
        </svg>
    );
}

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

/**
 * Tooltip component for displaying additional information
 * @function Tooltip
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tooltip trigger element
 * @param {string} props.content - Tooltip content
 * @param {string} props.position - Tooltip position (top, bottom, left, right)
 * @returns {React.Component} Tooltip component
 */
function Tooltip({ children, content, position = "top" }) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 150);
    };

    const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    return (
        <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            {isVisible && (
                <div className={cx("absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap", positionClasses[position])} role="tooltip">
                    {content}
                    <div
                        className={cx(
                            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
                            position === "top" && "top-full left-1/2 -translate-x-1/2 -mt-1",
                            position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-1",
                            position === "left" && "left-full top-1/2 -translate-y-1/2 -ml-1",
                            position === "right" && "right-full top-1/2 -translate-y-1/2 -mr-1"
                        )}
                    />
                </div>
            )}
        </div>
    );
}

// =============================================================================
// SOCIAL METRICS COMPONENTS (UPDATED WITH ICONS)
// =============================================================================

/**
 * Social metrics components with icons and tooltips
 * @namespace SocialMetrics
 */

/**
 * Followers metric component with icon and tooltip
 * @function FollowersMetric
 * @param {Object} props - Component props
 * @param {number} props.count - Number of followers
 * @param {Object} props.breakdown - Follower breakdown by department
 * @returns {React.Component} Followers metric
 */
function FollowersMetric({ count, breakdown }) {
    const tooltipContent = useMemo(() => {
        if (!breakdown) return `${count.toLocaleString()} followers`;

        const breakdownText = Object.entries(breakdown)
            .map(([dept, deptCount]) => `${dept}: ${deptCount}`)
            .join("\n");

        return `${count.toLocaleString()} followers\n\nBreakdown:\n${breakdownText}`;
    }, [count, breakdown]);

    return (
        <Tooltip content={tooltipContent} position="bottom">
            <div className="flex items-center gap-2 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-help group">
                <div className="p-2 rounded-lg bg-blue-500 text-white group-hover:bg-blue-600 transition-colors duration-200">
                    <FollowersIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-900">{count.toLocaleString()}</span>
                    <span className="text-xs text-blue-700 font-medium">Followers</span>
                </div>
            </div>
        </Tooltip>
    );
}

/**
 * Following metric component with icon and tooltip
 * @function FollowingMetric
 * @param {Object} props - Component props
 * @param {number} props.count - Number of people following
 * @returns {React.Component} Following metric
 */
function FollowingMetric({ count }) {
    return (
        <Tooltip content={`Following ${count.toLocaleString()} people`} position="bottom">
            <div className="flex items-center gap-2 rounded-xl hover:border-green-300 transition-all duration-200 cursor-help group">
                <div className="p-2 rounded-lg bg-green-500 text-white group-hover:bg-green-600 transition-colors duration-200">
                    <FollowingIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-green-900">{count.toLocaleString()}</span>
                    <span className="text-xs text-green-700 font-medium">Following</span>
                </div>
            </div>
        </Tooltip>
    );
}

/**
 * Connections metric component with icon and tooltip
 * @function ConnectionsMetric
 * @param {Object} props - Component props
 * @param {number} props.count - Number of connections
 * @param {Array} props.connections - Connection IDs
 * @returns {React.Component} Connections metric
 */
function ConnectionsMetric({ count, connections }) {
    const tooltipContent = connections?.length > 0 ? `${count} connections\nClick to view network` : `${count} connections`;

    return (
        <Tooltip content={tooltipContent} position="bottom">
            <div className="flex items-center gap-2 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-help group">
                <div className="p-2 rounded-lg bg-purple-500 text-white group-hover:bg-purple-600 transition-colors duration-200">
                    <ConnectionsIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-purple-900">{count}</span>
                    <span className="text-xs text-purple-700 font-medium">Connections</span>
                </div>
            </div>
        </Tooltip>
    );
}

/**
 * Social metrics grid component
 * @function SocialMetricsGrid
 * @param {Object} props - Component props
 * @param {Object} props.network - Network data
 * @returns {React.Component} Social metrics grid
 */
function SocialMetricsGrid({ network }) {
    return (
        <div className="grid grid-cols-3 gap-1">
            <FollowersMetric count={network.followers} breakdown={network.followerBreakdown} />
            <FollowingMetric count={network.following} />
            <ConnectionsMetric count={network.connections?.length || 0} connections={network.connections} />
        </div>
    );
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

/**
 * Reusable UI components
 * @namespace Components
 */

function SectionCard({ title, action, children, className }) {
    return (
        <section className={cx("rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {action}
            </div>
            <div>{children}</div>
        </section>
    );
}

/**
 * Fixed Tab Navigation - No horizontal scrolling
 * @function TabNav
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Tab configuration
 * @param {string} props.active - Active tab key
 * @param {Function} props.onChange - Tab change handler
 * @returns {React.Component} Tab navigation
 */
function TabNav({ tabs, active, onChange }) {
    return (
        <nav className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Profile sections">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    role="tab"
                    aria-selected={active === tab.key}
                    onClick={() => onChange(tab.key)}
                    className={cx(
                        "px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg border",
                        active === tab.key ? "text-gray-900 bg-white border-gray-300 shadow-sm" : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}

// =============================================================================
// STUDENT ACADEMIC COMPONENTS
// =============================================================================

/**
 * Student-specific academic information components
 * @namespace StudentAcademic
 */

function StudentCourses({ courses }) {
    if (!courses || courses.length === 0) return null;

    return (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <BookIcon className="w-4 h-4" />
                Current Courses
            </h4>
            <div className="flex flex-wrap gap-2">
                {courses.map((course, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                        {course}
                    </span>
                ))}
            </div>
        </div>
    );
}

function StudentSkills({ skills }) {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                <TrophyIcon className="w-4 h-4" />
                Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

function StudentAcademicInfo({ courses, skills }) {
    if ((!courses || courses.length === 0) && (!skills || skills.length === 0)) {
        return null;
    }

    return (
        <div className="space-y-4">
            <StudentCourses courses={courses} />
            <StudentSkills skills={skills} />
        </div>
    );
}

function SocialLinks({ links, email, phone }) {
    // Social media icons mapping
    const socialIcons = {
        linkedin: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        github: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
        twitter: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
        ),
        facebook: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        instagram: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.816 3.73 13.665 3.73 12.368s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297zm8.062-1.405c0 .634-.512 1.146-1.146 1.146s-1.146-.512-1.146-1.146.512-1.146 1.146-1.146 1.146.512 1.146 1.146zm2.323-4.323c-.634 0-1.146-.512-1.146-1.146s.512-1.146 1.146-1.146 1.146.512 1.146 1.146-.512 1.146-1.146 1.146z" />
            </svg>
        ),
        youtube: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        dribbble: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.253-8.89c-.563-1.179-1.359-2.228-2.343-3.084.537-.938.968-1.927 1.281-2.962 1.753.646 3.11 2.057 3.745 3.823-.027.15-.041.304-.041.46 0 1.349-.516 2.58-1.364 3.518l-.278-.755zm-6.799-2.93c-.104-.021-.208-.041-.313-.058.104.021.208.041.313.058zm-1.646-.345c-.146.021-.292.041-.438.058.146-.021.292-.041.438-.058zM12.75 4.125c-.104 0-.208.006-.313.012.104-.006.208-.012.313-.012zm-1.5.033c-.146.009-.292.02-.438.033.146-.013.292-.024.438-.033zM7.5 5.25c-.104.021-.208.045-.313.07.104-.025.208-.049.313-.07zm9.75 12.375c1.349 0 2.443-1.094 2.443-2.443 0-.156-.014-.31-.041-.46-1.179.563-2.228 1.359-3.084 2.343.938.537 1.927.968 2.962 1.281l-.755.278c-.938.848-2.169 1.364-3.518 1.364.646-1.753 2.057-3.11 3.823-3.745l.46.041zM4.125 12.75c0-.104.006-.208.012-.313-.006.104-.012.208-.012.313zm.033-1.5c.009-.146.02-.292.033-.438-.013.146-.024.292-.033.438zM5.25 7.5c.021-.104.045-.208.07-.313-.025.104-.049.208-.07.313zm12.375-4.125c-1.349 0-2.443 1.094-2.443 2.443 0 .156.014.31.041.46 1.179-.563 2.228-1.359 3.084-2.343-.938-.537-1.927-.968-2.962-1.281l.755-.278c.938-.848 2.169-1.364 3.518-1.364-.646 1.753-2.057 3.11-3.823 3.745l-.46-.041z" />
            </svg>
        ),
        behance: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.012h6.466v1.973H2.258v3.75h3.892v1.953H2.258v3.836h4.208v1.464z" />
            </svg>
        ),
        email: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
        ),
        phone: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
        ),
    };

    // Default icon for unknown platforms
    const defaultIcon = (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V9h2v8z" />
        </svg>
    );
    const hasSocialLinks = Object.keys(links).length > 0;
    const hasContactInfo = email || phone;
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Social Media Links */}
            {hasSocialLinks && (
                <>
                    {Object.entries(links).map(([platform, url]) => (
                        <Tooltip key={platform} content={platform} position="bottom">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 font-medium"
                            >
                                {socialIcons[platform.toLowerCase()] || defaultIcon}
                            </a>
                        </Tooltip>
                    ))}
                </>
            )}

            {/* Visual separator if both social links and contact info exist */}
            {hasSocialLinks && hasContactInfo && <div className="w-px h-6 bg-gray-300 mx-1"></div>}

            {/* Contact Information */}
            {hasContactInfo && (
                <>
                    {email && (
                        <Tooltip content={`Email: ${email}`} position="bottom">
                            <a href={`mailto:${email}`} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 transition-all duration-200 font-medium">
                                {socialIcons.email}
                            </a>
                        </Tooltip>
                    )}
                    {phone && (
                        <Tooltip content={`Call: ${phone}`} position="bottom">
                            <a href={`tel:${phone}`} className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition-all duration-200 font-medium">
                                {socialIcons.phone}
                            </a>
                        </Tooltip>
                    )}
                </>
            )}
        </div>
    );
}

function Discussions({ items }) {
    return (
        <ul className="space-y-4">
            {items.map((item, index) => (
                <li key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm md:text-base break-words flex-1 min-w-0 text-gray-900">{item.title}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-medium shrink-0">{item.tag}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
                    <p className="text-sm text-gray-600 mt-2 break-words">{item.snippet}</p>
                </li>
            ))}
        </ul>
    );
}

function Reputation({ stats, details }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {details && details.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                    <h4 className="text-sm font-semibold mb-4 text-gray-900">Detailed Breakdown</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-gray-600">
                                    <th className="py-2.5 px-4 font-medium">Category</th>
                                    <th className="py-2.5 px-4 font-medium">Count</th>
                                    <th className="py-2.5 px-4 font-medium">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((detail, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors duration-200">
                                        <td className="py-2.5 px-4 font-medium text-gray-900">{detail.category}</td>
                                        <td className="py-2.5 px-4 font-medium text-gray-900">{detail.count}</td>
                                        <td className="py-2.5 px-4 text-gray-500">{detail.last}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function Activities({ items }) {
    return (
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer">
                    <div className="flex items-start gap-3">
                        <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-gray-900 break-words">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function CommentForm({ onSubmit }) {
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        await onSubmit(comment);
        setComment("");
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add a Comment</h4>
            <div className="mb-3">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200 resize-none"
                    disabled={isSubmitting}
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !comment.trim()}
                    className={cx("rounded-lg px-4 py-2.5 text-sm text-white font-medium transition-colors duration-200", isSubmitting || !comment.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800")}
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </form>
    );
}

function Comments({ items, onAddComment }) {
    return (
        <div>
            <CommentForm onSubmit={onAddComment} />

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    items.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <img src={comment.avatar} alt={`${comment.name}'s avatar`} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{comment.name}</p>
                                    <span className="text-xs text-gray-500">{comment.when}</span>
                                </div>
                                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function ContentDisplay({ content }) {
    return <div className="text-sm text-gray-700 whitespace-pre-wrap">{content}</div>;
}

/**
 * Enhanced ConnectionCard for both professional and student profiles
 * @function ConnectionCard
 * @param {Object} props - Component props
 * @param {Object} props.connection - Connection user data
 * @returns {React.Component} Connection card
 */
function ConnectionCard({ connection }) {
    const isStudent = connection?.profileType === "student";

    return (
        <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
            <div className="relative mb-3">
                <img src={connection.avatar} alt={`${connection.name}'s avatar`} className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate w-full">{connection.name}</h4>

            <p className="text-xs text-gray-600 mb-2 truncate w-full">{isStudent ? `${connection.major} • ${connection.university}` : connection.designation}</p>

            <div className="flex flex-wrap gap-1 justify-center mb-3">
                {connection.roles?.slice(0, 2).map((role, index) => (
                    <span key={index} className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-md">
                        {role.role}
                    </span>
                ))}
                {isStudent && connection.academicLevel && <span className="inline-block px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-md">{connection.academicLevel}</span>}
            </div>

            <div className="flex gap-2 w-full">
                <button className="flex-1 py-1.5 px-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">Message</button>
                <button className="flex-1 py-1.5 px-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">View</button>
            </div>
        </div>
    );
}

/**
 * Connections component
 * @function Connections
 * @param {Object} props - Component props
 * @param {Array} props.connections - Array of connection user objects
 * @returns {React.Component} Connections grid
 */
function Connections({ connections }) {
    if (!connections || connections.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connections Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">Start connecting with other people to build your network and discover new opportunities.</p>
                <button className="mt-4 rounded-lg px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium">Find Connections</button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {connections.length} Connection{connections.length !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">People in your network</p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">Sort by: Recent</button>
                    <button className="rounded-lg px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">+ Add Connection</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {connections.map((connection) => (
                    <ConnectionCard key={connection.id} connection={connection} />
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="rounded-lg px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">Load More Connections</button>
            </div>
        </div>
    );
}

// =============================================================================
// LOADING AND ERROR COMPONENTS
// =============================================================================

/**
 * Loading spinner component
 * @function LoadingSpinner
 * @returns {React.Component} Loading spinner
 */
function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        </div>
    );
}

/**
 * Error display component
 * @function ErrorDisplay
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry handler
 * @returns {React.Component} Error display
 */
function ErrorDisplay({ message, onRetry }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button onClick={onRetry} className="rounded-lg px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium">
                    Try Again
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// MAIN PROFILE COMPONENT
// =============================================================================

/**
 * Main Profile Component
 * @function Profile
 * @param {Object} props - Component props
 * @param {number} props.userId - User ID to display profile for
 * @returns {React.Component} Complete profile page
 */
export default function Profile({ userId }) {
    const { loading, error, profileData, activeTab, setActiveTab, addComment, getConnectionData } = useProfile(userId);

    // Get connections data
    const connections = useMemo(() => {
        if (!profileData?.connections) return [];
        return getConnectionData(profileData.connections);
    }, [profileData, getConnectionData]);

    // Show loading state
    if (loading) {
        return <LoadingSpinner />;
    }

    // Show error state
    if (error || !profileData) {
        return <ErrorDisplay message={error || "User not found"} onRetry={() => window.location.reload()} />;
    }

    const isStudent = profileData.profileType === "student";

    /**
     * Render overview section with multiple cards
     * @function renderOverview
     * @returns {React.Component} Overview section JSX
     */
    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title={isStudent ? "Study Discussions" : "Latest & Popular Discussions"}>
                <Discussions items={profileData.discussions} />
            </SectionCard>

            <SectionCard title="Reputation">
                <Reputation stats={profileData.reputation.stats} details={profileData.reputation.details} />
            </SectionCard>

            <SectionCard title="Activities">
                <Activities items={profileData.activities} />
            </SectionCard>

            {/* Student-specific: Projects */}
            {isStudent && profileData.projects && (
                <SectionCard title="Recent Projects">
                    <div className="space-y-4">
                        {profileData.projects.map((project, index) => (
                            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                                <h4 className="font-semibold text-gray-900 text-sm mb-2">{project.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {project.tech.map((tech, techIndex) => (
                                        <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            <SectionCard title="Comments from Users">
                <div className="space-y-4">
                    {profileData.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <img src={comment.avatar} alt={`${comment.name}'s avatar`} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{comment.name}</p>
                                    <span className="text-xs text-gray-500">{comment.when}</span>
                                </div>
                                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {profileData.comments.length > 2 && (
                        <div className="text-center pt-2">
                            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200" onClick={() => setActiveTab("comments")}>
                                View all comments ({profileData.comments.length})
                            </button>
                        </div>
                    )}
                </div>
            </SectionCard>
        </div>
    );

    return (
        <div className="h-full bg-gray-50 text-gray-900">
            <main className="max-w-6xl mx-auto px-4 py-6 grid gap-4">
                {/* Profile Header Section with Avatar */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Outer grid: 2 rows */}
                    <div className="grid grid-rows-[auto_auto] gap-6">
                        {/* === Row 1: Avatar + Info === */}
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                            {/* Avatar Section */}
                            <div className="relative w-32 h-32 mx-auto md:mx-0">
                                <img src={profileData.avatar} alt="User avatar" className="w-full h-full rounded-xl object-cover border-2 border-gray-100 shadow-sm" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                                    {/* Left - Name, title, details */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900 truncate">{profileData.name}</h2>
                                            <span className={cx("px-2.5 py-1 text-xs font-medium rounded-full border", isStudent ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-purple-100 text-purple-800 border-purple-200")}>
                                                {isStudent ? "Student" : "Professional"}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 font-medium truncate">{isStudent ? `${profileData.major} • ${profileData.university}` : `${profileData.designation} at ${profileData.company}`}</p>

                                        <p className="text-sm text-gray-500 mt-1 truncate">
                                            {isStudent ? `${profileData.location} • Graduating ${profileData.expectedGraduation}` : `${profileData.yearsExperience} years experience • ${profileData.location}`}
                                        </p>
                                    </div>

                                    {/* Right - Badges */}
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-2 flex-wrap justify-end">
                                            {profileData.badges.map((badge, index) => (
                                                <Tooltip key={index} content={badge} position="bottom">
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md font-medium border border-yellow-200 whitespace-nowrap">
                                                        {badge === "Top Contributor" && <StarIcon className="w-3.5 h-3.5" />}
                                                        {badge === "Verified Mentor" && <VerifiedIcon className="w-3.5 h-3.5" />}
                                                        {badge.includes("Dean") && <TrophyIcon className="w-3.5 h-3.5" />}
                                                        {badge.includes("Hackathon") && <TrophyIcon className="w-3.5 h-3.5" />}
                                                        {!badge.includes("Top Contributor") && !badge.includes("Verified Mentor") && !badge.includes("Dean") && !badge.includes("Hackathon") && <StarIcon className="w-3.5 h-3.5" />}
                                                    </span>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Social Metrics */}
                                <SocialMetricsGrid network={profileData.network} />
                            </div>
                        </div>

                        {/* === Row 2: Social Links + Contact === */}
                        <div className="border-t border-gray-100 pt-4">
                            <SocialLinks links={profileData.socialLinks} email={profileData.email} phone={profileData.phone} />
                        </div>
                    </div>

                    {/* Additional Info below */}
                    <div className="mt-6">
                        <StudentAcademicInfo courses={profileData.courses} skills={profileData.skills} />
                    </div>
                </div>

                {/* Fixed Tab Navigation */}
                <TabNav tabs={TAB_CONFIG} active={activeTab} onChange={setActiveTab} />

                {/* Tab Content */}
                {activeTab === "aboutus" && (
                    <SectionCard title="About">
                        <ContentDisplay content={profileData.aboutContent} />
                    </SectionCard>
                )}

                {activeTab === "experience" && (
                    <SectionCard title={isStudent ? "Experience & Activities" : "Experience"}>
                        <ContentDisplay content={profileData.experienceContent} />
                    </SectionCard>
                )}

                {activeTab === "overview" && renderOverview()}

                {activeTab === "discussions" && (
                    <SectionCard title={isStudent ? "Study Discussions" : "Discussions"}>
                        <Discussions items={profileData.discussions} />
                    </SectionCard>
                )}

                {activeTab === "reputation" && (
                    <SectionCard title="Reputation">
                        <Reputation stats={profileData.reputation.stats} details={profileData.reputation.details} />
                    </SectionCard>
                )}

                {activeTab === "activities" && (
                    <SectionCard title="Activities">
                        <Activities items={profileData.activities} />
                    </SectionCard>
                )}

                {activeTab === "comments" && (
                    <SectionCard title="Comments from Users">
                        <Comments items={profileData.comments} onAddComment={addComment} />
                    </SectionCard>
                )}

                {activeTab === "connections" && (
                    <SectionCard title={isStudent ? "Study Network" : "Professional Network"}>
                        <Connections connections={connections} />
                    </SectionCard>
                )}
            </main>
        </div>
    );
}
