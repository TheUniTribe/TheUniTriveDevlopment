import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import profileService from "../services/profileService";

/**
 * @file Profile.jsx - Dynamic user profile component with user ID support
 * @description Feature-rich profile system that dynamically loads user data based on ID,
 * with tab navigation, social links, reputation tracking, user interactions and editable profile
 *
 * @module Profile
 * @version 4.1.1
 * @since 1.0.0
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DEFAULT_IMAGES = {
  AVATAR:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
  PLACEHOLDER: "https://i.pravatar.cc/72?img=1",
};

const TAB_CONFIG = [
  { key: "aboutus", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "overview", label: "Overview" },
  { key: "discussions", label: "Discussions" },
  { key: "reputation", label: "Reputation" },
  { key: "activities", label: "Activities" },
  { key: "comments", label: "Comments" },
];

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

const simulateAPICall = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

// =============================================================================
// REUSABLE MODAL COMPONENTS
// =============================================================================

// Modal Overlay Component
function ModalOverlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

// Modal Container Component
function ModalContainer({ title, children, onClose, size = "xl" }) {
  const sizes = {
    md: "max-w-2xl",
    lg: "max-w-3xl", 
    xl: "max-w-4xl",
    "2xl": "max-w-6xl"
  };

  return (
    <div className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto relative z-10`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ label, value, onChange, type = "text", required = false, placeholder, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
        {...props}
      />
    </div>
  );
}

// Add Button Component
function AddButton({ onClick, children, icon = "plus" }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {children}
    </button>
  );
}

// Remove Button Component  
function RemoveButton({ onClick }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded"
      aria-label="Remove"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

// Empty State Component
function EmptyState({ icon, title, actionLabel, onAction }) {
  const icons = {
    experience: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    education: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
      </svg>
    ),
    social: (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  };

  return (
    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      {icons[icon] && <div className="w-12 h-12 mx-auto text-gray-400 mb-4">{icons[icon]}</div>}
      <p className="text-lg font-medium text-gray-600 mb-2">{title}</p>
      <button 
        type="button"
        onClick={onAction}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Modal Actions Component
function ModalActions({ onCancel, onSubmit, saving, submitLabel = "Save Changes" }) {
  return (
    <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
      <button 
        type="button" 
        onClick={onCancel} 
        disabled={saving}
        className="rounded-lg px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={saving}
        className={cx(
          "rounded-lg px-6 py-2 bg-blue-600 text-white font-medium transition-colors duration-200", 
          saving ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
        )}
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

// Section Title Component
function ModalSectionTitle({ children }) {
  return (
    <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
  );
}

// =============================================================================
// STATUS & BADGE COMPONENTS
// =============================================================================

function ActiveStatusIndicator({ lastActive, isActive, className = "w-6 h-6" }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (lastActive) => {
    if (!lastActive) return "Unknown";
    
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((currentTime - lastActiveDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusColor = () => {
    if (!lastActive) return "bg-gray-400";
    
    const lastActiveDate = new Date(lastActive);
    const diffInMinutes = Math.floor((currentTime - lastActiveDate) / (1000 * 60));
    
    if (diffInMinutes < 5) return "bg-green-500";
    if (diffInMinutes < 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const tooltipContent = lastActive 
    ? `Active ${getTimeAgo(lastActive)}`
    : 'Active status unknown';

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div className={`relative ${className}`}>
        <div className={`w-full h-full rounded-full border-2 border-white ${getStatusColor()} flex items-center justify-center`}>
          <div className="w-1/2 h-1/2 bg-white rounded-full opacity-80"></div>
        </div>
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-white animate-ping"></div>
        )}
      </div>
    </Tooltip>
  );
}

function VerificationBadge({ isVerified, size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  if (!isVerified) return null;

  return (
    <Tooltip content="Verified & Trustworthy" position="bottom">
      <div className={`${sizes[size]} text-blue-500 flex items-center justify-center`}>
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </Tooltip>
  );
}

function AccountTypeBadge({ accountType, size = "sm" }) {
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const getBadgeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'premium':
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border border-yellow-300 shadow-sm";
      case 'pro':
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-300 shadow-sm";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  if (!accountType || accountType.toLowerCase() === 'basic') return null;

  return (
    <Tooltip content={`${accountType} Account`} position="bottom">
      <span className={cx(
        "rounded-full font-medium whitespace-nowrap",
        sizes[size],
        getBadgeStyles(accountType)
      )}>
        {accountType}
      </span>
    </Tooltip>
  );
}

// Add Mentor/Mentee Badges Component
function MentorMenteeBadges({ isMentor = false, isMentee = false, size = "sm" }) {
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  if (!isMentor && !isMentee) return null;

  return (
    <div className="flex gap-2">
      {isMentor && (
        <span className={cx(
          "rounded-full font-medium whitespace-nowrap bg-purple-100 text-purple-800 border border-purple-200",
          sizes[size]
        )}>
          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Mentor
        </span>
      )}
      {isMentee && (
        <span className={cx(
          "rounded-full font-medium whitespace-nowrap bg-green-100 text-green-800 border border-green-200",
          sizes[size]
        )}>
          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          Mentee
        </span>
      )}
    </div>
  );
}

function WebsiteLink({ url, size = "sm" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  if (!url) return null;

  const displayUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

  return (
    <Tooltip content={`Visit website: ${url}`} position="bottom">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all duration-200 group"
      >
        <svg className={`${sizes[size]} text-blue-600`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.416 13.974 6.122 12.55 6.033 11H4.083a6.004 6.004 0 002.783 4.118z" />
        </svg>
        <span className="text-sm font-medium truncate max-w-32">{displayUrl}</span>
      </a>
    </Tooltip>
  );
}

// Updated ProfileCompletion Component without Tooltip
function ProfileCompletion({ completeness = 0, onImprove }) {
  const getProgressColor = (percent) => {
    if (percent >= 90) return "bg-green-500";
    if (percent >= 70) return "bg-blue-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressText = (percent) => {
    if (percent >= 90) return "Excellent!";
    if (percent >= 70) return "Good";
    if (percent >= 50) return "Average";
    return "Needs improvement";
  };

  return (
    <button 
      onClick={onImprove}
      className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-all duration-200 cursor-pointer w-full text-left group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">Profile Strength</span>
        <span className="text-xs font-semibold text-gray-600">{completeness}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(completeness)}`}
          style={{ width: `${completeness}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{getProgressText(completeness)}</span>
        {completeness < 100 && (
          <svg 
            className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </button>
  );
}

function AccountCreationDate({ createdAt, className = "" }) {
  const formatJoinDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${diffMonths} months ago`;
    return `${diffYears} years ago`;
  };

  const getFullDate = (dateString) => {
    if (!dateString) return "Unknown join date";
    
    const joinDate = new Date(dateString);
    return `Joined ${joinDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
  };

  if (!createdAt) return null;

  return (
    <Tooltip content={getFullDate(createdAt)} position="bottom">
      <div className={cx("flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-help", className)}>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <span>Joined {formatJoinDate(createdAt)}</span>
      </div>
    </Tooltip>
  );
}

// =============================================================================
// ERROR DISPLAY COMPONENT
// =============================================================================

function ErrorAlert({ message, onClose, type = "error" }) {
  if (!message) return null;

  const bgColor = type === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200";
  const textColor = type === "error" ? "text-red-800" : "text-green-800";
  const iconColor = type === "error" ? "text-red-400" : "text-green-400";

  return (
    <div className={`rounded-lg border p-4 mb-4 ${bgColor}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === "error" ? (
            <svg className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L6.53 10.47a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.154-.114l4-5.5z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${type === "error" ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-500 hover:bg-green-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TOOLTIP COMPONENT
// =============================================================================

function Tooltip({ children, content, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 150);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cx(
            "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap",
            positionClasses[position]
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cx(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              position === "top" &&
                "top-full left-1/2 -translate-x-1/2 -mt-1",
              position === "bottom" &&
                "bottom-full left-1/2 -translate-x-1/2 -mb-1",
              position === "left" &&
                "left-full top-1/2 -translate-y-1/2 -ml-1",
              position === "right" &&
                "right-full top-1/2 -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// NETWORK MODALS
// =============================================================================

function FollowersModal({ isOpen, onClose, followers = [], followerBreakdown = {} }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContainer title="Followers" onClose={onClose} size="lg">
        <div className="space-y-4">
          {Object.keys(followerBreakdown).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Followers Breakdown</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(followerBreakdown).map(([dept, count]) => (
                  <div key={dept} className="flex justify-between text-sm">
                    <span className="text-gray-600">{dept}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {followers.length > 0 ? (
            <div className="space-y-3">
              {followers.map((follower, index) => (
                <div key={follower.id || index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <img 
                    src={follower.avatar || DEFAULT_IMAGES.PLACEHOLDER} 
                    alt={follower.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{follower.name}</h5>
                    <p className="text-sm text-gray-600">{follower.title || 'User'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p>No followers yet</p>
            </div>
          )}
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
}

function FollowingModal({ isOpen, onClose, following = [] }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContainer title="Following" onClose={onClose} size="lg">
        {following.length > 0 ? (
          <div className="space-y-3">
            {following.map((user, index) => (
              <div key={user.id || index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <img 
                  src={user.avatar || DEFAULT_IMAGES.PLACEHOLDER} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{user.name}</h5>
                  <p className="text-sm text-gray-600">{user.title || 'User'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p>Not following anyone yet</p>
          </div>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
}

function GroupsModal({ isOpen, onClose, groups = [] }) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContainer title="Groups & Connections" onClose={onClose} size="lg">
        {groups.length > 0 ? (
          <div className="space-y-3">
            {groups.map((group, index) => (
              <div key={group.id || index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{group.name}</h5>
                  <p className="text-sm text-gray-600">{group.memberCount || 0} members</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Not part of any groups yet</p>
          </div>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
}

// =============================================================================
// EDIT ABOUT MODAL - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

function EditAboutModal({ isOpen, onClose, initial = {}, onSave, saving, error, onClearError }) {
  const [about, setAbout] = useState(initial.about || "");
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        [{ align: [] }],
        ["link", "image", "clean"]
      ],
      handlers: {
        image: function imageHandler() {
          const quill = quillRef.current && quillRef.current.getEditor && quillRef.current.getEditor();
          const url = prompt("Enter image URL:");
          if (url && quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, "image", url, "user");
            quill.setSelection(range.index + 1);
          }
        }
      }
    },
    clipboard: { matchVisual: false },
  }), []);

  const formats = useMemo(() => [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet", "indent",
    "blockquote", "code-block",
    "align",
    "link", "image"
  ], []);

  useEffect(() => {
    if (isOpen) {
      setAbout(initial.about || "");
      onClearError?.();

      setTimeout(() => {
        const editor = quillRef.current && quillRef.current.getEditor && quillRef.current.getEditor();
        if (editor && typeof editor.focus === "function") {
          editor.focus();
        }
      }, 80);
    }
  }, [isOpen, initial, onClearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ about });
  };

  const handleClose = () => {
    onClearError?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={handleClose}>
      <ModalContainer title="Edit About Section" onClose={handleClose} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert message={error} />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <div className="mb-2">
              <ReactQuill
                ref={quillRef}
                value={about}
                onChange={setAbout}
                modules={modules}
                formats={formats}
                theme="snow"
                placeholder="Tell us about yourself..."
                readOnly={false}
                tabIndex={0}
                style={{ minHeight: 160 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use the editor to add headings, formatting, lists, links or images. The content is saved as HTML.
            </p>
          </div>

          <ModalActions 
            onCancel={handleClose}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Save Changes"
          />
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

// =============================================================================
// EDIT PERSONAL INFO MODAL - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

function EditPersonalInfoModal({
  isOpen,
  onClose,
  initial = {},
  onSave,
  saving,
  error,
  onClearError,
}) {
 const [form, setForm] = useState({
    username: initial?.username ?? "",
    email: initial?.email ?? "",
    first_name: initial?.first_name ?? "",
    last_name: initial?.last_name ?? "",
    title: initial?.title ?? "",
    location: initial?.location ?? "",
    phone: initial?.phone ?? "",
    date_of_birth: initial?.date_of_birth ?? "",
    gender: initial?.gender ?? "",
    bio: initial?.bio ?? "",
    website_url: initial?.website_url ?? "",
    about: initial?.about ?? "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initial?.profile_pic ?? "");

  useEffect(() => {
    if (isOpen) {
      // Helper function to extract date part from ISO string
      const extractDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
      };

      setForm({
        username: initial?.username ?? "",
        email: initial?.email ?? "",
        first_name: initial?.first_name ?? "",
        last_name: initial?.last_name ?? "",
        title: initial?.title ?? "",
        location: initial?.location ?? "",
        phone: initial?.phone ?? "",
        date_of_birth: extractDate(initial?.date_of_birth),
        gender: initial?.gender ?? "",
        bio: initial?.bio ?? "",
        website_url: initial?.website_url ?? "",
        about: initial?.about ?? "",
      });
      setSelectedFile(null);
      setPreviewUrl(initial?.profile_pic ?? "");
      onClearError?.();
    }
  }, [isOpen, initial, onClearError]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const removeSelectedImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(initial.profile_pic || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    Object.keys(form).forEach(key => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });
    
    if (selectedFile) {
      formData.append('profile_pic', selectedFile);
      if (selectedFile.name) {
        formData.append('profile_pic_name', selectedFile.name);
      }
    }

    onSave(formData);
  };

  const handleClose = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onClearError?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={handleClose}>
      <ModalContainer title="Edit Personal Information" onClose={handleClose} size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-pic-upload"
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="cursor-pointer rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Upload
                </label>
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="rounded-lg px-3 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {selectedFile 
                  ? `Selected: ${selectedFile.name}` 
                  : "JPEG, PNG, GIF, WebP up to 2MB"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Username"
                value={form.username}
                onChange={(value) => setForm(prev => ({ ...prev, username: value }))}
                placeholder="username"
              />

              <FormField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => setForm(prev => ({ ...prev, email: value }))}
                placeholder="email@example.com"
              />

              <FormField
                label="First Name"
                value={form.first_name}
                onChange={(value) => setForm(prev => ({ ...prev, first_name: value }))}
                placeholder="First name"
              />

              <FormField
                label="Last Name"
                value={form.last_name}
                onChange={(value) => setForm(prev => ({ ...prev, last_name: value }))}
                placeholder="Last name"
              />

              <div className="md:col-span-2">
                <FormField
                  label="Title"
                  value={form.title}
                  onChange={(value) => setForm(prev => ({ ...prev, title: value }))}
                  placeholder="e.g. Software Engineer, Designer, Manager"
                />
              </div>

              <FormField
                label="Location"
                value={form.location}
                onChange={(value) => setForm(prev => ({ ...prev, location: value }))}
                placeholder="City, Country"
              />

              <FormField
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(value) => setForm(prev => ({ ...prev, phone: value }))}
                placeholder="+1 555 555 5555"
              />

              <FormField
                type="date"
                label="Date of Birth"
                value={form.date_of_birth}
                onChange={(value) => setForm(prev => ({ ...prev, date_of_birth: value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 bg-white"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <FormField
                  label="Website"
                  type="url"
                  value={form.website_url}
                  onChange={(value) => setForm(prev => ({ ...prev, website_url: value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  placeholder="Short bio..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <ModalActions 
            onCancel={handleClose}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Save Changes"
          />
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

// =============================================================================
// EXPERIENCE AND EDUCATION COMPONENTS - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

function ExperiencesList({ experiences = [], onEdit, onEditItem, onDeleteItem }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  const validExperiences = (experiences || []).filter(exp => 
    exp && ( exp.company)
  );
  if (validExperiences.length === 0) {
    return (
      <EmptyState 
        icon="experience"
        title="No Experience Added"
        actionLabel="Add your first experience"
        onAction={onEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      {validExperiences.map((exp, index) => (
        <div key={exp.id || index} className="border-l-4 border-blue-500 pl-6 py-2 relative group hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <div className="absolute -left-2 top-4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            <button
              onClick={() => onEditItem(exp)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              aria-label="Edit experience"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteItem(exp.id || index)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              aria-label="Delete experience"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-start mb-2 pr-16">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{exp.title || 'Untitled Position'}</h4>
              <p className="text-gray-700 font-medium">{exp.company || 'No company specified'}</p>
              {exp.location && (
                <p className="text-gray-600 text-sm">{exp.location}</p>
              )}
            </div>
            
            <div className="text-right text-sm text-gray-600">
              <div>
                {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
              </div>
              {exp.start_date && (
                <div className="text-gray-500">
                  {getDuration(exp.start_date, exp.end_date, exp.current)}
                </div>
              )}
            </div>
          </div>

          {exp.description && (
            <div 
              className="text-sm text-gray-700 mt-3 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: exp.description }}
            />
          )}

          {exp.current && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Current Position
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationsList({ educations = [], onEdit, onEditItem, onDeleteItem }) {
  const formatYear = (yearString) => {
    if (!yearString) return '';
    const year = new Date(yearString).getFullYear() || yearString;
    return isNaN(year) ? yearString : year;
  };

  const validEducations = (educations || []).filter(edu => 
    edu && (edu.institution || edu.degree)
  );

  if (validEducations.length === 0) {
    return (
      <EmptyState 
        icon="education"
        title="No Education Added"
        actionLabel="Add your first education"
        onAction={onEdit}
      />
    );
  }

  return (
    <div className="space-y-6">
      {validEducations.map((edu, index) => (
        <div key={edu.id || index} className="border-l-4 border-green-500 pl-6 py-2 relative group hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <div className="absolute -left-2 top-4 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
            <button
              onClick={() => onEditItem(edu)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              aria-label="Edit education"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteItem(edu.id || index)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              aria-label="Delete education"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-between items-start mb-2 pr-16">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{edu.institution || 'Educational Institution'}</h4>
              <p className="text-gray-700 font-medium">{edu.degree || 'No degree specified'}</p>
              {edu.specialization && (
                <p className="text-gray-600 text-sm">{edu.specialization}</p>
              )}
              {edu.field_of_study && !edu.specialization && (
                <p className="text-gray-600 text-sm">{edu.field_of_study}</p>
              )}
            </div>
            
            <div className="text-right text-sm text-gray-600">
              <div>
                {formatYear(edu.start_date)} - {edu.end_date ? formatYear(edu.end_date) : 'Present'}
              </div>
              {edu.start_date && edu.end_date && (
                <div className="text-gray-500">
                  {parseInt(formatYear(edu.end_date)) - parseInt(formatYear(edu.start_date))} years
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// INDIVIDUAL ENTRY MODALS FOR EXPERIENCE AND EDUCATION
// =============================================================================

function EditSingleExperienceModal({ 
  isOpen, 
  onClose, 
  experience = {}, 
  onSave, 
  saving, 
  error, 
  onClearError,
  mode = 'add'
}) {
  const [form, setForm] = useState({
    title: experience?.title ?? "",
    company: experience?.company ?? "",
    location: experience?.location ?? "",
    start_date: experience?.start_date ?? "",
    end_date: experience?.end_date ?? "",
    description: experience?.description ?? "",
    current: experience?.current ?? false
  });

useEffect(() => {
  if (isOpen) {
    // Helper function to extract date part from ISO string
    const extractDate = (dateString) => {
      if (!dateString) return '';
      return dateString.split('T')[0];
    };

    setForm({
      title: experience?.title ?? "",
      company: experience?.company ?? "",
      location: experience?.location ?? "",
      start_date: extractDate(experience?.start_date),
      end_date: extractDate(experience?.end_date),
      description: experience?.description ?? "",
      current: experience?.current ?? false
    });
    onClearError?.();
  }
}, [isOpen, experience, onClearError]);

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!form.title.trim() || !form.company.trim() || !form.start_date) {
    return;
  }

  const submissionData = {
    ...form,
    title: form.title.trim(),
    company: form.company.trim(),
    location: form.location.trim() || null,
    description: form.description || null,
    end_date: form.current ? null : (form.end_date || null)
  };

  onSave(submissionData);
};

  const handleClose = () => {
    onClearError?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={handleClose}>
      <ModalContainer 
        title={mode === 'add' ? 'Add Experience' : 'Edit Experience'} 
        onClose={handleClose}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Job Title *"
              value={form.title}
              onChange={(value) => setForm(prev => ({ ...prev, title: value }))}
              placeholder="e.g. Senior Frontend Engineer"
              required
            />

            <FormField
              label="Company *"
              value={form.company}
              onChange={(value) => setForm(prev => ({ ...prev, company: value }))}
              placeholder="Company name"
              required
            />

            <FormField
              label="Location"
              value={form.location}
              onChange={(value) => setForm(prev => ({ ...prev, location: value }))}
              placeholder="City, Country"
            />

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="date"
                label="Start Date *"
                value={form.start_date}
                onChange={(value) => setForm(prev => ({ ...prev, start_date: value }))}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {form.current ? 'Current Position' : 'End Date'}
                </label>
                {form.current ? (
                  <div className="text-sm text-gray-600 py-2 px-3 bg-gray-50 rounded-lg border">
                    Present
                  </div>
                ) : (
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={form.current}
                  onChange={(e) => setForm(prev => ({ 
                    ...prev, 
                    current: e.target.checked,
                    end_date: e.target.checked ? '' : prev.end_date
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">
                  I currently work here
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <ReactQuill 
                value={form.description} 
                onChange={(value) => setForm(prev => ({ ...prev, description: value }))} 
                theme="snow" 
                placeholder="Describe your responsibilities, achievements, and technologies used..."
                className="rounded-lg border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          <ModalActions 
            onCancel={handleClose}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel={mode === 'add' ? 'Add Experience' : 'Save Changes'}
          />
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

function EditSingleEducationModal({ 
  isOpen, 
  onClose, 
  education = {}, 
  onSave, 
  saving, 
  error, 
  onClearError,
  mode = 'add'
}) {
  const safeEducation = education || {};
  
  const [form, setForm] = useState({
    institution: safeEducation.institution || "",
    degree: safeEducation.degree || "",
    specialization: safeEducation.specialization || safeEducation.field_of_study || "",
    start_date: safeEducation.start_date || "",
    end_date: safeEducation.end_date || "",
  });

  useEffect(() => {
    if (isOpen) {
      const safeEducation = education || {};

      // Helper function to extract date part from ISO string
      const extractDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
      };

      setForm({
        institution: safeEducation.institution || "",
        degree: safeEducation.degree || "",
        specialization: safeEducation.specialization || safeEducation.field_of_study || "",
        start_date: extractDate(safeEducation.start_date),
        end_date: extractDate(safeEducation.end_date),
      });
      onClearError?.();
    }
  }, [isOpen, education, onClearError]);

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!form.institution.trim()) {
    return;
  }

  const submissionData = {
    institution: form.institution.trim(),
    degree: form.degree.trim() || null,
    specialization: form.specialization.trim() || null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
  };

  onSave(submissionData);
};

  const handleClose = () => {
    onClearError?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={handleClose}>
      <ModalContainer 
        title={mode === 'add' ? 'Add Education' : 'Edit Education'} 
        onClose={handleClose}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Institution *"
              value={form.institution}
              onChange={(value) => setForm(prev => ({ ...prev, institution: value }))}
              placeholder="University or College"
              required
            />

            <FormField
              label="Degree"
              value={form.degree}
              onChange={(value) => setForm(prev => ({ ...prev, degree: value }))}
              placeholder="e.g. BSc Computer Science"
            />

            <FormField
              label="Specialization"
              value={form.specialization}
              onChange={(value) => setForm(prev => ({ ...prev, specialization: value }))}
              placeholder="Field of study"
            />

            <FormField
              type="date"
              label="Start Date"
              value={form.start_date}
              onChange={(value) => setForm(prev => ({ ...prev, start_date: value }))}
              placeholder="Start date"
            />

            <FormField
              type="date"
              label="End Date"
              value={form.end_date}
              onChange={(value) => setForm(prev => ({ ...prev, end_date: value }))}
              placeholder="End date or leave blank"
            />
          </div>

          <ModalActions 
            onCancel={handleClose}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel={mode === 'add' ? 'Add Education' : 'Save Changes'}
          />
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

// =============================================================================
// EDIT SOCIAL LINKS MODAL - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

function EditSocialLinksModal({ isOpen, onClose, initial, onSave, saving, error, onClearError }) {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const initialLinks = (initial.social_links || []).map(link => ({
        id: link.id || Date.now() + Math.random(),
        platform: link.platform || "",
        url: link.url || ""
      }));
      setSocialLinks(initialLinks);
      onClearError?.();
    }
  }, [isOpen, initial, onClearError]);

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, {
      id: Date.now() + Math.random(),
      platform: "",
      url: ""
    }]);
  };

  const removeSocialLink = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateSocialLink = (id, field, value) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ social_links: socialLinks });
  };

  const handleClose = () => {
    onClearError?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClose={handleClose}>
      <ModalContainer title="Edit Social Links" onClose={handleClose} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <ErrorAlert message={error} />}

          <div className="flex items-center justify-between">
            <ModalSectionTitle>Social Links</ModalSectionTitle>
            <AddButton onClick={addSocialLink} icon="plus">
              Add Social Link
            </AddButton>
          </div>
          
          <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={link.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Social Link #{index + 1}
                  </h3>
                  <RemoveButton onClick={() => removeSocialLink(link.id)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, "platform", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 bg-white"
                    >
                      <option value="">Select Platform</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="github">GitHub</option>
                      <option value="website">Website</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      label="URL"
                      value={link.url}
                      onChange={(value) => updateSocialLink(link.id, "url", value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {socialLinks.length === 0 && (
            <EmptyState 
              icon="social"
              title="No social links added yet"
              actionLabel="Add your first social link"
              onAction={addSocialLink}
            />
          )}

          <ModalActions 
            onCancel={handleClose}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Save Social Links"
          />
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

// =============================================================================
// CUSTOM HOOKS - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

const API_PROFILE_ROUTE = (id) => `/profiles/${id}`;

function useProfile(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].key);

const transformBackendData = (data) => {
  try {
    if (!data) {
      console.error("transformBackendData received null/undefined data");
      return null;
    }
    
    const user = data.user || {};
    const network = data.network || {};
    
    const result = {
      // User basic info
      id: user.id ?? null,
      username: user.username ?? null,
      email: user.email ?? null,
      first_name: user.first_name ?? null,
      last_name: user.last_name ?? null,
      profile_pic: user.profile_pic ?? DEFAULT_IMAGES.AVATAR,

      // Profile info
      title: user.title ?? null,
      location: user.location ?? null,
      phone: user.phone ?? null,
      bio: user.bio ?? null,
      about: user.about ?? null,
      website_url: user.website_url ?? null,
      date_of_birth: user.date_of_birth ?? null,
      gender: user.gender ?? null,

      // Arrays
      social_links: Array.isArray(user.social_links) ? user.social_links : [],
      educations: Array.isArray(data.educations) ? data.educations : [],
      experiences: Array.isArray(data.experiences) ? data.experiences : [],

      // Network data - FIXED STRUCTURE
      network: {
        followers: network.followers || network.follower_count || 0,
        following: network.following || network.following_count || 0,
        connections: network.connections || network.connection_count || 0,
        follower_breakdown: network.follower_breakdown || network.followerBreakdown || {},
        connections_list: network.connections_list || network.connections || [],
        followers_list: network.followers_list || [],
        following_list: network.following_list || []
      },

      // Additional fields
      profileType: (user.account_type === "student") ? "student" : "professional",
      name: user.full_name ?? (`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "User"),

      // Mentor/Mentee status
      is_mentor: user.is_mentor || false,
      is_mentee: user.is_mentee || false,

      // UI specific fields
      comments: Array.isArray(data.comments) ? data.comments : [],
      discussions: Array.isArray(data.discussions) ? data.discussions : [],
      activities: Array.isArray(data.activities) ? data.activities : [],
      badges: Array.isArray(data.badges) ? data.badges : [],

      // Backend data
      reputation: data.reputation ?? { stats: [], details: [] },

      // Misc/meta
      profile_completeness: user.profile_completeness ?? 0,
      is_verified: user.is_verified ?? false,
      account_type: user.account_type ?? "basic",
      is_active: user.is_active ?? false,
      is_owner: data.is_owner === true,
      created_at: user.created_at ?? null,
    };
    
    return result;
    
  } catch (error) {
    console.error("Error in transformBackendData:", error);
    return null;
  }
};
    
  useEffect(() => {
    if (!userId) {
      setProfileData(null);
      setError("No user id provided");
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const data = await profileService.getProfile(userId);

        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response data from server");
        }

        const transformedData = transformBackendData(data);

        if (!transformedData) {
          throw new Error("Data transformation returned null");
        }

        setProfileData(transformedData);

      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("useProfile fetch error:", err);
        setError(err.message || "Failed to load profile");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    return () => controller.abort();
  }, [userId]);

  const addComment = async (commentText) => {
    await simulateAPICall(500);

    const newComment = {
      id: Date.now(),
      name: "You",
      when: "Just now",
      text: commentText,
      avatar: DEFAULT_IMAGES.PLACEHOLDER,
    };

    setProfileData((prev) => ({
      ...prev,
      comments: [newComment, ...(prev?.comments ?? [])],
    }));
  };

  const updateProfile = async (updatedFields) => {
    setProfileData((prev) => ({ ...prev, ...updatedFields }));

    try {
      await simulateAPICall(600);

      const isFormData = updatedFields instanceof FormData;
      const response = await profileService.updateProfile(userId, updatedFields);

      if (response) {
        setProfileData((prev) => ({
          ...prev,
          ...transformBackendData(response),
        }));
      }

      return { ok: true };
    } catch (err) {
      setError(err.message || "Failed to save profile");
      return { ok: false, error: err.message };
    }
  };

  // Individual CRUD operations for educations
  const addEducation = async (educationData) => {
    try {
      const data = await profileService.addEducation(userId, educationData);
      setProfileData((prev) => ({
        ...prev,
        educations: [...(prev?.educations ?? []), data.education],
      }));

      return { ok: true, education: data.education };
    } catch (err) {
      setError(err.message || "Failed to add education");
      return { ok: false, error: err.message };
    }
  };

  const updateEducation = async (educationId, educationData) => {
    try {
      const data = await profileService.updateEducation(userId, educationId, educationData);
      setProfileData((prev) => ({
        ...prev,
        educations: (prev?.educations ?? []).map(edu =>
          edu.id === educationId ? data.education : edu
        ),
      }));

      return { ok: true, education: data.education };
    } catch (err) {
      setError(err.message || "Failed to update education");
      return { ok: false, error: err.message };
    }
  };

  const deleteEducation = async (educationId) => {
    try {
      await profileService.deleteEducation(userId, educationId);
      setProfileData((prev) => ({
        ...prev,
        educations: (prev?.educations ?? []).filter(edu => edu.id !== educationId),
      }));

      return { ok: true };
    } catch (err) {
      setError(err.message || "Failed to delete education");
      return { ok: false, error: err.message };
    }
  };

  // Individual CRUD operations for experiences
  const addExperience = async (experienceData) => {
    try {
      const data = await profileService.addExperience(userId, experienceData);
      setProfileData((prev) => ({
        ...prev,
        experiences: [...(prev?.experiences ?? []), data.experience],
      }));

      return { ok: true, experience: data.experience };
    } catch (err) {
      setError(err.message || "Failed to add experience");
      return { ok: false, error: err.message };
    }
  };

  const updateExperience = async (experienceId, experienceData) => {
    try {
      const data = await profileService.updateExperience(userId, experienceId, experienceData);

      setProfileData((prev) => ({
        ...prev,
        experiences: (prev?.experiences ?? []).map(exp =>
          exp.id === experienceId ? data.experience : exp
        ),
      }));

      return { ok: true, experience: data.experience };
    } catch (err) {
      setError(err.message || "Failed to update experience");
      return { ok: false, error: err.message };
    }
  };

  const deleteExperience = async (experienceId) => {
    try {
      await profileService.deleteExperience(userId, experienceId);
      setProfileData((prev) => ({
        ...prev,
        experiences: (prev?.experiences ?? []).filter(exp => exp.id !== experienceId),
      }));

      return { ok: true };
    } catch (err) {
      setError(err.message || "Failed to delete experience");
      return { ok: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    profileData,
    activeTab,
    setActiveTab,
    addComment,
    updateProfile,

    // education CRUD
    addEducation,
    updateEducation,
    deleteEducation,

    // experience CRUD
    addExperience,
    updateExperience,
    deleteExperience,
  };

}

// =============================================================================
// UI COMPONENTS
// =============================================================================

function FollowersIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );
}

function FollowingIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
  );
}

function ConnectionsIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
  );
}

function FollowersMetric({ count = 0, breakdown = {}, onClick }) {
  const tooltipContent = useMemo(() => {
    if (!breakdown || Object.keys(breakdown).length === 0)
      return `${count.toLocaleString()} followers`;
    const breakdownText = Object.entries(breakdown)
      .map(([dept, deptCount]) => `${dept}: ${deptCount}`)
      .join("\n");
    return `${count.toLocaleString()} followers\n\nBreakdown:\n${breakdownText}`;
  }, [count, breakdown]);

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-blue-200"
      >
        <div className="p-2 rounded-lg bg-blue-500 text-white group-hover:bg-blue-600 transition-colors duration-200">
          <FollowersIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-blue-900">
            {Number(count).toLocaleString()}
          </span>
          <span className="text-xs text-blue-700 font-medium">Followers</span>
        </div>
      </div>
    </Tooltip>
  );
}

function FollowingMetric({ count = 0, onClick }) {
  return (
    <Tooltip content={`Following ${Number(count).toLocaleString()} people`} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-green-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-green-200"
      >
        <div className="p-2 rounded-lg bg-green-500 text-white group-hover:bg-green-600 transition-colors duration-200">
          <FollowingIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-green-900">
            {Number(count).toLocaleString()}
          </span>
          <span className="text-xs text-green-700 font-medium">Following</span>
        </div>
      </div>
    </Tooltip>
  );
}

function ConnectionsMetric({ count = 0, connections = [], onClick }) {
  const tooltipContent =
    connections?.length > 0 ? `${count} connections\nClick to view network` : `${count} connections`;

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-purple-200"
      >
        <div className="p-2 rounded-lg bg-purple-500 text-white group-hover:bg-purple-600 transition-colors duration-200">
          <ConnectionsIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-purple-900">{count}</span>
          <span className="text-xs text-purple-700 font-medium">Groups</span>
        </div>
      </div>
    </Tooltip>
  );
}

function SocialMetricsGrid({ network = { followers: 0, following: 0, connections: [], followerBreakdown: {} }, onFollowersClick, onFollowingClick, onGroupsClick }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <FollowersMetric 
        count={network.followers} 
        breakdown={network.follower_breakdown} 
        onClick={onFollowersClick}
      />
      <FollowingMetric 
        count={network.following} 
        onClick={onFollowingClick}
      />
      <ConnectionsMetric 
        count={network.connections?.length ?? 0} 
        connections={network.connections_list ?? []} 
        onClick={onGroupsClick}
      />
    </div>
  );
}

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

// UPDATED TAB NAV COMPONENT
function TabNav({ tabs = [], active, onChange }) {
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
            active === tab.key 
              ? "text-white bg-blue-600 border-blue-600 shadow-sm" 
              : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

// =============================================================================
// EDIT DROPDOWN COMPONENT
// =============================================================================

function EditDropdown({ isOpen, onClose, onEditPersonal, onEditAbout, onEditExperience, onEditEducation, onEditSocialLinks }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="py-1">
        <button
          onClick={() => { onEditPersonal(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Personal Information
        </button>
        <button
          onClick={() => { onEditSocialLinks(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Social Links
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// SOCIAL LINKS COMPONENT - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

function SocialLinks({ social_links = [], email, phone, website_url }) {
  const socialIcons = {
    linkedin: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    email: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  };

  const socialLinksArray = Array.isArray(social_links) ? social_links : [];
  const hasSocialLinks = socialLinksArray.length > 0;
  const hasContactInfo = email || phone;
  const hasWebsite = website_url;

  if (!hasSocialLinks && !hasContactInfo && !hasWebsite) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {hasWebsite && (
        <WebsiteLink url={website_url} size="sm" />
      )}

      {hasWebsite && (hasSocialLinks || hasContactInfo) && (
        <div className="w-px h-6 bg-gray-300"></div>
      )}

      {hasSocialLinks && socialLinksArray.map((link, index) => (
        <Tooltip key={index} content={link.platform || "Social link"} position="bottom">
          <a
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 font-medium"
          >
            {socialIcons[link.platform] || socialIcons.email}
          </a>
        </Tooltip>
      ))}

      {hasSocialLinks && hasContactInfo && (
        <div className="w-px h-6 bg-gray-300"></div>
      )}

      <div className="flex items-center gap-2">
        {email && (
          <Tooltip content={`Email: ${email}`} position="bottom">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 transition-all duration-200 font-medium"
            >
              {socialIcons.email}
            </a>
          </Tooltip>
        )}
        {phone && (
          <Tooltip content={`Call: ${phone}`} position="bottom">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition-all duration-200 font-medium"
            >
              {socialIcons.phone}
            </a>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// CONTENT DISPLAY COMPONENT
// =============================================================================

function ContentDisplay({ content = "" }) {
  return (
    <div
      className="text-sm text-gray-700 prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// =============================================================================
// LOADING AND ERROR COMPONENTS
// =============================================================================

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

function ErrorDisplay({ message = "Something went wrong", onRetry = () => window.location.reload() }) {
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
// TAB CONTENT COMPONENTS
// =============================================================================

function StudentCourses({ courses = [] }) {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
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

function StudentSkills({ skills = [] }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
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

function StudentAcademicInfo({ courses = [], skills = [] }) {
  if ((!courses || courses.length === 0) && (!skills || skills.length === 0)) return null;
  return (
    <div className="space-y-4">
      <StudentCourses courses={courses} />
      <StudentSkills skills={skills} />
    </div>
  );
}

function Discussions({ items = [] }) {
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

function Reputation({ stats = [], details = [] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(stats || []).map((stat, index) => (
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

function Activities({ items = [] }) {
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
        <button type="submit" disabled={isSubmitting || !comment.trim()} className={cx("rounded-lg px-4 py-2.5 text-sm text-white font-medium transition-colors duration-200", isSubmitting || !comment.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800")}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

function Comments({ items = [], onAddComment }) {
  return (
    <div>
      <CommentForm onSubmit={onAddComment} />
      <div className="space-y-4">
        {(!items || items.length === 0) ? (
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

// =============================================================================
// MAIN PROFILE COMPONENT - UPDATED FOR BACKEND COMPATIBILITY
// =============================================================================

export default function Profile({ userId, viewerId = null, isAuthenticated = false }) {
  const {
    loading,
    error,
    profileData,
    activeTab,
    setActiveTab,
    addComment,
    updateProfile,

    // education CRUD
    addEducation,
    updateEducation,
    deleteEducation,

    // experience CRUD
    addExperience,
    updateExperience,
    deleteExperience,
  } = useProfile(userId);
  const [isSaving, setIsSaving] = useState(false);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [editModals, setEditModals] = useState({
    personal: false,
    about: false,
    experience: false,
    education: false,
    socialLinks: false
  });

  // Add network modal states
  const [networkModals, setNetworkModals] = useState({
    followers: false,
    following: false,
    groups: false
  });

  const [singleItemModals, setSingleItemModals] = useState({
    experience: { isOpen: false, item: null, mode: 'add' },
    education: { isOpen: false, item: null, mode: 'add' }
  });

  const canEdit = Boolean(profileData?.is_owner === true);
  
  // Network modal handlers
  const openNetworkModal = (modalType) => {
    setNetworkModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeNetworkModal = (modalType) => {
    setNetworkModals(prev => ({ ...prev, [modalType]: false }));
  };

  const openEditModal = (modalType) => {
    setEditModals(prev => ({ ...prev, [modalType]: true }));
    setSaveError(null);
    setSaveSuccess(null);
  };

  const closeEditModal = (modalType) => {
    setEditModals(prev => ({ ...prev, [modalType]: false }));
    setSaveError(null);
    setSaveSuccess(null);
  };

  const clearSaveError = () => {
    setSaveError(null);
  };

  const handleSave = async (payload) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    
    const result = await updateProfile(payload);
    setIsSaving(false);
    
    if (result.ok) {
      setSaveSuccess("Profile updated successfully!");
      setTimeout(() => {
        setEditModals({
          personal: false,
          about: false,
          experience: false,
          education: false,
          socialLinks: false
        });
        setSaveSuccess(null);
      }, 1500);
    } else {
      setSaveError(result.error || "Failed to save changes. Please try again.");
    }
  };

  const handleImproveProfile = () => {
    setEditDropdownOpen(true);
  };

  const openSingleExperienceModal = (experience = null) => {
    setSingleItemModals(prev => ({
      ...prev,
      experience: {
        isOpen: true,
        item: experience,
        mode: experience ? 'edit' : 'add'
      }
    }));
    setSaveError(null);
  };

  const openSingleEducationModal = (education = null) => {
    setSingleItemModals(prev => ({
      ...prev,
      education: {
        isOpen: true,
        item: education,
        mode: education ? 'edit' : 'add'
      }
    }));
    setSaveError(null);
  };

  const handleSaveSingleExperience = async (experienceData) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      let result;
      if (singleItemModals.experience.mode === 'add') {
        result = await addExperience(experienceData);
      } else {
        result = await updateExperience(singleItemModals.experience.item.id, experienceData);
      }

      if (result.ok) {
        setSaveSuccess(`Experience ${singleItemModals.experience.mode === 'add' ? 'added' : 'updated'} successfully!`);
        setSingleItemModals(prev => ({ ...prev, experience: { isOpen: false, item: null, mode: 'add' } }));
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError("Failed to save experience. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSingleEducation = async (educationData) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      let result;
      if (singleItemModals.education.mode === 'add') {
        result = await addEducation(educationData);
      } else {
        result = await updateEducation(singleItemModals.education.item.id, educationData);
      }

      if (result.ok) {
        setSaveSuccess(`Education ${singleItemModals.education.mode === 'add' ? 'added' : 'updated'} successfully!`);
        setSingleItemModals(prev => ({ ...prev, education: { isOpen: false, item: null, mode: 'add' } }));
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError("Failed to save education. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await deleteExperience(experienceId);

      if (result.ok) {
        setSaveSuccess("Experience deleted successfully!");
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError("Failed to delete experience. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await deleteEducation(educationId);

      if (result.ok) {
        setSaveSuccess("Education entry deleted successfully!");
        setTimeout(() => setSaveSuccess(null), 2000);
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
      setSaveError("Failed to delete education entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const isStudent = profileData?.profileType === "student";

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title={isStudent ? "Study Discussions" : "Latest & Popular Discussions"}>
        <Discussions items={profileData.discussions} />
      </SectionCard>

      <SectionCard title="Reputation">
        <Reputation stats={profileData.reputation?.stats ?? []} details={profileData.reputation?.details ?? []} />
      </SectionCard>

      <SectionCard title="Activities">
        <Activities items={profileData.activities} />
      </SectionCard>

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
          {(profileData.comments || []).slice(0, 2).map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar ?? DEFAULT_IMAGES.PLACEHOLDER} alt={`${comment.name}'s avatar`} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{comment.name}</p>
                  <span className="text-xs text-gray-500">{comment.when}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
              </div>
            </div>
          ))}
          {profileData.comments && profileData.comments.length > 2 && (
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !profileData) {
    return <ErrorDisplay message={error || "User not found"} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-6xl mx-auto grid gap-4">
      {saveSuccess && (
        <ErrorAlert message={saveSuccess} type="success" onClose={() => setSaveSuccess(null)} />
      )}
      {saveError && (
        <ErrorAlert message={saveError} onClose={() => setSaveError(null)} />
      )}

      <EditPersonalInfoModal
        isOpen={editModals.personal}
        onClose={() => closeEditModal('personal')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
        error={saveError}
        onClearError={clearSaveError}
      />

      <EditAboutModal
        isOpen={editModals.about}
        onClose={() => closeEditModal('about')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
        error={saveError}
        onClearError={clearSaveError}
      />

      <EditSingleExperienceModal
        isOpen={singleItemModals.experience.isOpen}
        onClose={() => setSingleItemModals(prev => ({ ...prev, experience: { isOpen: false, item: null, mode: 'add' } }))}
        experience={singleItemModals.experience.item}
        onSave={handleSaveSingleExperience}
        saving={isSaving}
        error={saveError}
        onClearError={() => setSaveError(null)}
        mode={singleItemModals.experience.mode}
      />

      <EditSingleEducationModal
        isOpen={singleItemModals.education.isOpen}
        onClose={() => setSingleItemModals(prev => ({ ...prev, education: { isOpen: false, item: null, mode: 'add' } }))}
        education={singleItemModals.education.item}
        onSave={handleSaveSingleEducation}
        saving={isSaving}
        error={saveError}
        onClearError={() => setSaveError(null)}
        mode={singleItemModals.education.mode}
      />

      <EditSocialLinksModal
        isOpen={editModals.socialLinks}
        onClose={() => closeEditModal('socialLinks')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
        error={saveError}
        onClearError={clearSaveError}
      />

      {/* Network Modals */}
      <FollowersModal
        isOpen={networkModals.followers}
        onClose={() => closeNetworkModal('followers')}
        followers={profileData?.network?.followers_list || []}
        followerBreakdown={profileData?.network?.follower_breakdown || {}}
      />

      <FollowingModal
        isOpen={networkModals.following}
        onClose={() => closeNetworkModal('following')}
        following={profileData?.network?.following_list || []}
      />

      <GroupsModal
        isOpen={networkModals.groups}
        onClose={() => closeNetworkModal('groups')}
        groups={profileData?.network?.connections_list || []}
      />

      {/* Main Profile Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-rows-[auto_auto] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="relative w-32 h-32 mx-auto md:mx-0">
              <img src={profileData.profile_pic ?? DEFAULT_IMAGES.AVATAR} alt="User avatar" className="w-full h-full rounded-xl object-cover border-2 border-gray-100 shadow-sm" />
              
              <div className="absolute -bottom-1 -right-1">
                <ActiveStatusIndicator 
                  lastActive={profileData.is_active}
                  isActive={profileData.is_active}
                  className="w-6 h-6"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900 truncate">
                        {profileData?.name || "User"}
                      </h2>
                      
                      <VerificationBadge isVerified={profileData.is_verified} size="md" />
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cx(
                          "px-2.5 py-1 text-xs font-medium rounded-full border",
                          isStudent
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-purple-100 text-purple-800 border-purple-200"
                        )}
                      >
                        {isStudent ? "Student" : "Professional"}
                      </span>
                      
                      <AccountTypeBadge accountType={profileData.account_type} size="sm" />
                      
                      <MentorMenteeBadges 
                        isMentor={profileData.is_mentor} 
                        isMentee={profileData.is_mentee} 
                        size="sm" 
                      />
                    </div>
                  </div>

                  <p className="text-gray-600 font-medium truncate">
                    {isStudent
                      ? `${profileData.major || "No major"} • ${profileData.university || "No university"}`
                      : `${profileData.title || "No Title"}${profileData.company ? ` at ${profileData.company}` : ""}`}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {profileData.location || "No location specified"}
                    {isStudent && profileData.yearsExperience ? ` • ${profileData.yearsExperience} years experience` : ""}
                  </p>
                  
                  <p className="text-sm text-gray-500 p-0 truncate">
                    {profileData.bio || "No bio"}
                  </p>

                  <AccountCreationDate 
                    createdAt={profileData.created_at} 
                    className="mt-2"
                  />
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2 flex-wrap justify-end">
                    {(profileData.badges || []).map((badge, index) => (
                      <Tooltip key={index} content={badge} position="bottom">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md font-medium border border-yellow-200 whitespace-nowrap">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {badge}
                        </span>
                      </Tooltip>
                    ))}
                  </div>

                  {canEdit && (
                    <div className="relative">
                      <ProfileCompletion 
                        completeness={profileData.profile_completeness} 
                        onImprove={handleImproveProfile}
                      />
                      <EditDropdown
                        isOpen={editDropdownOpen}
                        onClose={() => setEditDropdownOpen(false)}
                        onEditPersonal={() => openEditModal('personal')}
                        onEditAbout={() => openEditModal('about')}
                        onEditExperience={() => openEditModal('experience')}
                        onEditEducation={() => openEditModal('education')}
                        onEditSocialLinks={() => openEditModal('socialLinks')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <SocialMetricsGrid 
                network={profileData.network} 
                onFollowersClick={() => openNetworkModal('followers')}
                onFollowingClick={() => openNetworkModal('following')}
                onGroupsClick={() => openNetworkModal('groups')}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 mt-2 pt-3">
            <SocialLinks
              social_links={profileData.social_links}
              email={profileData.email}
              phone={profileData.phone}
              website_url={profileData.website_url}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation and Content */}
      <div className="space-y-6">
        <TabNav tabs={TAB_CONFIG} active={activeTab} onChange={setActiveTab} />
        
        <div className="transition-all duration-200">
          {activeTab === "aboutus" && (
            <SectionCard 
              title="About" 
              action={canEdit && (
                <button 
                  onClick={() => openEditModal('about')}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Edit
                </button>
              )}
            >
              <ContentDisplay content={profileData.about} />
            </SectionCard>
          )}

          {activeTab === "experience" && (
            <SectionCard 
              title={isStudent ? "Experience & Activities" : "Professional Experience"}
              action={canEdit && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openSingleExperienceModal()}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                  </button>
                </div>
              )}
            >
              {(profileData.experiences && profileData.experiences.length > 0) ? (
                <ExperiencesList 
                  experiences={profileData.experiences} 
                  onEdit={() => openSingleExperienceModal()}
                  onEditItem={openSingleExperienceModal}
                  onDeleteItem={handleDeleteExperience}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Experience Added</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Share your professional journey by adding your work experiences, internships, and relevant positions.
                  </p>
                  {canEdit && (
                    <button 
                      onClick={() => openSingleExperienceModal()}
                      className="mt-4 rounded-lg px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium"
                    >
                      Add Experience
                    </button>
                  )}
                </div>
              )}
            </SectionCard>
          )}

          {activeTab === "education" && (
            <SectionCard 
              title="Education"
              action={canEdit && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openSingleEducationModal()}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Education
                  </button>
                </div>
              )}
            >
              <EducationsList 
                educations={profileData.educations} 
                onEdit={() => openSingleEducationModal()}
                onEditItem={openSingleEducationModal}
                onDeleteItem={handleDeleteEducation}
              />
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
              <Reputation stats={profileData.reputation?.stats ?? []} details={profileData.reputation?.details ?? []} />
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
        </div>
      </div>
    </div>
  );
}