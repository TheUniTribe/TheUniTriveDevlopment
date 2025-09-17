// src/components/QuickLinks.js
import React from 'react';
import { FaBriefcase, FaBookmark, FaCalendar, FaCertificate } from 'react-icons/fa';

const QuickLinks = () => {
  const links = [
    { icon: <FaBriefcase className="text-indigo-600" />, text: "My Applications" },
    { icon: <FaBookmark className="text-indigo-600" />, text: "Saved Posts" },
    { icon: <FaCalendar className="text-indigo-600" />, text: "Upcoming Events" },
    { icon: <FaCertificate className="text-indigo-600" />, text: "My Certifications" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Quick Links</h3>
      
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 cursor-pointer">
            <div className="mr-3 text-xl">{link.icon}</div>
            <span>{link.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;