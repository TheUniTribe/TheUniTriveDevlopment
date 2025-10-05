// Using direct URLs for images
const profileAvatar = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";
const profileCover = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop";

export const mockProfileData = {
  personal: {
    id: "user_123",
    name: "Alexandra Johnson",
    pronouns: "she/her",
    title: "Senior Product Designer & UX Strategist",
    bio: "Passionate about creating accessible, user-centered digital experiences that make a meaningful impact. I believe in the power of design to solve complex problems and bridge the gap between human needs and business goals.",
    avatar: profileAvatar,
    coverImage: profileCover,
    location: "San Francisco, CA, USA",
    email: "alexandra.johnson@email.com",
    phone: "+1 (555) 234-5678",
    website: "alexandrajohnson.design",
    dateOfBirth: "1990-03-15",
    nationality: "American",
    languages: ["English (Native)", "Spanish (Professional)", "French (Conversational)"],
    timezone: "PST (UTC-8)",
    social: {
      linkedin: "linkedin.com/in/alexandra-johnson-design",
      github: "github.com/alexjohnson-design",
      twitter: "@alexjohnsonux",
      instagram: "@alexdesigns",
      behance: "behance.net/alexandrajohnson",
      dribbble: "dribbble.com/alexjohnson"
    }
  },
  social: {
    linkedin: "linkedin.com/in/alexandra-johnson-design",
    github: "github.com/alexjohnson-design",
    twitter: "@alexjohnsonux",
    instagram: "@alexdesigns",
    behance: "behance.net/alexandrajohnson",
    dribbble: "dribbble.com/alexjohnson"
  },
  professional: {
    currentRole: "Senior Product Designer",
    company: "TechFlow Inc.",
    experience: "8+ years",
    industry: "Technology / SaaS",
    skills: [
      { name: "UI/UX Design", level: 95, endorsements: 28 },
      { name: "Product Strategy", level: 88, endorsements: 22 },
      { name: "User Research", level: 85, endorsements: 19 },
      { name: "Prototyping", level: 90, endorsements: 25 },
      { name: "Design Systems", level: 92, endorsements: 31 },
      { name: "Figma", level: 98, endorsements: 35 },
      { name: "Adobe Creative Suite", level: 85, endorsements: 18 },
      { name: "HTML/CSS", level: 75, endorsements: 14 }
    ],
    certifications: [
      { name: "Google UX Design Professional Certificate", issuer: "Google", date: "2023-01" },
      { name: "Certified Usability Analyst", issuer: "HFI", date: "2022-08" },
      { name: "Design Thinking Certification", issuer: "IDEO", date: "2021-11" }
    ]
  },
  reputation: {
    score: 2847,
    level: 9,
    breakdown: [
      { category: "Quality Contributions", points: 1250 },
      { category: "Community Engagement", points: 680 },
      { category: "Helpful Responses", points: 520 },
      { category: "Knowledge Sharing", points: 397 }
    ]
  },
  achievements: [
    {
      id: "top_contributor",
      name: "Top Contributor",
      icon: "🏆",
      description: "Recognized for outstanding community contributions",
      points: 500,
      dateEarned: "2024-01-15"
    },
    {
      id: "mentor_badge",
      name: "Design Mentor",
      icon: "🎓",
      description: "Helped 50+ designers grow their skills",
      points: 300,
      dateEarned: "2023-11-22"
    },
    {
      id: "innovator",
      name: "Innovation Leader",
      icon: "💡",
      description: "Shared groundbreaking design solutions",
      points: 250,
      dateEarned: "2023-09-08"
    },
    {
      id: "expert_reviewer",
      name: "Expert Reviewer",
      icon: "⭐",
      description: "Provided expert feedback on 100+ projects",
      points: 200,
      dateEarned: "2023-07-14"
    }
  ],
  stats: {
    posts: 156,
    connections: 847,
    groups: 23,
    endorsements: 192,
    profileViews: 3420
  },
  activity: [
    {
      id: "activity_1",
      type: "article",
      content: "Just published a comprehensive guide on 'Building Inclusive Design Systems' - covering accessibility best practices, color theory for inclusive palettes, and component architecture that serves everyone.",
      timestamp: "2024-01-20T10:30:00Z",
      engagement: { likes: 84, comments: 23, shares: 15, views: 1205 }
    },
    {
      id: "activity_2",
      type: "post",
      content: "Excited to share that our team's redesign of the mobile checkout flow resulted in a 34% increase in conversion rates! Sometimes the smallest UX improvements make the biggest impact. 📈",
      timestamp: "2024-01-18T14:45:00Z",
      engagement: { likes: 156, comments: 31, shares: 28, views: 2103 }
    },
    {
      id: "activity_3",
      type: "post",
      content: "What's your biggest challenge when conducting user research remotely? Looking to compile best practices for our upcoming workshop series. Drop your thoughts below! 👇",
      timestamp: "2024-01-16T09:15:00Z",
      engagement: { likes: 67, comments: 45, shares: 12, views: 876 }
    }
  ],
  connections: [
    {
      id: "conn_1",
      name: "Marcus Chen",
      role: "Product Manager",
      company: "InnovateCorp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 12,
      isConnected: true
    },
    {
      id: "conn_2",
      name: "Sophia Rodriguez",
      role: "UX Research Lead",
      company: "UserFirst Design",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 8,
      isConnected: true
    },
    {
      id: "conn_3",
      name: "David Kim",
      role: "Frontend Developer",
      company: "CodeCraft Studios",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 15,
      isConnected: true
    },
    {
      id: "conn_4",
      name: "Emily Watson",
      role: "Design Director",
      company: "Creative Labs",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 6,
      isConnected: false
    }
  ],
  groups: [
    {
      id: "group_1",
      name: "UX Professionals Network",
      description: "A community for UX designers, researchers, and strategists",
      members: 15420,
      role: "moderator",
      category: "Professional Development"
    },
    {
      id: "group_2",
      name: "Design Systems Guild",
      description: "Best practices and resources for design systems",
      members: 8900,
      role: "admin",
      category: "Design Systems"
    },
    {
      id: "group_3",
      name: "Accessibility Champions",
      description: "Making digital experiences accessible for everyone",
      members: 5230,
      role: "member",
      category: "Accessibility"
    }
  ]
};


