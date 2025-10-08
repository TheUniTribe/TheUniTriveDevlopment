// Home.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import Articles from "@/Pages/Articles";
import  Question  from "@/Components/Question"

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "New message from Sarah", time: "10 min ago", read: false },
  { id: 2, text: "Your post got 15 likes", time: "1 hour ago", read: false },
  { id: 3, text: "Campus event starting tomorrow", time: "2 hours ago", read: true },
];

const MOCK_MESSAGES = [
  { id: 1, name: "Alex Johnson", text: "Hey — are you going to the study session?", time: "Just now", unread: true },
  { id: 2, name: "Professor Miller", text: "Reminder: Assignment due tomorrow", time: "30 min ago", unread: true },
  { id: 3, name: "Campus News", text: "New resources available in library", time: "2 hours ago", unread: false },
];

/**
 * Mock data for live events
 * @type {Array<{id: number, title: string, organizer: string, viewers: number, status: 'live' | 'starting_soon'}>}
 */
const MOCK_LIVE_EVENTS = [
  { id: 1, title: "Tech Conference 2023", organizer: "Computer Science Dept", viewers: 245, status: "live" },
  { id: 2, title: "Career Fair Orientation", organizer: "Career Services", viewers: 128, status: "live" },
  { id: 3, title: "Alumni Networking Session", organizer: "Alumni Association", viewers: 87, status: "starting_soon" },
];

const Home = () => {
  const { content, auth } = usePage().props;
  const [activePage, setActivePage] = useState(content || "home");
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Global UI state owned by Home
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Focus refs
  const liveCloseRef = useRef(null);
  const liveModalRef = useRef(null);
  const notificationsCloseRef = useRef(null);
  const messagesCloseRef = useRef(null);
  const profileCloseRef = useRef(null);
  const previousActiveRef = useRef(null);

  const categories = useMemo(() => {
    const categoryMap = {
      home: ["All Posts", "All Discussions", "All Jobs"],
      discussion: ["All Topics", "General", "Academic", "Career"],
      jobs: ["All Jobs", "Internships", "Full-time", "Part-time"],
      marketplace: ["All Items", "Books", "Electronics", "Clothing"],
      learning: ["All Courses", "Web Development", "Data Science", "Design"],
    };
    return categoryMap[activePage] || ["All Posts", "Discussions", "Jobs", "Marketplace"];
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

  // Prevent background scroll while live modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isLiveModalOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isLiveModalOpen]);

  // Global ESC handler to close overlays
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLiveModalOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus management helpers
  useEffect(() => {
    if (isLiveModalOpen) {
      previousActiveRef.current = document.activeElement;
      // focus the close button inside the live modal once rendered
      setTimeout(() => liveCloseRef.current?.focus?.(), 0);
    } else {
      previousActiveRef.current?.focus?.();
    }
  }, [isLiveModalOpen]);

  useEffect(() => {
    if (isNotificationsOpen) {
      previousActiveRef.current = document.activeElement;
      setTimeout(() => notificationsCloseRef.current?.focus?.(), 0);
    } else {
      previousActiveRef.current?.focus?.();
    }
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (isMessagesOpen) {
      previousActiveRef.current = document.activeElement;
      setTimeout(() => messagesCloseRef.current?.focus?.(), 0);
    } else {
      previousActiveRef.current?.focus?.();
    }
  }, [isMessagesOpen]);

  useEffect(() => {
    if (isProfileOpen) {
      previousActiveRef.current = document.activeElement;
      setTimeout(() => profileCloseRef.current?.focus?.(), 0);
    } else {
      previousActiveRef.current?.focus?.();
    }
  }, [isProfileOpen]);

  // Overlay click handlers (close when clicking backdrop)
  const handleLiveOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsLiveModalOpen(false);
  };
  const handleNotificationsOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsNotificationsOpen(false);
  };
  const handleMessagesOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsMessagesOpen(false);
  };
  const handleProfileOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsProfileOpen(false);
  };

  // simple navigation helper for buttons inside these panels
  const navigateTo = (page) => {
    setActivePage(page);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsLiveModalOpen(false);
  };

  // sign out fallback: redirect to /logout (adjust to your logout flow)
  const handleSignOut = () => {
    // if you have a form.post logout in Header, you can call it there;
    // for now fallback to redirect
    window.location.href = "/logout";
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b shadow-sm">
        <Header
          SetPage={setActivePage}
          // Live
          isLiveModalOpen={isLiveModalOpen}
          setIsLiveModalOpen={setIsLiveModalOpen}
          // Notifications & Messages (owned by Home)
          isNotificationsOpen={isNotificationsOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          isMessagesOpen={isMessagesOpen}
          setIsMessagesOpen={setIsMessagesOpen}
          // Profile (owned by Home)
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
      </header>

      {/* Left Sidebar */}
      <aside className="fixed top-[60px] left-0 hidden lg:flex flex-col h-[calc(100vh-60px)] w-64 border-r bg-white z-50">
        <div className="flex-1 overflow-y-auto">
          <LeftSidebar
            categories={categories}
            selectedFilter={activePage}
            setSelectedFilter={setActivePage}
            setPage={setActivePage}
            setActiveModal={setActiveModal}
          />
        </div>
      </aside>

      {/* Right Sidebar */}
      {!activeModal && (
        <aside className="fixed top-[60px] right-0 hidden xl:flex flex-col h-[calc(100vh-60px)] w-72 border-l bg-white z-50">
          <div className="flex-1 overflow-y-auto">
            <RightSidebar
              activePage={activePage}
              rightMenuOpen={rightMenuOpen}
              setRightMenuOpen={setRightMenuOpen}
            />
          </div>
        </aside>
      )}

      {/* Main Section */}
      <main className="absolute top-[60px] bottom-0 left-0 right-0 lg:left-64 xl:right-72 overflow-y-auto bg-white">
        <div className="p-4 md:p-6 min-h-full">{componentMap[activePage] || <Discussion />}</div>
      </main>

      {/* ---------------- Live Events Modal ---------------- */}
      <AnimatePresence>
        {isLiveModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1500] p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleLiveOverlayClick}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-events-title"
              ref={liveModalRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[2000] flex items-center justify-center p-4 pointer-events-auto"
              style={{ outline: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b">
                  <h2 id="live-events-title" className="text-lg font-semibold capitalize">
                    Live Event
                  </h2>
                  <button
                    ref={liveCloseRef}
                    onClick={() => setIsLiveModalOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Close live modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[70vh]">
                  {/* Live event content */}
                  {MOCK_LIVE_EVENTS.map((event) => (
                    <div key={event.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
                        </div>
                        <div className="flex items-center">
                          {event.status === "live" && (
                            <span className="flex items-center mr-3">
                              <span className="h-2 w-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                              <span className="text-xs font-medium text-red-600">LIVE</span>
                            </span>
                          )}
                          {event.status === "starting_soon" && (
                            <span className="text-xs font-medium text-orange-600">Starting Soon</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span className="ml-1">{event.viewers} watching</span>
                        </div>
                        <button className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200">
                          Join Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t text-center bg-gray-50">
                  <button
                    onClick={() => setIsLiveModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- Notifications Panel ---------------- */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div
              key="notifications-overlay"
              className="fixed inset-0 z-[1400] bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleNotificationsOverlayClick}
            />
            <motion.div
              key="notifications-panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[72px] right-20 z-[1500] w-80 bg-white rounded-lg shadow-lg overflow-hidden"
              role="dialog"
              aria-labelledby="notifications-title"
            >
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <h3 id="notifications-title" className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
                <button
                  ref={notificationsCloseRef}
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 ${!n.read ? "bg-blue-50" : ""}`}>
                    <p className="text-sm text-gray-800">{n.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t text-center">
                <button className="text-sm text-indigo-600 hover:underline" onClick={() => navigateTo("notifications")}>
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- Messages Panel ---------------- */}
      <AnimatePresence>
        {isMessagesOpen && (
          <>
            <motion.div
              key="messages-overlay"
              className="fixed inset-0 z-[1400] bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleMessagesOverlayClick}
            />
            <motion.div
              key="messages-panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[72px] right-4 z-[1500] w-80 bg-white rounded-lg shadow-lg overflow-hidden"
              role="dialog"
              aria-labelledby="messages-title"
            >
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <h3 id="messages-title" className="text-sm font-medium text-gray-900">
                  Messages
                </h3>
                <button
                  ref={messagesCloseRef}
                  onClick={() => setIsMessagesOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close messages"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {MOCK_MESSAGES.map((m) => (
                  <div key={m.id} className={`px-4 py-3 hover:bg-gray-50 ${m.unread ? "bg-blue-50" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-sm text-gray-700 truncate">{m.text}</p>
                      </div>
                      <div className="text-xs text-gray-500">{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t text-center">
                <button className="text-sm text-indigo-600 hover:underline" onClick={() => navigateTo("messages")}>
                  View all messages
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- Profile Panel (now owned by Home, same pattern) ---------------- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              key="profile-overlay"
              className="fixed inset-0 z-[1400] bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleProfileOverlayClick}
            />
            <motion.div
              key="profile-panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[72px] right-4 z-[1500] w-64 bg-white rounded-lg shadow-lg overflow-hidden"
              role="dialog"
              aria-labelledby="profile-title"
            >
              <div className="px-4 py-2 border-b flex items-center justify-between">
                <h3 id="profile-title" className="text-sm font-medium text-gray-900">
                  Account
                </h3>
                <button
                  ref={profileCloseRef}
                  onClick={() => setIsProfileOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close profile"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 py-3">
                <p className="text-sm text-gray-900 font-medium truncate">{auth?.user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{auth?.user?.email || "user@example.com"}</p>
              </div>

              <div className="divide-y divide-gray-100">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                  onClick={() => navigateTo("profile")}
                >
                  <span className="text-sm text-gray-800">Profile</span>
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                  onClick={() => navigateTo("settings")}
                >
                  <span className="text-sm text-gray-800">Settings</span>
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                  onClick={handleSignOut}
                >
                  <span className="text-sm text-gray-800">Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Dynamic Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <h2 className="text-lg font-semibold capitalize">{activeModal}</h2>
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeModal === "articles" && <Articles />}
            {activeModal === "questions" && <Question />}
            {activeModal === "discussions" && <Discussion />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
