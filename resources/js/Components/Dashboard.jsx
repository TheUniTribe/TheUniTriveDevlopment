import React, { useState, useRef } from 'react';

export default function Dashboard() {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Future of Online Learning",
      content: "How do you see online learning evolving in the next decade? I'm curious about both technological advancements and pedagogical approaches.",
      author: "Alex Johnson",
      avatar: "AJ",
      timestamp: "2 hours ago",
      likes: 24,
      media: null,
      replies: [
        {
          id: 1,
          author: "Maria Chen",
          avatar: "MC",
          text: "I believe AI-powered personalized learning will become the norm. Each student will have a custom curriculum!",
          timestamp: "1 hour ago",
          likes: 8,
          media: null
        }
      ]
    },
    {
      id: 2,
      title: "Best Tools for Remote Collaboration",
      content: "What are your favorite tools for remote team collaboration? Looking for recommendations beyond the usual Zoom and Slack.",
      author: "Sam Williams",
      avatar: "SW",
      timestamp: "5 hours ago",
      likes: 17,
      media: {
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        title: "Collaboration Tools Overview"
      },
      replies: [
        {
          id: 1,
          author: "Ryan Kim",
          avatar: "RK",
          text: "We've been using Miro for whiteboarding and it's been a game-changer for our design team!",
          timestamp: "3 hours ago",
          likes: 5,
          media: null
        },
        {
          id: 2,
          author: "Lisa Taylor",
          avatar: "LT",
          text: "Notion is amazing for documentation and project tracking. Here's a video tutorial I found helpful:",
          timestamp: "2 hours ago",
          likes: 3,
          media: {
            type: "video",
            url: "https://www.youtube.com/embed/6F3S5fsfqN8",
            title: "Notion Tutorial"
          }
        }
      ]
    },
    {
      id: 3,
      title: "Video Content in Education",
      content: "How effective do you find video content for educational purposes compared to traditional text-based materials?",
      author: "Taylor Reed",
      avatar: "TR",
      timestamp: "1 day ago",
      likes: 32,
      media: {
        type: "video",
        url: "https://www.youtube.com/embed/e6EGQFJLl04",
        title: "Educational Video Strategies"
      },
      replies: []
    }
  ]);

  const [newReply, setNewReply] = useState("");
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const fileInputRef = useRef(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const handleReply = (discussionId, quote = "") => {
    if (!newReply && !mediaPreview && !videoUrl) return;

    const replyText = quote ? `> ${quote}\n${newReply}` : newReply;
    let media = mediaPreview;
    
    if (videoUrl && !mediaPreview) {
      // Extract YouTube ID or use the URL directly for embedding
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (youtubeRegex.test(videoUrl)) {
        let videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
        media = {
          type: "video",
          url: `https://www.youtube.com/embed/${videoId}`,
          title: "Embedded Video"
        };
      }
    }

    setDiscussions(prev => 
      prev.map(d => 
        d.id === discussionId 
          ? {
              ...d,
              replies: [
                ...d.replies,
                {
                  id: Date.now(),
                  author: "You",
                  avatar: "YO",
                  text: replyText,
                  timestamp: "Just now",
                  likes: 0,
                  media: media
                }
              ]
            }
          : d
      )
    );

    setNewReply("");
    setMediaPreview(null);
    setVideoUrl("");
    setActiveReplyBox(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview({
          type: file.type.startsWith("image/") ? "image" : "video",
          url: e.target.result,
          title: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const likeDiscussion = (discussionId) => {
    setDiscussions(prev => 
      prev.map(d => 
        d.id === discussionId 
          ? { ...d, likes: d.likes + 1 }
          : d
      )
    );
  };

  const likeReply = (discussionId, replyId) => {
    setDiscussions(prev => 
      prev.map(d => 
        d.id === discussionId 
          ? {
              ...d,
              replies: d.replies.map(r => 
                r.id === replyId 
                  ? { ...r, likes: r.likes + 1 }
                  : r
              )
            }
          : d
      )
    );
  };

  // Function to render media content (image, video, or embedded video)
  const renderMedia = (media) => {
    if (!media) return null;
    
    if (media.type === "image") {
      return (
        <div className="mt-3">
          <img 
            src={media.url} 
            alt={media.title || "Uploaded content"} 
            className="rounded-lg max-h-60 object-cover shadow-sm"
          />
        </div>
      );
    } else if (media.type === "video") {
      return (
        <div className="mt-3">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-sm"> {/* 16:9 aspect ratio */}
            <iframe
              src={media.url}
              title={media.title || "Embedded video"}
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {media.title && <p className="text-sm text-gray-600 mt-1">{media.title}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Discussions */}
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id} 
              className="bg-white rounded-2xl p-6 shadow-md border border-indigo-100 transition-all duration-300 hover:shadow-lg hover:border-indigo-200"
            >
              {/* Discussion Header */}
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {discussion.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{discussion.title}</h2>
                  <div className="flex items-center text-gray-500 text-sm">
                    <span className="font-medium text-indigo-600">{discussion.author}</span>
                    <span className="mx-2">•</span>
                    <span>{discussion.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Discussion Content */}
              <p className="text-gray-700 mb-4">{discussion.content}</p>
              
              {/* Discussion Media */}
              {renderMedia(discussion.media)}

              {/* Discussion Actions */}
              <div className="flex items-center justify-between mb-4 mt-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => likeDiscussion(discussion.id)}
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{discussion.likes}</span>
                  </button>
                  <button 
                    onClick={() => setActiveReplyBox(activeReplyBox === discussion.id ? null : discussion.id)}
                    className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{discussion.replies.length} replies</span>
                  </button>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Follow Discussion
                </button>
              </div>

              {/* Replies */}
              {discussion.replies.length > 0 && (
                <div className="ml-4 pl-4 border-l-2 border-indigo-100 mb-4">
                  {discussion.replies.map((reply) => (
                    <div 
                      key={reply.id} 
                      className="py-4 transition-all duration-300 hover:bg-indigo-50 rounded-lg px-3 -mx-3"
                    >
                      <div className="flex items-start mb-2">
                        <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {reply.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-indigo-600">{reply.author}</span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-gray-700 mt-1 whitespace-pre-line">{reply.text}</p>
                          
                          {/* Media Preview */}
                          {renderMedia(reply.media)}
                        </div>
                        <button 
                          onClick={() => likeReply(discussion.id, reply.id)}
                          className="flex items-center text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-xs">{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box (shown when active) */}
              {activeReplyBox === discussion.id && (
                <div className="bg-indigo-50 rounded-xl p-4 mt-4 transition-all duration-300">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full border border-indigo-200 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                  />
                  
                  {/* Video URL Input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube video URL"
                      className="w-full border border-indigo-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Media Preview */}
                  {mediaPreview && (
                    <div className="mb-3 relative">
                      {mediaPreview.type === "image" ? (
                        <div className="relative inline-block">
                          <img 
                            src={mediaPreview.url} 
                            alt="Preview" 
                            className="rounded-lg max-h-40 object-cover shadow-sm"
                          />
                          <button 
                            onClick={removeMedia}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="relative inline-block">
                          <video 
                            src={mediaPreview.url} 
                            className="rounded-lg max-h-40 object-cover shadow-sm"
                            controls
                          />
                          <button 
                            onClick={removeMedia}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <span className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Attach Media
                        </span>
                      </label>
                      <button
                        onClick={() => handleReply(discussion.id, discussion.content)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Quote
                      </button>
                    </div>
                    <button
                      onClick={() => handleReply(discussion.id)}
                      disabled={!newReply && !mediaPreview && !videoUrl}
                      className={`px-4 py-2 rounded-lg shadow-sm transition-colors ${!newReply && !mediaPreview && !videoUrl ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {discussions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-indigo-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No discussions yet</h3>
            <p className="text-gray-500">Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}