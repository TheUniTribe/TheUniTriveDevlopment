// src/components/Post.js
import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';

const Post = ({ name, major, time, title, content, image = false, comments }) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center"></div>
        <div className="ml-3">
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-500">{major} • Posted {time}</p>
        </div>
      </div>
      
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-gray-700 mb-4">{content}</p>
      
      {image && (
        <div className="mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
            <span className="text-gray-500">Project screenshot image</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between text-gray-500 text-sm mb-4">
        <span>{comments} comments</span>
        <div className="flex space-x-3">
          <button 
            className={`flex items-center ${liked ? 'text-indigo-600' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <FaThumbsUp className="mr-1" /> Like
          </button>
          <button className="flex items-center">
            <FaComment className="mr-1" /> Comment
          </button>
          <button className="flex items-center">
            <FaShare className="mr-1" /> Share
          </button>
        </div>
      </div>
      
      <div className="flex items-center border-t border-gray-200 pt-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8 flex items-center justify-center"></div>
        <input 
          type="text" 
          placeholder="Write a comment..." 
          className="ml-3 bg-gray-100 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default Post;