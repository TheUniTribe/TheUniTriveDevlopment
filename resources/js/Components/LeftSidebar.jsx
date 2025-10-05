import React, { useState } from "react";
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope,
  FaMapMarkerAlt, FaTimes, FaBars, FaHeart, FaEye, FaFileAlt, FaUsers
} from "react-icons/fa";
import Articles from "../Pages/Articles";

// =============================================================================
// CONSTANTS AND CONFIGURATION DATA
// =============================================================================

const TRENDING_SECTION_CONFIG = {
  questions: {
    title: "Trending Questions",
    icon: FaFileAlt,
    color: "blue",
    data: [
      { name: "All Posts", views: "2.4k" },
      { name: "Discussion Forum", views: "1.8k" },
      { name: "Jobs & Internships", views: "3.2k" },
    ]
  },
  discussions: {
    title: "Trending Discussions",
    icon: FaUsers,
    color: "green",
    data: [
      { name: "General", views: "4.1k" },
      { name: "Academic", views: "2.9k" },
      { name: "Career", views: "3.7k" },
    ]
  },
  articles: {
    title: "Trending Articles",
    icon: FaFileAlt,
    color: "purple",
    data: [
      { name: "Tech", views: "5.2k" },
      { name: "Science", views: "3.4k" },
      { name: "Design", views: "2.1k" },
    ]
  }
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
  blue: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    textColor: "text-gray-700 hover:text-blue-600",
    borderColor: "border-blue-100"
  },
  green: {
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    textColor: "text-gray-700 hover:text-green-600",
    borderColor: "border-green-100"
  },
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    textColor: "text-gray-700 hover:text-purple-600",
    borderColor: "border-purple-100"
  }
};

// =============================================================================
// REUSABLE COMPONENTS
// =============================================================================

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

const SectionHeader = ({ title, icon: Icon, colorScheme, onTitleClick }) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${colorScheme.iconBg}`}>
        <Icon className={`text-sm ${colorScheme.iconColor}`} aria-hidden="true" />
      </div>
      <h3
        className="text-gray-800 font-semibold text-sm whitespace-nowrap cursor-pointer"
        onClick={onTitleClick} // Only clicking title triggers modal
      >
        {title}
      </h3>
    </div>
  </div>
);

const TrendingSection = ({ title, icon: Icon, items, color = "blue", onTitleClick }) => {
  const colorScheme = COLOR_SCHEMES[color] || COLOR_SCHEMES.blue;

  return (
    <section className="mb-6" aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
      <SectionHeader title={title} icon={Icon} colorScheme={colorScheme} onTitleClick={onTitleClick} />
      <div className="space-y-1" role="list" aria-label={`${title} items`}>
        {items.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-150"
            role="listitem"
          >
            <TrendingItem
              item={item}
              icon={Icon}
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
    {links.map((social, idx) => (
      <a
        key={idx}
        href={social.href}
        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded"
        aria-label={`Visit ${social.label} profile`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <social.icon className="text-base" aria-hidden="true" />
      </a>
    ))}
  </div>
);

const UserProfile = () => (
  <div className="flex flex-col items-center p-4 pt-2 text-center border-b border-gray-100 bg-gradient-to-br from-white to-gray-50">
    <div className="relative mb-3">
      <div 
        className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-md"
        aria-label="User avatar"
      >
        S
      </div>
      <button 
        className="absolute -bottom-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        aria-label="Like profile"
      >
        <FaHeart className="text-xs" aria-hidden="true" />
      </button>
    </div>

    <h2 className="font-semibold text-gray-800 text-lg mb-1">Sarah Johnson</h2>
    <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full">
      Computer Science
    </span>

    <div className="flex items-center gap-1 text-gray-500 text-sm mt-2" aria-label="Location">
      <FaMapMarkerAlt className="text-xs" aria-hidden="true" />
      <span>New Delhi, India</span>
    </div>

    <UserStats stats={USER_STATS} />
    <SocialLinks links={SOCIAL_LINKS} />
  </div>
);

const MobileToggleButton = ({ onClick }) => (
  <button
    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
    onClick={onClick}
    aria-label="Open sidebar"
    aria-expanded="false"
  >
    <FaBars className="text-base" aria-hidden="true" />
  </button>
);

const MobileOverlay = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    onClick={onClose}
    aria-hidden="true"
  />
);

const CloseButton = ({ onClose }) => (
  <div className="flex justify-end p-4 md:hidden border-b border-gray-200">
    <button
      onClick={onClose}
      aria-label="Close sidebar"
      className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
    >
      <FaTimes className="text-base" aria-hidden="true" />
    </button>
  </div>
);

const FullScreenModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-0 w-screen h-screen">
      <div className="bg-white w-full h-full overflow-y-auto rounded-none relative shadow-xl flex flex-col">
        <button
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FaTimes className="text-xl" />
        </button>
        <div className="p-6 w-full h-full">
          {/* Modal content goes here */}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const LeftSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <>
      <MobileToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <MobileOverlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <aside
        className={`fixed md:static top-0 left-0 z-50 w-72 md:w-64 h-full bg-white border-r border-gray-200 flex flex-col transform md:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        role="complementary"
        aria-label="Sidebar navigation"
      >
        <CloseButton onClose={() => setIsSidebarOpen(false)} />
        <UserProfile />

  <div className="flex-1 overflow-y-auto px-4 py-4">
          <TrendingSection
            title={TRENDING_SECTION_CONFIG.questions.title}
            icon={TRENDING_SECTION_CONFIG.questions.icon}
            items={TRENDING_SECTION_CONFIG.questions.data}
            color={TRENDING_SECTION_CONFIG.questions.color}
          />

          <TrendingSection
            title={TRENDING_SECTION_CONFIG.discussions.title}
            icon={TRENDING_SECTION_CONFIG.discussions.icon}
            items={TRENDING_SECTION_CONFIG.discussions.data}
            color={TRENDING_SECTION_CONFIG.discussions.color}
          />

          <TrendingSection
            title={TRENDING_SECTION_CONFIG.articles.title}
            icon={TRENDING_SECTION_CONFIG.articles.icon}
            items={TRENDING_SECTION_CONFIG.articles.data}
            color={TRENDING_SECTION_CONFIG.articles.color}
            onTitleClick={() => setSelectedArticle({ title: TRENDING_SECTION_CONFIG.articles.title })}
          />
        </div>
      </aside>

      <FullScreenModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  );
};

export default LeftSidebar;
