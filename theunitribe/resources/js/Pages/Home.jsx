import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

import Header from "@/Components/Header";
import Discussion from "@/Components/Discussion";
import JobsSection from "@/Components/JobsSection";
import MarketplaceSection from "@/Components/MarketplaceSection";
import LearningHub from "@/Components/LearningHub";
import LeftSidebar from "@/Components/LeftSidebar";
import RightSidebar from "@/Components/RightSidebar";
import Profile from "@/Components/Profile";
import Dashboard from "@/Components/Dashboard";
import Settings from "@/Components/Settings";
import Messages from "@/Components/Messages";
import Notifications from "@/Components/Notifications";
import DiscoverGroups from "@/Components/DiscoverGroups";

const Home = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(<Discussion />);
    const [categories, setCategories] = useState(["All Posts", "Discussion Forum", "Jobs & Internships", "Marketplace", "Learning Hub"]);

    // Update categories based on activePage
    useEffect(() => {
        switch (activePage) {
            case 'home':
                setCategories(["All Posts"]);
                break;
            case 'discussion':
                setCategories(["All Topics", "General", "Academic", "Career"]);
                break;
            case 'jobs':
                setCategories(["All Jobs", "Internships", "Full-time", "Part-time"]);
                break;
            case 'marketplace':
                setCategories(["All Items", "Books", "Electronics", "Clothing"]);
                break;
            case 'learning':
                setCategories(["All Courses", "Web Development", "Data Science", "Design"]);
                break;
            default:
                setCategories(["All Posts", "Discussion Forum", "Jobs & Internships", "Marketplace", "Learning Hub"]);
        }
    }, [activePage]);

    // Component mapping
    const componentMap = {
        dashboard : <Dashboard/>,
        home: <Discussion />,
        profile: <Profile/>,
        settings: <Settings/>,
        discussion: <Discussion />,
        jobs: <JobsSection />,
        marketplace: <MarketplaceSection />,
        learning: <LearningHub />,
        messages: <Messages />,
        notifications: <Notifications />,
        discoverGroups : <DiscoverGroups/>
    };

    // Update currentPage when activePage changes
    useEffect(() => {
        setCurrentPage(componentMap[activePage] || <Discussion />);
    }, [activePage]);
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Top App Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header SetPage={setActivePage} />
            </div>

            {/* Mobile Menu Overlays */}
            {(leftMenuOpen || rightMenuOpen) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => {
                        setLeftMenuOpen(false);
                        setRightMenuOpen(false);
                    }}
                />
            )}

            <LeftSidebar
                categories={categories}
                selectedFilter={activePage}
                setSelectedFilter={setActivePage}
                setPage={setActivePage}
                leftMenuOpen={leftMenuOpen}
                setLeftMenuOpen={setLeftMenuOpen}
            />

            <RightSidebar
                activePage={activePage}
                rightMenuOpen={rightMenuOpen}
                setRightMenuOpen={setRightMenuOpen}
                setActivePage={setActivePage}
            />

            {/* Main Content */}
            <main className="lg:ml-64 lg:mr-80 lg:pt-16">{currentPage}</main>
        </div>
    );
};

export default Home;
