// data/mockData.js
export const mockCategories = [
  { id: 'technology', name: 'Technology', count: 45, color: 'blue', icon: '💻' },
  { id: 'design', name: 'Design', count: 32, color: 'purple', icon: '🎨' },
  { id: 'business', name: 'Business', count: 28, color: 'green', icon: '💼' },
  { id: 'lifestyle', name: 'Lifestyle', count: 19, color: 'pink', icon: '🌿' },
];

export const mockTrendingTags = [
  { name: 'react', count: 124 },
  { name: 'ai', count: 98 },
  { name: 'webdev', count: 76 },
  { name: 'typescript', count: 65 },
];

export const mockArticles = [
  {
    id: '1',
    title: 'The Future of Web Development in 2024: AI Integration and Beyond',
    excerpt: 'Exploring the latest trends and technologies shaping the future of web development, from AI integration to revolutionary new frameworks.',
    content: 'Full content here...',
    author: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      bio: 'Senior Web Developer at TechCorp',
      followers: 12450,
      isVerified: true
    },
    category: 'technology',
    tags: ['webdev', 'react', 'ai', 'trends', 'javascript'],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
    likes: 124,
    dislikes: 3,
    reactions: { '🔥': 15, '🎉': 8 },
    views: 2567,
    bookmarks: 42,
    featured: true,
    isBookmarked: false,
    isLiked: false,
    isDisliked: false
  },
  {
    id: '2',
    title: 'Mastering React Hooks: Best Practices for Modern Applications',
    excerpt: 'A comprehensive guide to using React Hooks effectively in production applications with real-world examples and performance tips.',
    content: 'Full content here...',
    author: {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'React Expert and Tech Writer',
      followers: 8900,
      isVerified: true
    },
    category: 'technology',
    tags: ['react', 'javascript', 'hooks', 'frontend'],
    publishedAt: '2024-01-12T14:30:00Z',
    readTime: 6,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
    likes: 89,
    dislikes: 1,
    reactions: { '❤️': 12, '👀': 5 },
    views: 1543,
    bookmarks: 23,
    featured: false,
    isBookmarked: true,
    isLiked: true,
    isDisliked: false
  }
];