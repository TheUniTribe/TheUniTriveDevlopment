import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Users, Activity, TrendingUp, MessageSquare, Star, Award, Eye,
  Target, Crown, Flame, Trophy, Heart, Share2, ShieldCheck,
  Calendar, Globe, Briefcase, GraduationCap, FileText,
  MessageCircle, ThumbsUp, Download, ChevronRight, TrendingDown,
  CheckCircle2, BarChart, Hash, Layers, Sparkles, Zap, Clock,
  UserPlus, BookOpen, Code, Terminal, ArrowUp, ArrowDown,
  CircleDot, Edit3, UserCheck, AlertCircle, ChevronDown, X, Mail,
  Phone, Send, MoreVertical, UserMinus, Shield, Search, Filter,
  Plus, Image, Smile, Bold, Italic, Underline, List, Link2,
  AlignLeft, AlignCenter, AlignRight, Quote, Code2, Paperclip,
  ChevronLeft, SlidersHorizontal, Bell, Settings, Home, Bookmark,
  Tag, DollarSign, Gift, Strikethrough, ListOrdered, Heading, 
  Video, Eraser, Lock, Info, Save, BarChart3, AlignJustify, CheckCircle
} from 'lucide-react';

// ==================== CONSTANTS & UTILS ====================

// Community Data
const COMMUNITY_DATA = {
  id: 1,
  name: "React Developers Elite",
  slug: "react-developers-elite",
  description: "Premier community for React developers to share knowledge, collaborate, and grow together",
  type: "professional",
  coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=300&fit=crop",
  avatar: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=200&h=200&fit=crop",
  theme_color: "#61DAFB",
  level: 8,
  levelProgress: 65,
  rank: "Platinum Elite",
  rankTier: "platinum",
  total_members: 15432,
  online_members: 1247,
  active_members_24h: 3247,
  daily_active_users: 1245,
  weekly_active_users: 2847,
  monthly_active_users: 5321,
  member_growth_today: 47,
  member_growth_week: 234,
  member_growth_month: 892,
  growth_rate: 12.3,
  total_posts: 15489,
  total_discussions: 8924,
  total_comments: 89245,
  total_likes: 214587,
  total_shares: 12478,
  total_views: 452189,
  posts_today: 145,
  discussions_active: 284,
  engagement_rate: 78.5,
  response_rate: 92.3,
  avg_response_time: 2.3,
  total_xp: 245000,
  reputation_score: 8920,
  influence_score: 7200,
  is_trending: true,
  is_featured: true,
  is_verified: true,
  is_fast_growing: true,
  total_earnings: 124500,
  avg_member_earnings: 8.1,
  opportunities_posted: 1247,
  created_at: "2023-01-15T08:00:00Z",
  last_activity_at: "2024-01-16T14:30:00Z",
  growthStory: [
    {
      date: "2023-01-15",
      milestone: "Community Created",
      level: 1,
      members: 10,
      description: "React Developers Elite was born"
    },
    {
      date: "2023-03-20",
      milestone: "First 1,000 Members",
      level: 3,
      members: 1000,
      description: "Reached our first major milestone"
    },
    {
      date: "2023-06-15",
      milestone: "Gold Rank Achieved",
      level: 5,
      members: 5000,
      description: "Community quality recognized with Gold rank"
    },
    {
      date: "2023-09-10",
      milestone: "10,000 Members Strong",
      level: 7,
      members: 10000,
      description: "Became one of the top React communities"
    },
    {
      date: "2024-01-10",
      milestone: "Platinum Elite Status",
      level: 8,
      members: 15000,
      description: "Achieved Platinum Elite ranking"
    }
  ]
};

// Rank Configuration
const RANK_CONFIG = {
  elite: { 
    gradient: 'from-purple-600 via-pink-600 to-purple-600',
    glow: 'shadow-purple-500/50',
    icon: Crown,
    color: 'text-purple-600'
  },
  diamond: { 
    gradient: 'from-cyan-400 via-blue-500 to-cyan-400',
    glow: 'shadow-cyan-400/50',
    icon: Star,
    color: 'text-cyan-600'
  },
  platinum: { 
    gradient: 'from-slate-300 via-slate-400 to-slate-300',
    glow: 'shadow-slate-300/50',
    icon: Award,
    color: 'text-slate-600'
  },
  gold: { 
    gradient: 'from-yellow-400 via-amber-500 to-yellow-400',
    glow: 'shadow-yellow-400/50',
    icon: Trophy,
    color: 'text-yellow-600'
  },
  silver: { 
    gradient: 'from-gray-300 via-gray-400 to-gray-300',
    glow: 'shadow-gray-300/50',
    icon: Award,
    color: 'text-gray-600'
  },
  bronze: { 
    gradient: 'from-orange-600 via-orange-700 to-orange-600',
    glow: 'shadow-orange-600/50',
    icon: Award,
    color: 'text-orange-600'
  }
};

// Utility Functions
const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ==================== COMPONENTS ====================

// Metric Card Component
const MetricCard = ({ icon, label, value, change, changeLabel, gradient, animate }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animate && typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const increment = Number(value) / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= Number(value)) {
          setDisplayValue(Number(value));
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [animate, value]);

  return (
    <div className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600 mb-1">{changeLabel}</div>
          <div className="text-sm font-bold text-emerald-600">{change}</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900">
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
      </div>
    </div>
  );
};

// Stat Item Component
const StatItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg border border-gray-200">
        {icon}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);

// Member Card Component
const MemberCard = ({ member, index }) => {
  const rankConfig = RANK_CONFIG[member.rank.toLowerCase()] || RANK_CONFIG.bronze;
  const RankIcon = rankConfig.icon;

  return (
    <div className="group p-3 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer relative">
      {index < 3 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
          {index + 1}
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rankConfig.gradient} p-0.5`}>
            <div className="w-full h-full rounded-lg bg-white flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{member.avatar}</span>
            </div>
          </div>
          {member.online && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{member.name}</div>
          <div className="text-xs text-gray-600">{member.role}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white rounded-lg p-2 border border-gray-200">
          <div className="text-gray-600 mb-1">Level</div>
          <div className="font-bold text-gray-900">{member.level}</div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-gray-200">
          <div className="text-gray-600 mb-1">Reputation</div>
          <div className="font-bold text-gray-900">{formatNumber(member.reputation || 0)}</div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const CommunityDashboard = () => {
  // State Management
  const [community, setCommunity] = useState(COMMUNITY_DATA);
  const [showGrowthStory, setShowGrowthStory] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showViewAllPostsModal, setShowViewAllPostsModal] = useState(false);
  const [showOnlineMembersModal, setShowOnlineMembersModal] = useState(false);
  const [showAllMembersModal, setShowAllMembersModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [enableComments, setEnableComments] = useState(true);
  const [schedulePost, setSchedulePost] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Add these refs
  const videoInputRef = useRef(null);
  
  // Post creation states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [postTags, setPostTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Refs
  const contentEditableRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize animations
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveDraft = useCallback(() => {
  if (!postTitle.trim() && !postContent.trim()) {
    alert('Cannot save empty draft');
    return;
  }

  const draft = {
    title: postTitle,
    content: postContent,
    images: selectedImages,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem('communityPostDraft', JSON.stringify(draft));
  alert('Draft saved successfully!');
  }, [postTitle, postContent, selectedImages]);
  
  const handlePreview = useCallback(() => {
  alert('Preview: ' + postTitle + '\n\n' + postContent.replace(/<[^>]*>/g, ''));
}, [postTitle, postContent]);

const handleVideoUpload = useCallback((e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedVideo(reader.result);
    };
    reader.readAsDataURL(file);
  }
}, []);

const handleRemoveVideo = useCallback(() => {
  setSelectedVideo(null);
}, []);
  
  // Sample Posts Data
  const posts = useMemo(() => [
    {
      id: 1,
      title: "Future of Online Learning",
      author: "Alex Johnson",
      authorAvatar: "AJ",
      content: "How do you see online learning evolving in the next decade? I'm curious about both technological advancements and pedagogical approaches.",
      replies: 1,
      likes: 24,
      timestamp: "2 hours ago",
      isFollowing: false,
      replyList: [
        {
          id: 1,
          author: "Maria Chen",
          authorAvatar: "MC",
          content: "I believe AI-powered personalized learning will become the norm. Each student will have a custom curriculum!",
          likes: 8,
          timestamp: "1 hour ago"
        }
      ]
    },
    {
      id: 2,
      title: "React Server Components - Production Best Practices",
      author: "Sarah Wilson",
      authorAvatar: "SW",
      content: "In this comprehensive guide, I'll walk you through the best practices for implementing React Server Components in production environments.",
      replies: 45,
      likes: 189,
      timestamp: "5 hours ago",
      isFollowing: true,
      replyList: []
    },
    {
      id: 3,
      title: "State Management 2024: Complete Guide",
      author: "Maria Rodriguez",
      authorAvatar: "MR",
      content: "A comprehensive comparison of state management solutions in 2024. Let's dive into Redux, Zustand, Jotai, and Recoil.",
      replies: 156,
      likes: 567,
      timestamp: "1 day ago",
      isFollowing: false,
      replyList: []
    },
    {
      id: 4,
      title: "Building Real-time Apps with Next.js 14",
      author: "James Wilson",
      authorAvatar: "JW",
      content: "Just launched a real-time collaboration app using Next.js 14 and Server Actions! Here's what I learned.",
      replies: 67,
      likes: 234,
      timestamp: "2 days ago",
      isFollowing: false,
      replyList: []
    }
  ], []);

  // Sample Members Data - Extended for online members modal
  const members = useMemo(() => [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "AC",
      role: "Owner",
      rank: "Elite",
      level: 10,
      reputation: 8920,
      contributions: 1245,
      earnings: 24500,
      communities_joined: 12,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      avatar: "MR",
      role: "Admin",
      rank: "Diamond",
      level: 9,
      reputation: 6540,
      contributions: 892,
      earnings: 18200,
      communities_joined: 8,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-02-20"
    },
    {
      id: 3,
      name: "James Wilson",
      avatar: "JW",
      role: "Moderator",
      rank: "Platinum",
      level: 8,
      reputation: 4320,
      contributions: 567,
      earnings: 12800,
      communities_joined: 15,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-03-10"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Core Member",
      rank: "Gold",
      level: 7,
      reputation: 2100,
      contributions: 321,
      earnings: 8400,
      communities_joined: 6,
      online: false,
      lastSeen: "2 hours ago",
      joinedDate: "2023-04-15"
    },
    {
      id: 5,
      name: "Emily Davis",
      avatar: "ED",
      role: "Active Member",
      rank: "Silver",
      level: 6,
      reputation: 1450,
      contributions: 245,
      earnings: 5200,
      communities_joined: 4,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-05-20"
    },
    {
      id: 6,
      name: "Michael Brown",
      avatar: "MB",
      role: "Member",
      rank: "Bronze",
      level: 5,
      reputation: 890,
      contributions: 156,
      earnings: 3100,
      communities_joined: 3,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-06-01"
    },
    {
      id: 7,
      name: "David Garcia",
      avatar: "DG",
      role: "Member",
      rank: "Silver",
      level: 6,
      reputation: 1680,
      contributions: 234,
      earnings: 4800,
      communities_joined: 5,
      online: false,
      lastSeen: "5 hours ago",
      joinedDate: "2023-07-12"
    },
    {
      id: 8,
      name: "Lisa Anderson",
      avatar: "LA",
      role: "Core Member",
      rank: "Gold",
      level: 7,
      reputation: 2450,
      contributions: 389,
      earnings: 9200,
      communities_joined: 7,
      online: false,
      lastSeen: "1 day ago",
      joinedDate: "2023-08-05"
    },
    {
      id: 9,
      name: "Robert Lee",
      avatar: "RL",
      role: "Member",
      rank: "Bronze",
      level: 4,
      reputation: 650,
      contributions: 98,
      earnings: 2100,
      communities_joined: 2,
      online: false,
      lastSeen: "3 days ago",
      joinedDate: "2023-09-18"
    },
    {
      id: 10,
      name: "Jennifer Martinez",
      avatar: "JM",
      role: "Active Member",
      rank: "Silver",
      level: 5,
      reputation: 1120,
      contributions: 178,
      earnings: 3600,
      communities_joined: 4,
      online: true,
      lastSeen: "Active now",
      joinedDate: "2023-10-22"
    }
  ], []);

  // Sample Activities Data
  const activities = useMemo(() => [
    {
      id: 1,
      type: "post",
      user: "Alex Chen",
      action: "created a new tutorial",
      target: "React Server Components Guide",
      timestamp: "2 min ago",
      xp: 50
    },
    {
      id: 2,
      type: "milestone",
      user: "Community",
      action: "reached",
      target: "15,000 members",
      timestamp: "15 min ago",
      xp: 500
    },
    {
      id: 3,
      type: "badge",
      user: "Maria Rodriguez",
      action: "earned",
      target: "Expert Contributor badge",
      timestamp: "1 hour ago",
      xp: 100
    },
    {
      id: 4,
      type: "join",
      user: "47 new members",
      action: "joined today",
      target: "",
      timestamp: "Today",
      xp: 0
    }
  ], []);

  // Common Emojis
  const commonEmojis = useMemo(() => 
    ['😀', '😂', '😊', '😍', '🤔', '👍', '👏', '🎉', '❤️', '🔥', '✨', '💡', '🚀', '💯', '🙌', '👌'], 
    []
  );

  // Event Handlers
  const handleTogglePost = useCallback((postId) => {
    setExpandedPostId(prev => prev === postId ? null : postId);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCreatePost = useCallback(() => {
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    console.log('Creating post:', {
      title: postTitle,
      content: postContent,
      images: selectedImages,
      tags: postTags
    });

    // Reset form
    setPostTitle('');
    setPostContent('');
    setSelectedImages([]);
    setPostTags([]);
    setShowCreatePostModal(false);
    
    alert('Post created successfully!');
  }, [postTitle, postContent, selectedImages, postTags]);

  const handleApplyFormatting = useCallback((command, value) => {
    document.execCommand(command, false, value || null);
    contentEditableRef.current?.focus();
  }, []);

  const handleInsertEmoji = useCallback((emoji) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
    }
    setShowEmojiPicker(false);
    contentEditableRef.current?.focus();
  }, []);

  const handleInsertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${linkText}</a>`;
      document.execCommand('insertHTML', false, link);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
      contentEditableRef.current?.focus();
    }
  }, [linkUrl, linkText]);

  const handleAddTag = useCallback((e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!postTags.includes(tagInput.trim())) {
        setPostTags(prev => [...prev, tagInput.trim()]);
      }
      setTagInput('');
    }
  }, [tagInput, postTags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setPostTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  // Get rank configuration
  const rankConfig = RANK_CONFIG[community.rankTier] || RANK_CONFIG.bronze;
  const RankIcon = rankConfig.icon;

  return (
    <>
      <style>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9CA3AF;
          pointer-events: none;
          display: block;
        }
        [contenteditable]:focus {
          outline: none;
        }
        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slideInFromBottom {
          animation: slideInFromBottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slideInFromRight {
          animation: slideInFromRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
      
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header Section - Compact Layout */}
      <div className="relative">
        {/* Full Height Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 h-64 md:h-72">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          
          {/* Back to Dashboard Button - Top Left */}
          <div className="absolute top-4 left-6 z-10">
            <button
              onClick={() => window.location.href = '/home'}
              className="px-5 py-2.5 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-900 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              title="Return to main dashboard"
            >
              <ChevronLeft size={18} />
              <Home size={18} />
              <span className="text-sm">Back to Dashboard</span>
            </button>
          </div>
          
          {/* Status Badges - Top Right */}
          <div className="absolute top-4 right-6 flex gap-2.5 z-10">
            {community.is_trending && (
              <div 
                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Trending Community"
              >
                <Flame size={20} className="text-white" />
              </div>
            )}
            {community.is_verified && (
              <div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Verified Community"
              >
                <ShieldCheck size={20} className="text-white" />
              </div>
            )}
            {community.is_fast_growing && (
              <div 
                className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                title="Fast Growing"
              >
                <TrendingUp size={20} className="text-white" />
              </div>
            )}
          </div>

          {/* Main Content Container */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-6">
            <div className="flex flex-col md:flex-row items-end gap-6 relative">
              {/* Stylish Avatar Box - Left */}
              <div className="relative group flex-shrink-0">
                {/* Gradient Ring */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Main Avatar Container */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl flex items-center justify-center border-4 border-white group-hover:scale-105 transition-transform overflow-hidden">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full blur-2xl"></div>
                  </div>
                  
                  {/* RDE Text with Gradient */}
                  <div className="relative text-5xl md:text-6xl font-black">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">
                      {community.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Community Details - Center */}
              <div className="flex-1 text-white">
                <h1 className="text-2xl md:text-4xl font-black text-white mb-1.5 drop-shadow-lg">
                  {community.name}
                </h1>
                <p className="text-white/90 text-sm md:text-base mb-3 max-w-2xl drop-shadow">
                  {community.description}
                </p>
                
                {/* Rank Badges - Icon Only with Tooltips */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div 
                    className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 hover:scale-110 transition-all cursor-pointer"
                    title={`Level ${community.level}`}
                  >
                    <Trophy size={20} className="text-white" />
                  </div>

                  <div 
                    className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 hover:scale-110 transition-all cursor-pointer"
                    title={community.rank}
                  >
                    <Award size={20} className="text-white" />
                  </div>

                  <div 
                    className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 hover:scale-110 transition-all cursor-pointer"
                    title={`${formatNumber(community.total_xp)} XP`}
                  >
                    <Sparkles size={20} className="text-yellow-300" />
                  </div>
                </div>

                {/* Progress Bar - Smaller */}
                <div className="max-w-xl">
                  <div className="flex items-center justify-between text-xs text-white/80 mb-1.5">
                    <span className="font-medium">Progress to Level {community.level + 1}</span>
                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full font-bold text-xs">{community.levelProgress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden shadow-inner border border-white/30">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: animateStats ? `${community.levelProgress}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Online Members Circle - Right - Smaller */}
              <div 
                onClick={() => setShowOnlineMembersModal(true)}
                className="relative flex-shrink-0 cursor-pointer group/online"
                title="View all online members"
              >
                <div className="w-40 h-40 md:w-44 md:h-44 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl border-4 border-white/50 flex flex-col items-center justify-center p-4 group-hover/online:scale-105 transition-all">
                  {/* Online Count */}
                  <div className="text-center mb-2">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <CircleDot size={14} className="text-emerald-500 animate-pulse" />
                      <span className="text-xl font-bold text-gray-900">{formatNumber(community.online_members)}</span>
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Online</div>
                  </div>

                  {/* Avatars - Smaller */}
                  <div className="flex items-center justify-center -space-x-2 mb-2">
                    {members.slice(0, 5).map((member, idx) => (
                      <div 
                        key={member.id} 
                        className="relative" 
                        style={{ zIndex: 10 - idx }}
                        title={member.name}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-lg ring-2 ring-emerald-400/30">
                          <span className="text-xs font-bold text-white">{member.avatar}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View More Button - Smaller */}
                  <button 
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all group-hover/online:scale-110"
                    title="View all members"
                  >
                    <Plus size={16} className="text-gray-400 group-hover/online:text-blue-600" />
                  </button>
                </div>

                {/* Purple Ring Decoration */}
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 -z-10 group-hover/online:border-purple-500/50 transition-all"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 py-8 pb-20 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="text-blue-600" size={24} />}
            label="Total Members"
            value={community.total_members}
            change={`+${community.member_growth_week}`}
            changeLabel="this week"
            gradient="from-blue-500 to-cyan-500"
            animate={animateStats}
          />

          <MetricCard
            icon={<MessageSquare className="text-emerald-600" size={24} />}
            label="Active Discussions"
            value={community.discussions_active}
            change={`${community.posts_today} today`}
            changeLabel="new posts"
            gradient="from-emerald-500 to-green-500"
            animate={animateStats}
          />

          <MetricCard
            icon={<Activity className="text-purple-600" size={24} />}
            label="Engagement Rate"
            value={`${community.engagement_rate}%`}
            change={`${community.response_rate}%`}
            changeLabel="response rate"
            gradient="from-purple-500 to-pink-500"
            animate={animateStats}
          />

          <MetricCard
            icon={<Trophy className="text-amber-600" size={24} />}
            label="Total Earnings"
            value={`$${(community.total_earnings / 1000).toFixed(1)}K`}
            change={`$${community.avg_member_earnings}`}
            changeLabel="avg per member"
            gradient="from-amber-500 to-yellow-500"
            animate={animateStats}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={24} />
                  Latest Posts
                </h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowCreatePostModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} />
                    Create Post
                  </button>
                  <button 
                    onClick={() => setShowViewAllPostsModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    View All
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white">
                    {/* Post Header - Clickable to expand/collapse */}
                    <div 
                      onClick={() => handleTogglePost(post.id)}
                      className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {post.authorAvatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                                {post.title}
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-400 transition-transform ${expandedPostId === post.id ? 'rotate-180' : ''}`}
                                />
                              </h3>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-600 font-medium">{post.author}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Preview when collapsed */}
                          {expandedPostId !== post.id && (
                            <p className="text-gray-700 line-clamp-2 leading-relaxed">{post.content}</p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-1.5">
                              <Heart size={16} />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MessageCircle size={16} />
                              <span>{post.replies} replies</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="ml-auto text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              Follow Discussion
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedPostId === post.id && (
                      <div className="border-t border-gray-200 animate-fadeIn">
                        {/* Full Post Content */}
                        <div className="p-5 bg-gray-50">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Heart size={16} />
                              <span>Like ({post.likes})</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <MessageCircle size={16} />
                              <span>Reply</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Share2 size={16} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {post.replyList && post.replyList.length > 0 && (
                          <div className="p-5 bg-white">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <MessageCircle size={18} className="text-blue-600" />
                              {post.replyList.length} {post.replyList.length === 1 ? 'Reply' : 'Replies'}
                            </h4>
                            
                            <div className="space-y-4">
                              {post.replyList.map((reply) => (
                                <div key={reply.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                    {reply.authorAvatar}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-semibold text-gray-900">{reply.author}</span>
                                      <span className="text-gray-400 text-xs">•</span>
                                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{reply.content}</p>
                                    <div className="flex items-center gap-4">
                                      <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition-colors">
                                        <Heart size={12} />
                                        <span>{reply.likes}</span>
                                      </button>
                                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Add Comment Form */}
                        <div className="p-5 bg-white border-t border-gray-200">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              YOU
                            </div>
                            <div className="flex-1">
                              <textarea
                                placeholder="Write a reply..."
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                              />
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add emoji">
                                    <Smile size={18} className="text-gray-600" />
                                  </button>
                                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Attach image">
                                    <Image size={18} className="text-gray-600" />
                                  </button>
                                </div>
                                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg">
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Story */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-purple-500" size={24} />
                  Community Growth Story
                </h2>
                <button 
                  onClick={() => setShowGrowthStory(!showGrowthStory)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                >
                  {showGrowthStory ? 'Hide' : 'View Timeline'}
                  <ChevronDown size={16} className={`transition-transform ${showGrowthStory ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.ceil((new Date() - new Date(community.created_at)) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs text-gray-600">Days Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{community.level}</div>
                  <div className="text-xs text-gray-600">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatNumber(community.total_members)}
                  </div>
                  <div className="text-xs text-gray-600">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">+{community.growth_rate}%</div>
                  <div className="text-xs text-gray-600">Growth Rate</div>
                </div>
              </div>

              {showGrowthStory && (
                <div className="space-y-4 animate-fadeIn">
                  {community.growthStory.map((milestone, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                          <Trophy size={18} className="text-white" />
                        </div>
                        {idx < community.growthStory.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{milestone.milestone}</h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            Level {milestone.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(milestone.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                          <span>•</span>
                          <span>{formatNumber(milestone.members)} members</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-amber-500" size={20} />
                  Top Contributors
                </h2>
                <button
                  onClick={() => setShowAllMembersModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                >
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {members.slice(0, 4).map((member, idx) => (
                  <MemberCard key={member.id} member={member} index={idx} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="text-cyan-500" size={20} />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all">
                    <div className="p-2 bg-white rounded-lg h-fit border border-gray-200">
                      {activity.type === 'post' && <FileText size={14} className="text-blue-600" />}
                      {activity.type === 'milestone' && <Trophy size={14} className="text-amber-600" />}
                      {activity.type === 'badge' && <Award size={14} className="text-purple-600" />}
                      {activity.type === 'join' && <UserPlus size={14} className="text-emerald-600" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        {activity.target && <span className="font-medium text-gray-900">{activity.target}</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</div>
                    </div>
                    
                    {activity.xp > 0 && (
                      <div className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-medium h-fit">
                        +{activity.xp}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart className="text-blue-600" size={20} />
                Quick Stats
              </h2>
              
              <div className="space-y-4">
                <StatItem
                  label="Total Posts"
                  value={formatNumber(community.total_posts)}
                  icon={<FileText size={16} className="text-blue-600" />}
                />
                <StatItem
                  label="Total Views"
                  value={formatNumber(community.total_views)}
                  icon={<Eye size={16} className="text-purple-600" />}
                />
                <StatItem
                  label="Total Likes"
                  value={formatNumber(community.total_likes)}
                  icon={<ThumbsUp size={16} className="text-rose-600" />}
                />
                <StatItem
                  label="Avg Response Time"
                  value={`${community.avg_response_time} hours`}
                  icon={<Clock size={16} className="text-emerald-600" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Members Modal - Full Screen with Light Design */}
      {showOnlineMembersModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 animate-fadeIn overflow-y-auto">
          <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowOnlineMembersModal(false)}
                      className="p-2 hover:bg-emerald-100 rounded-xl transition-all duration-300 hover:scale-110 group border border-emerald-200"
                    >
                      <ChevronLeft size={24} className="text-emerald-600 group-hover:text-emerald-700" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                          <Users className="text-white" size={24} />
                        </div>
                        Online Members
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <CircleDot size={12} className="text-emerald-500 animate-pulse" />
                          {formatNumber(members.filter(m => m.online).length)} members currently active
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOnlineMembersModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Home size={18} />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 animate-slideInFromBottom">
              {/* Search & Filter */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search online members..."
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-gray-900 placeholder-gray-400 shadow-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl font-medium transition-all flex items-center gap-2 text-gray-700 shadow-sm">
                  <Filter size={18} className="text-emerald-500" />
                  Filter
                </button>
              </div>

              {/* Online Members List - Light Design */}
              <div className="space-y-4">
                {members.filter(member => member.online).map((member, index) => {
                  const rankConfig = RANK_CONFIG[member.rank.toLowerCase()] || RANK_CONFIG.bronze;
                  
                  return (
                    <div 
                      key={member.id} 
                      className="relative bg-white backdrop-blur-sm rounded-2xl border-2 border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Decorative gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                      <div className="relative px-6 py-5 flex items-center gap-6">
                        {/* Avatar Section */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankConfig.gradient} p-0.5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                              <span className="text-lg font-bold text-gray-900">{member.avatar}</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                        </div>

                        {/* Name & Last Active */}
                        <div className="flex-shrink-0" style={{ width: '180px' }}>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                          <div className="text-xs text-gray-500">
                            <div>Last Active</div>
                            <div className="text-emerald-600 font-medium">{member.lastSeen}</div>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex-shrink-0" style={{ width: '120px' }}>
                          <div className="text-xs text-gray-500 mb-2">Role</div>
                          <div className="inline-flex px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-full text-sm font-medium text-gray-700 border border-emerald-200">
                            {member.role}
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="flex-1 grid grid-cols-3 gap-6">
                          {/* Posts/Articles */}
                          <div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {member.contributions > 500 ? `Articles ${Math.floor(member.contributions / 10)}` : `Posts: ${member.contributions}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Questions Answered: {Math.floor(member.contributions * 0.7)}
                            </div>
                            <div className="text-xs text-emerald-600 font-medium mt-0.5">
                              Score: {(member.reputation / 2000).toFixed(1)}/5
                            </div>
                          </div>

                          {/* Reputation */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Reputation</div>
                            <div className="text-xl font-bold text-emerald-600">
                              {formatNumber(member.reputation)}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${rankConfig.gradient}`}></div>
                              <span className="text-xs text-gray-500">{member.rank}</span>
                            </div>
                          </div>

                          {/* Level */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Level</div>
                            <div className="text-xl font-bold text-gray-900">
                              {member.level}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        {/* Communication Icons */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                          <button 
                            className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all hover:scale-110 border border-emerald-200 hover:border-emerald-300 group/btn shadow-sm hover:shadow-md"
                            title="Send Message"
                          >
                            <MessageCircle size={20} className="text-emerald-600 group-hover/btn:text-emerald-700 transition-colors" />
                          </button>
                          <button 
                            className="p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all hover:scale-110 border border-green-200 hover:border-green-300 group/btn shadow-sm hover:shadow-md"
                            title="Video Call"
                          >
                            <Video size={20} className="text-green-600 group-hover/btn:text-green-700 transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-8 py-4 bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl font-medium transition-all hover:shadow-lg flex items-center gap-2 mx-auto text-gray-700 shadow-sm">
                  Load More Members
                  <ChevronDown size={18} className="text-emerald-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View All Posts Modal - Full Screen */}
      {showViewAllPostsModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 animate-fadeIn overflow-y-auto">
          <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowViewAllPostsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group"
                    >
                      <ChevronLeft size={24} className="text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                          <MessageSquare className="text-white" size={24} />
                        </div>
                        All Discussions
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">{posts.length} active discussions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewAllPostsModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Home size={18} />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8 animate-slideInFromBottom">
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white">
                    <div 
                      onClick={() => handleTogglePost(post.id)}
                      className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {post.authorAvatar}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center gap-2">
                                {post.title}
                                <ChevronDown 
                                  size={20} 
                                  className={`text-gray-400 transition-transform ${expandedPostId === post.id ? 'rotate-180' : ''}`}
                                />
                              </h3>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-600 font-medium">{post.author}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">{post.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          
                          {expandedPostId !== post.id && (
                            <p className="text-gray-700 line-clamp-2 leading-relaxed">{post.content}</p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-1.5">
                              <Heart size={16} />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MessageCircle size={16} />
                              <span>{post.replies} replies</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="ml-auto text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                              {post.isFollowing ? 'Following' : 'Follow Discussion'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedPostId === post.id && (
                      <div className="border-t border-gray-200 animate-fadeIn">
                        <div className="p-5 bg-gray-50">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                          
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Heart size={16} />
                              <span>Like ({post.likes})</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <MessageCircle size={16} />
                              <span>Reply</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Share2 size={16} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

{/* Create Post Modal - Full Screen */}
{showCreatePostModal && (
  <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 animate-fadeIn overflow-y-auto">
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 group"
              >
                <ChevronLeft size={24} className="text-gray-600 group-hover:text-blue-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                    <Edit3 className="text-white" size={24} />
                  </div>
                  Create New Post
                </h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-500" />
                  Share your thoughts with the community
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Save size={18} />
                Save Draft
              </button>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Home size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 animate-slideInFromRight">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Edit3 size={16} className="text-blue-600" />
                  Post Title <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                  {postTitle.length}/120
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value.slice(0, 120))}
                  placeholder="What's on your mind?"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-lg bg-white shadow-sm hover:border-blue-300"
                  maxLength={120}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {postTitle.length > 0 && (
                    <CheckCircle size={20} className="text-green-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Edit3 size={16} className="text-purple-600" />
                  Content <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handlePreview}
                  className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye size={14} />
                  Preview
                </button>
              </div>

              {/* Formatting Toolbar */}
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 to-white">
                <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 p-1.5 bg-white rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleApplyFormatting('bold')}
                      className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                      title="Bold"
                    >
                      <Bold size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyFormatting('italic')}
                      className="p-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all"
                      title="Italic"
                    >
                      <Italic size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyFormatting('underline')}
                      className="p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all"
                      title="Underline"
                    >
                      <Underline size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 p-1.5 bg-white rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleApplyFormatting('insertUnorderedList')}
                      className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                      title="Bullet List"
                    >
                      <List size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyFormatting('insertOrderedList')}
                      className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                      title="Numbered List"
                    >
                      <ListOrdered size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 p-1.5 bg-white rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowLinkDialog(true)}
                      className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                      title="Insert Link"
                    >
                      <Link2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                      title="Upload Images"
                    >
                      <Image size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Upload Video"
                    >
                      <Video size={18} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all flex items-center gap-2 bg-white border border-gray-200"
                  >
                    <Smile size={18} />
                  </button>
                </div>

                <div
                  ref={contentEditableRef}
                  contentEditable
                  onInput={(e) => setPostContent(e.currentTarget.innerHTML)}
                  className="w-full min-h-[400px] px-6 py-4 focus:outline-none text-gray-800 prose max-w-none bg-white"
                  placeholder="Start writing your amazing content here..."
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    minHeight: '400px',
                    maxHeight: '600px',
                    overflowY: 'auto'
                  }}
                ></div>
              </div>

              {/* Media Previews */}
              {(selectedImages.length > 0 || selectedVideo) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Image size={18} className="text-green-600" />
                    Media Attachments
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                          <img
                            src={img}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {selectedVideo && (
                      <div className="relative group col-span-2">
                        <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-gray-900">
                          <video src={selectedVideo} controls className="w-full" />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={!postTitle.trim() || !postContent.trim()}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
          >
            <Send size={20} />
            Publish Post
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* All Members Modal - Full Screen with Light Design */}
      {showAllMembersModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 animate-fadeIn overflow-y-auto">
          <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-blue-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowAllMembersModal(false)}
                      className="p-2 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-110 group border border-blue-200"
                    >
                      <ChevronLeft size={24} className="text-blue-600 group-hover:text-blue-700" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                          <Users className="text-white" size={24} />
                        </div>
                        All Members
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatNumber(community.total_members)} total members • {formatNumber(members.filter(m => m.online).length)} online
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllMembersModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Home size={18} />
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 animate-slideInFromBottom">
              {/* Search & Filter */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search members by name, role, or rank..."
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 placeholder-gray-400 shadow-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl font-medium transition-all flex items-center gap-2 text-gray-700 shadow-sm">
                  <Filter size={18} className="text-blue-500" />
                  Filter
                </button>
              </div>

              {/* Members List - Light Design */}
              <div className="space-y-4">
                {members.map((member, index) => {
                  const rankConfig = RANK_CONFIG[member.rank.toLowerCase()] || RANK_CONFIG.bronze;
                  
                  return (
                    <div 
                      key={member.id} 
                      className="relative bg-white backdrop-blur-sm rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Decorative gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                      <div className="relative px-6 py-5 flex items-center gap-6">
                        {/* Avatar Section */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankConfig.gradient} p-0.5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                              <span className="text-lg font-bold text-gray-900">{member.avatar}</span>
                            </div>
                          </div>
                          {member.online && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white shadow-lg shadow-emerald-500/50 animate-pulse"></div>
                          )}
                        </div>

                        {/* Name & Last Active */}
                        <div className="flex-shrink-0" style={{ width: '180px' }}>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                          <div className="text-xs text-gray-500">
                            <div>Last Active</div>
                            <div className="text-blue-600 font-medium">{member.lastSeen}</div>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex-shrink-0" style={{ width: '120px' }}>
                          <div className="text-xs text-gray-500 mb-2">Role</div>
                          <div className="inline-flex px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm font-medium text-gray-700 border border-blue-200">
                            {member.role}
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="flex-1 grid grid-cols-3 gap-6">
                          {/* Posts/Articles */}
                          <div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {member.contributions > 500 ? `Articles ${Math.floor(member.contributions / 10)}` : `Posts: ${member.contributions}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Questions Answered: {Math.floor(member.contributions * 0.7)}
                            </div>
                            <div className="text-xs text-blue-600 font-medium mt-0.5">
                              Score: {(member.reputation / 2000).toFixed(1)}/5
                            </div>
                          </div>

                          {/* Reputation */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Reputation</div>
                            <div className="text-xl font-bold text-blue-600">
                              {formatNumber(member.reputation)}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${rankConfig.gradient}`}></div>
                              <span className="text-xs text-gray-500">{member.rank}</span>
                            </div>
                          </div>

                          {/* Level */}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Level</div>
                            <div className="text-xl font-bold text-gray-900">
                              {member.level}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Joined {new Date(member.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        {/* Communication Icons */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                          <button 
                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all hover:scale-110 border border-blue-200 hover:border-blue-300 group/btn shadow-sm hover:shadow-md"
                            title="Send Message"
                          >
                            <MessageCircle size={20} className="text-blue-600 group-hover/btn:text-blue-700 transition-colors" />
                          </button>
                          <button 
                            className="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all hover:scale-110 border border-purple-200 hover:border-purple-300 group/btn shadow-sm hover:shadow-md"
                            title="Video Call"
                          >
                            <Video size={20} className="text-purple-600 group-hover/btn:text-purple-700 transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-8 py-4 bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl font-medium transition-all hover:shadow-lg flex items-center gap-2 mx-auto text-gray-700 shadow-sm">
                  Load More Members
                  <ChevronDown size={18} className="text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkText('');
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertLink}
                  disabled={!linkUrl || !linkText}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
};

export default CommunityDashboard;