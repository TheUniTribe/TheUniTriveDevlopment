import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

import Header from "@/Components/Header";
import LeftSidebar from "@/Components/LeftSidebar";
import RightSidebar from "@/Components/RightSidebar";
import Discussion from "@/Components/Discussion";
import JobsSection from "@/Components/JobsSection";
import MarketplaceSection from "@/Components/MarketplaceSection";
import LearningHub from "@/Components/LearningHub";
import Profile from "@/Components/Profile";
import Dashboard from "@/Components/Dashboard";
import Settings from "@/Components/Settings";
import Messages from "@/Components/Messages";
import Notifications from "@/Components/Notifications";
import DiscoverGroups from "@/Components/DiscoverGroups";

const Home = () => {
  const { content } = usePage().props;
  const [activePage, setActivePage] = useState(content);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Update categories based on active page
  useEffect(() => {
    const categoryMap = {
      home: ["All Posts", "All Discussions", "All Jobs", "All Posts"],
      discussion: ["All Topics", "General", "Academic", "Career"],
      jobs: ["All Jobs", "Internships", "Full-time", "Part-time"],
      marketplace: ["All Items", "Books", "Electronics", "Clothing"],
      learning: ["All Courses", "Web Development", "Data Science", "Design"],
    };
    setCategories(
      categoryMap[activePage] || [
        "All Posts",
        "Discussion Forum",
        "Jobs & Internships",
        "Marketplace",
        "Learning Hub",
      ]
    );
  }, [activePage]);

  const componentMap = {
    dashboard: <Dashboard />,
    home: <Discussion />,
    profile: <Profile />,
    settings: <Settings />,
    discussion: <Discussion />,
    jobs: <JobsSection />,
    marketplace: <MarketplaceSection />,
    learning: <LearningHub />,
    messages: <Messages />,
    notifications: <Notifications />,
    discoverGroups: <DiscoverGroups />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Top Bar - Always sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b shadow-sm">
        <Header SetPage={setActivePage} />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 pt-[60px] min-h-[calc(100vh-60px)]">
        {/* Left Sidebar - Sticky with independent scrolling */}
        <aside className="hidden lg:flex sticky top-[60px] self-start h-[calc(100vh-60px)] w-64 border-r bg-white overflow-hidden">
          <div className="flex flex-col w-full h-full">
            {/* Profile Section - Sticky within sidebar */}
            <div className="sticky top-0 z-10 bg-white border-b">
              {/* Profile content will be rendered by LeftSidebar component */}
            </div>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <LeftSidebar
                categories={categories}
                selectedFilter={activePage}
                setSelectedFilter={setActivePage}
                setPage={setActivePage}
              />
            </div>
          </div>
        </aside>

        {/* Main Content - Independently scrollable */}
        <main className="flex-1 min-w-0 bg-white overflow-y-auto">
          <div className="p-4 md:p-6">
            {componentMap[activePage] || <Discussion />}
          </div>
        </main>

        {/* Right Sidebar - Sticky with independent scrolling */}
        <aside className="hidden xl:flex sticky top-[60px] self-start h-[calc(100vh-60px)] w-72 border-l bg-white overflow-hidden">
          <div className="flex flex-col w-full h-full">
            <div className="flex-1 overflow-y-auto">
              <RightSidebar
                activePage={activePage}
                rightMenuOpen={rightMenuOpen}
                setRightMenuOpen={setRightMenuOpen}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;