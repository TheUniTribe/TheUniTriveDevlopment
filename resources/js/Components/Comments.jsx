// components/Comments.jsx
import React, { useState } from 'react';

const Comments = ({ articleId, darkMode }) => {
  const [comments, setComments] = useState([
    {
      id: '1',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        isVerified: true
      },
      content: 'Great article! The points about AI integration are particularly insightful.',
      createdAt: '2024-01-15T12:00:00Z',
      likes: 12,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Sarah Wilson',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            isVerified: false
          },
          content: 'I completely agree! The future looks exciting.',
          createdAt: '2024-01-15T14:30:00Z',
          likes: 3
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: {
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          isVerified: true
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div>
      <div className="flex space-x-3 mb-4">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
          alt="Your avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={addComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, darkMode }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const addReply = () => {
    if (replyText.trim()) {
      // Implementation for adding reply
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="flex space-x-3">
        <img 
          src={comment.author.avatar} 
          alt={comment.author.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium">{comment.author.name}</span>
            {comment.author.isVerified && (
              <span className="text-blue-500 text-sm">✓</span>
            )}
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          
          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
              <span>👍</span>
              <span>{comment.likes}</span>
            </button>
            <button 
              onClick={() => setShowReply(!showReply)}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              Reply
            </button>
          </div>

          {showReply && (
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addReply}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} darkMode={darkMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
