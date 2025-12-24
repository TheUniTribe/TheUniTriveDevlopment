import React, { useState } from "react";
import { NavigationSidebar } from "@/Components/NavigationSidebar";
import { PostCard } from "@/Components/PostCard";
import { AdCard } from "@/Components/AdCard";
import { QuestionForm } from "@/Components/QuestionForm";
import { TrendingTopics } from "@/Components/TrendingTopics";
import FilterBar from "@/Components/FilterBar";
import { PenSquare, Search, Filter, TrendingUp, Clock, Zap } from "lucide-react";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/Tabs";

const Question = () => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");

  const posts = [
    {
      id: 1,
      author: "John Mitchell",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      authorTitle: "Tech Lead @ Google",
      timestamp: "2h ago",
      content:
        "What are the most important skills for success in the modern workplace? Here's what I've learned after 20 years in tech...",
      upvotes: "1.2k",
      comments: "89",
      shares: "45",
      tags: ["career", "tech", "skills"],
      isBookmarked: false,
    },
    {
      id: 2,
      author: "Sarah Chen",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      authorTitle: "AI Researcher",
      timestamp: "4h ago",
      content: "The future of artificial intelligence is not what you think. Here's why...",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      upvotes: "2.5k",
      comments: "234",
      shares: "112",
      tags: ["ai", "future", "technology"],
      isBookmarked: true,
    },
    {
      id: 3,
      author: "Marcus Williams",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      authorTitle: "Leadership Coach",
      timestamp: "6h ago",
      content:
        "Nothing kills you faster than your own negative thoughts over things that are out of your control.",
      upvotes: "892",
      comments: "34",
      shares: "67",
      type: "quote",
      tags: ["mindset", "psychology"],
      isBookmarked: false,
    },
    {
      id: 4,
      author: "Emma Rodriguez",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      authorTitle: "Product Manager",
      timestamp: "8h ago",
      content:
        "Why do successful people wake up early? It's not what you think. The science behind morning routines explained...",
      upvotes: "3.1k",
      comments: "456",
      shares: "234",
      tags: ["productivity", "routine", "success"],
      isBookmarked: true,
    },
  ];

  const trendingTopics = [
    { name: "Artificial Intelligence", posts: "2.4k", trending: true },
    { name: "Remote Work", posts: "1.8k", trending: true },
    { name: "Career Growth", posts: "1.5k" },
    { name: "Mental Health", posts: "1.3k" },
    { name: "Web3", posts: "984", trending: true },
    { name: "Startup Advice", posts: "756" },
  ];

  const handleNewQuestion = (questionData) => {
    console.log("New question:", questionData);
    setShowQuestionForm(false);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Use flex-col on small screens and grid on large */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDEBAR */}
          <aside className="col-span-12 lg:col-span-2 w-full">

              {/* Row 1: Navigation */}
              <div className="w-full">
                <NavigationSidebar />
              </div>

         

          </aside>

          {/* MAIN CONTENT */}
          <main className="col-span-12 lg:col-span-7 space-y-6 w-full">
                   <TrendingTopics 
  topics={trendingTopics}
  compact={true}
  className="w-64"
/>
            {/* Header + Ask Button */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Questions</h1>
                  <p className="text-muted-foreground mt-1">
                    Ask questions, share knowledge, and connect with experts
                  </p>
                </div>
                <Button
                  onClick={() => setShowQuestionForm(true)}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <PenSquare className="h-4 w-4" />
                  Ask Question
                </Button>
              </div>

              {/* Search + Filter */}
              <div className="mt-4 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions, topics, or people..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Tabs & Posts */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="unanswered" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Unanswered
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex items-center gap-2">
                    Following
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 w-full">
            <div className="space-y-6 lg:sticky lg:top-8">
              <AdCard
                title="Spaces to follow"
                description="Discover communities that match your interests"
                ctaText="Explore Spaces"
              />
              <AdCard
                title="Premium Features"
                description="Get unlimited access to all content and features"
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
                ctaText="Try Premium"
              />
              <AdCard
                title="Top Writers Program"
                description="Join thousands of successful writers earning from their content"
                ctaText="Learn More"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <QuestionForm
              onSubmit={handleNewQuestion}
              onCancel={() => setShowQuestionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
