// src/components/LiveEvent.js
import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';

const LiveEvent = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white mb-6 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className="bg-red-500 px-2 py-1 rounded-md text-xs font-bold mr-2 flex items-center">
              <FaPlayCircle className="mr-1" /> LIVE NOW
            </span>
            <span className="text-sm">Ask Me Anything</span>
          </div>
          <button className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-md">
            Join Now
          </button>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12 flex items-center justify-center"></div>
          <div className="ml-3">
            <h3 className="font-bold">Sarah Chen</h3>
            <p className="text-sm">Product Manager at Google, MIT '18</p>
          </div>
        </div>
        
        <p className="text-sm mb-4">
          Discussing career paths in tech and how to land your first internship.
        </p>
        
        <div className="flex justify-between text-xs">
          <button className="text-indigo-200 hover:text-white">View Schedule</button>
          <span className="text-indigo-200">2,456 watching</span>
        </div>
      </div>
    </div>
  );
};

export default LiveEvent;