// components/Reactions.jsx
import React, { useState } from 'react';

const Reactions = ({ article, onReaction, darkMode }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['👍', '👎', '❤️', '🔥', '🎉', '👀', '😮', '😂'];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onReaction(article.id, 'like')}
          className={`p-2 rounded-full transition-all duration-200 ${
            article.isLiked 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 scale-110' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          👍 {article.likes > 0 && article.likes}
        </button>
        
        <button
          onClick={() => onReaction(article.id, 'dislike')}
          className={`p-2 rounded-full transition-all duration-200 ${
            article.isDisliked 
              ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 scale-110' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          👎 {article.dislikes > 0 && article.dislikes}
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className={`absolute bottom-full mb-2 left-0 p-2 rounded-xl shadow-lg border ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="grid grid-cols-4 gap-1">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReaction(article.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {article.reactions && Object.keys(article.reactions).length > 0 && (
          <div className="flex space-x-1 mt-1">
            {Object.entries(article.reactions).map(([emoji, count]) => (
              <span key={emoji} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {emoji} {count}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reactions;