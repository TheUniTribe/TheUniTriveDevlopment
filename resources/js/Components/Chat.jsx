// src/components/Chat.js
import React, { useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  const [message, setMessage] = useState('');
  
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10"></div>
        <div className="ml-3">
          <h3 className="font-bold">David Kim</h3>
          <p className="text-xs text-gray-500">CS Major • Active now</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="bg-indigo-50 p-3 rounded-lg max-w-xs">
          <p>Hey, have you started working on the group project yet?</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg max-w-xs ml-auto">
          <p>Not yet, I'm planning to start this weekend. Want to collaborate?</p>
        </div>
        
        <div className="bg-indigo-50 p-3 rounded-lg max-w-xs">
          <p>Sure! I've already created a project outline. Check it out:</p>
          <div className="mt-2 flex items-center bg-white p-2 rounded border border-gray-200">
            <div className="bg-gray-200 w-8 h-8 rounded flex items-center justify-center mr-2">
              <span className="text-xs">PDF</span>
            </div>
            <div>
              <p className="text-sm font-medium">Project Outline.pdf</p>
              <p className="text-xs text-gray-500">215 KB</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center border-t border-gray-200 pt-4">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..." 
          className="bg-gray-100 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button className="ml-2 text-gray-500 hover:text-indigo-600 p-2">
          <FaPaperclip />
        </button>
        <button className="ml-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;