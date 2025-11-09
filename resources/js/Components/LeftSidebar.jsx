// LeftSidebar.jsx
import React, { useState } from "react";
import { Link, usePage, useForm } from '@inertiajs/react';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope,
  FaMapMarkerAlt, FaTimes, FaBars, FaHeart, FaEye, FaFileAlt, FaUsers
} from "react-icons/fa";

/* =========================
   CONFIG / CONSTANTS
   ========================= */
const TRENDING_SECTION_CONFIG = {
  questions: {
    title: "Trending Questions",
    icon: FaFileAlt,
    color: "blue",
    data: [
      { name: "All Posts", views: "2.4k" },
      { name: "Discussion Forum", views: "1.8k" },
      { name: "Jobs & Internships", views: "3.2k" },
    ],
  },
  discussions: {
    title: "Trending Discussions",
    icon: FaUsers,
    color: "green",
    data: [
      { name: "General", views: "4.1k" },
      { name: "Academic", views: "2.9k" },
      { name: "Career", views: "3.7k" },
    ],
  },
  articles: {
    title: "Trending Articles",
    icon: FaFileAlt,
    color: "purple",
    data: [
      { name: "Tech", views: "5.2k" },
      { name: "Science", views: "3.4k" },
      { name: "Design", views: "2.1k" },
    ],
  },
};

const USER_STATS = [
  { label: "Posts", value: 24 },
  { label: "Comments", value: 142 },
  { label: "Groups", value: 8 },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaEnvelope, href: "#", label: "Email" },
];

const COLOR_SCHEMES = {
  blue: { iconBg: "bg-blue-50", iconColor: "text-blue-600", textColor: "text-gray-700 hover:text-blue-600" },
  green: { iconBg: "bg-green-50", iconColor: "text-green-600", textColor: "text-gray-700 hover:text-green-600" },
  purple: { iconBg: "bg-purple-50", iconColor: "text-purple-600", textColor: "text-gray-700 hover:text-purple-600" },
};

/* =========================
   REUSABLE SUB-COMPONENTS
   ========================= */

const TrendingItem = ({ item, icon: Icon, iconBg, iconColor, textColor }) => (
  <div
    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
    role="listitem"
    aria-label={`Trending topic: ${item.name} with ${item.views} views`}
  >
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <div className={`p-1.5 rounded-md ${iconBg} flex-shrink-0`}>
        <Icon className={`text-sm ${iconColor}`} aria-hidden="true" />
      </div>
      <span className={`text-sm font-medium truncate ${textColor} transition-colors duration-150`}>
        {item.name}
      </span>
    </div>

    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
      <FaEye className="text-xs" aria-hidden="true" />
      <span>{item.views}</span>
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon, colorScheme, onClick }) => (
  <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={onClick}>
    <div className={`p-1.5 rounded-md ${colorScheme.iconBg}`}>
      <Icon className={`text-sm ${colorScheme.iconColor}`} aria-hidden="true" />
    </div>
    <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
  </div>
);

const TrendingSection = ({ config, onClick }) => {
  const colorScheme = COLOR_SCHEMES[config.color] || COLOR_SCHEMES.blue;
  return (
    <section className="mb-2" aria-labelledby={`${config.title}-heading`}>
      <SectionHeader title={config.title} icon={config.icon} colorScheme={colorScheme} onClick={onClick} />
      <div className="space-y-1" role="list" aria-label={`${config.title} items`}>
        {config.data.map((item, i) => (
          <div key={i} className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-150" role="listitem">
            <TrendingItem
              item={item}
              icon={config.icon}
              iconBg={colorScheme.iconBg}
              iconColor={colorScheme.iconColor}
              textColor={colorScheme.textColor}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const UserStats = ({ stats }) => (
  <div className="flex justify-around w-full mt-3" role="region" aria-label="User statistics">
    {stats.map((stat) => (
      <div key={stat.label} className="text-center px-2">
        <p className="font-semibold text-gray-900 text-lg">{stat.value}</p>
        <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
      </div>
    ))}
  </div>
);

const SocialLinks = ({ links }) => (
  <div className="flex justify-center space-x-4 mt-3" role="list" aria-label="Social media links">
    {links.map((social, idx) => {
      const Icon = social.icon;
      return (
        <a
          key={idx}
          href={social.href}
          className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded"
          aria-label={`Visit ${social.label} profile`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className="text-base" aria-hidden="true" />
        </a>
      );
    })}
  </div>
);

/* =========================
   USER PROFILE (fixed)
   ========================= */
// Accepts { user } object. uses safe optional chaining.
const UserProfile = ({ user }) => {
  const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "User";
  const initial = (user?.first_name && user.first_name.charAt(0).toUpperCase()) || "U";
  
  return (
    <div className="flex flex-col items-center p-4 pt-2 text-center border-b border-gray-100 bg-gradient-to-br from-white to-gray-50">
      <div className="relative mb-3">
        <div
          className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-md"
          aria-label="User avatar"
        >
          {initial}
        </div>

        <div className="relative group">
          <button
            className="absolute -bottom-2 -right-2 bg-transparent text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Like profile"
            type="button"
          >
            <FaHeart
              className="text-xs text-red-400 group-hover:text-red-600 transition-colors duration-200"
              aria-hidden="true"
            />
          </button>

          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity duration-200 pointer-events-none">
            1.2k Followers
          </span>
        </div>
      </div>

      <h2 className="font-semibold text-gray-800 text-lg">{displayName}</h2>
      <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full">
        Computer Science
      </span>

      <div className="flex items-center gap-1 text-gray-500 text-sm mt-2" aria-label="Location">
        <FaMapMarkerAlt className="text-xs" aria-hidden="true" />
        <span>{user?.location}</span>
      </div>

      <UserStats stats={USER_STATS} />
      <SocialLinks links={SOCIAL_LINKS} />
    </div>
  );
};

/* =========================
   MOBILE HELPERS
   ========================= */
const MobileToggleButton = ({ onClick }) => (
  <button
    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
    onClick={onClick}
    aria-label="Open sidebar"
    type="button"
  >
    <FaBars className="text-base" aria-hidden="true" />
  </button>
);

const MobileOverlay = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    onClick={onClose}
    aria-hidden="true"
  />
);

/* =========================
   LeftSidebar (MAIN)
   - receives setActiveModal(key)
   ========================= */
const LeftSidebar = ({ setActiveModal }) => {
  const { auth } = usePage().props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // auth.user may be undefined in some dev states; pass safe object.
  const user = auth?.user || null;

  return (
    <>
      {/* Mobile toggle */}
      <MobileToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <MobileOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <aside
        className={`fixed md:static top-0 left-0 z-50 w-72 md:w-64 h-full bg-white border-r flex flex-col transform md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        role="complementary"
        aria-label="Sidebar navigation"
      >
        {/* Close for mobile */}
        <div className="flex justify-end p-3 md:hidden border-b">
          <button
            className="p-2 hover:bg-gray-200 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        {/* User profile */}
        <UserProfile user={user} />

        {/* Trending sections */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {Object.entries(TRENDING_SECTION_CONFIG).map(([key, config]) => (
            <TrendingSection
              key={key}
              config={config}
              onClick={() => {
                // open centralized modal with the key (e.g. "articles")
                setActiveModal && setActiveModal(key);
                // also close mobile sidebar for a cleaner UX
                setIsSidebarOpen(false);
              }}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
