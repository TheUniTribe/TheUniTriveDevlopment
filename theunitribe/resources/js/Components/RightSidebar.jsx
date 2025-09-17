import React from "react";
import { X } from "lucide-react";
import DiscoverGroups from "@/Components/DiscoverGroups";

const RightSidebar = ({ activePage, rightMenuOpen, setRightMenuOpen }) => {
    // Modal state
    const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);

    // Define quick actions based on activePage
    const quickActionsMap = {
        home: [
            { label: "Ask a Question", onClick: () => alert("Ask a Question clicked") },
            { label: "Start a Discussion", onClick: () => alert("Start a Discussion clicked") },
            { label: "Share an Article", onClick: () => alert("Share an Article clicked") },
        ],
        jobs: [
            { label: "Post a Job", onClick: () => alert("Post a Job clicked") },
            { label: "Search Jobs", onClick: () => alert("Search Jobs clicked") },
            { label: "Update Resume", onClick: () => alert("Update Resume clicked") },
        ],
        marketplace: [
            { label: "Sell an Item", onClick: () => alert("Sell an Item clicked") },
            { label: "Browse Items", onClick: () => alert("Browse Items clicked") },
            { label: "My Listings", onClick: () => alert("My Listings clicked") },
        ],
        learning: [
            { label: "Enroll in Course", onClick: () => alert("Enroll in Course clicked") },
            { label: "View My Courses", onClick: () => alert("View My Courses clicked") },
            { label: "Access Resources", onClick: () => alert("Access Resources clicked") },
        ],
        discussion: [
            { label: "Start New Topic", onClick: () => alert("Start New Topic clicked") },
            { label: "Browse Categories", onClick: () => alert("Browse Categories clicked") },
            { label: "Search Topics", onClick: () => alert("Search Topics clicked") },
        ],
    };

    const quickActions = quickActionsMap[activePage] || quickActionsMap.home;

    return (
        <>
            {/* Fixed Right Sidebar (Desktop) */}
            {!isGroupModalOpen && (
                <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg z-40 overflow-y-auto hidden lg:block">
                    <div className="p-4">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            onClick={action.onClick}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Community Guidelines</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>• Be respectful and constructive</p>
                                    <p>• Search before posting</p>
                                    <p>• Use relevant tags</p>
                                    <p>• No spam or self-promotion</p>
                                    <p>• Help others when you can</p>
                                </div>
                            </div>

                            {/* ✅ Show Create Event for Learning (Desktop) */}
                            {activePage === "learning" && (
                                <div className="pt-6">
                                    <button
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                        onClick={() => alert("Create Event clicked")}
                                    >
                                        Create Event
                                    </button>
                                </div>
                            )}

                            {/* ✅ Show Groups for Discussion (Desktop) */}
                            {activePage === "discussion" && (
                                <div className="pt-6">
                                    <button
                                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                        onClick={() => setIsGroupModalOpen(true)}
                                    >
                                        Find Groups
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Right Sidebar */}
            <div
                className={`
                fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
                ${rightMenuOpen && !isGroupModalOpen ? "translate-x-0" : "translate-x-full"}
                lg:hidden
            `}
            >
                <div className="h-full overflow-y-auto pt-16 p-4">
                    <button
                        className="absolute top-4 left-4 p-2"
                        onClick={() => setRightMenuOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        onClick={action.onClick}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Community Guidelines</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Be respectful and constructive</p>
                                <p>• Search before posting</p>
                                <p>• Use relevant tags</p>
                                <p>• No spam or self-promotion</p>
                                <p>• Help others when you can</p>
                            </div>
                        </div>

                        {/* ✅ Show Create Event for Learning (Mobile) */}
                        {activePage === "learning" && (
                            <div className="pt-6">
                                <button
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    onClick={() => alert("Create Event clicked")}
                                >
                                    Create Event
                                </button>
                            </div>
                        )}
                        {/* ✅ Show Groups for Discussion (Mobile) */}
                        {activePage === "discussion" && (
                            <div className="pt-6">
                                <button
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    onClick={() => setIsGroupModalOpen(true)}
                                >
                                    Find Groups
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ Fullscreen Modal for Find Groups */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Discover Groups</h2>
                        <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => setIsGroupModalOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <DiscoverGroups />
                    </div>

                    {/* Footer with Back Button */}
                    <div className="p-4 border-t flex justify-end">
                        <button
                            onClick={() => setIsGroupModalOpen(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RightSidebar;
