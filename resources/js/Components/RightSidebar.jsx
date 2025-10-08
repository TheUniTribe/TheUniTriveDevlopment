import React, { useState } from "react";
import { X } from "lucide-react";
import DiscoverGroups from "@/Components/DiscoverGroups";

const RightSidebar = ({ activePage, rightMenuOpen, setRightMenuOpen }) => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      {!isGroupModalOpen && (
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] w-72 bg-white border-l shadow hidden xl:block">
          <div className="p-4 space-y-6">
            <section>
              <h3 className="font-semibold text-gray-900 mb-3">Community Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Use relevant tags</li>
                <li>• No spam or self-promotion</li>
                <li>• Help others when you can</li>
              </ul>
            </section>

            {activePage === "discussion" && (
              <button
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                onClick={() => setIsGroupModalOpen(true)}
              >
                Find Groups
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-[1000] transform transition-transform duration-300 ease-in-out ${
          rightMenuOpen && !isGroupModalOpen ? "translate-x-0" : "translate-x-full"
        } xl:hidden`}
      >
        <div className="p-4 mt-14 overflow-y-auto">
          <button
            className="absolute top-4 left-4 p-2"
            onClick={() => setRightMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <section>
            <h3 className="font-semibold text-gray-900 mb-3">Community Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Be respectful and constructive</li>
              <li>• Use relevant tags</li>
              <li>• No spam or self-promotion</li>
              <li>• Help others when you can</li>
            </ul>
          </section>

          {activePage === "discussion" && (
            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium mt-4 hover:bg-green-700"
              onClick={() => setIsGroupModalOpen(true)}
            >
              Find Groups
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
          <div className="flex items-center justify-end p-2 border-b">
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <DiscoverGroups />
          </div>
          <div className="p-2 border-t text-center">
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
