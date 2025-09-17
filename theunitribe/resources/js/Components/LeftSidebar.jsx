import React from "react";
import { usePage } from "@inertiajs/react";
import { Settings, Bell, HelpCircle, X } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const LeftSidebar = ({ categories, selectedFilter, setSelectedFilter, setPage, leftMenuOpen, setLeftMenuOpen }) => {
    const { auth } = usePage().props;
    const userName = auth.user.name;
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // Helper function to get filter value from category
    const getFilterValue = (category) => {
        switch (category) {
            case "All Posts":
                return "home";
            case "Discussion Forum":
            case "All Topics":
            case "General":
            case "Academic":
            case "Career":
                return "discussion";
            case "Jobs & Internships":
            case "All Jobs":
            case "Internships":
            case "Full-time":
            case "Part-time":
                return "jobs";
            case "Marketplace":
            case "All Items":
            case "Books":
            case "Electronics":
            case "Clothing":
                return "marketplace";
            case "Learning Hub":
            case "All Courses":
            case "Web Development":
            case "Data Science":
            case "Design":
                return "learning";
            default:
                return "home";
        }
    };

    return (
        <>
            {/* Fixed Left Sidebar */}
            <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40 overflow-y-auto hidden lg:block">
                <div className="p-6">
                    {/* Profile Section */}
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl font-medium text-blue-700">{userInitials}</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-600">Computer Science '25</p>

                        <div className="flex justify-between mb-6">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">24</div>
                                <div className="text-xs text-gray-600">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">142</div>
                                <div className="text-xs text-gray-600">Comments</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">8</div>
                                <div className="text-xs text-gray-600">Groups</div>
                            </div>
                        </div>

                        <div className="space-y-0 text-sm">
                            <div className="flex space-x-6">
                                <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors duration-300">
                                    <FaFacebook size={20} />
                                </a>
                                <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors duration-300">
                                    <FaTwitter size={20} />
                                </a>
                                <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-300">
                                    <FaInstagram size={20} />
                                </a>
                                <a href="https://linkedin.com/in/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors duration-300">
                                    <FaLinkedin size={20} />
                                </a>
                                <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors duration-300">
                                    <FaYoutube size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-900 ">Categories</h3>
                        <div>
                            {categories.map((category, index) => {
                                const filterValue = getFilterValue(category);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedFilter(filterValue);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded-lg text-sm ${selectedFilter === filterValue ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Left Sidebar */}
            <div
                className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${leftMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:hidden
      `}
            >
                <div className="h-full overflow-y-auto pt-16">
                    <div className="p-6">
                        <button className="absolute top-4 right-4 p-2" onClick={() => setLeftMenuOpen(false)}>
                            <X className="h-6 w-6" />
                        </button>

                        {/* Profile Section */}
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-medium text-blue-700">{userInitials}</span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">{userName}</h2>
                            <p className="text-sm text-gray-600 mb-4">Computer Science '25</p>

                            <div className="flex justify-between mb-6">
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">24</div>
                                    <div className="text-xs text-gray-600">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">142</div>
                                    <div className="text-xs text-gray-600">Comments</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">8</div>
                                    <div className="text-xs text-gray-600">Groups</div>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3">Edit Profile</button>

                            <div className="space-y-0 text-sm">
                                <button className="w-full flex items-center space-x-2 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </button>
                                <button className="w-full flex items-center space-x-2 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Bell className="h-4 w-4" />
                                    <span>Notifications</span>
                                </button>
                                <button className="w-full flex items-center space-x-2 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <HelpCircle className="h-4 w-4" />
                                    <span>Help & Support</span>
                                </button>
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <div>
                                {categories.map((category, index) => {
                                    const filterValue = getFilterValue(category);

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setSelectedFilter(filterValue);
                                                setLeftMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedFilter === filterValue ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-gray-100"}`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftSidebar;
