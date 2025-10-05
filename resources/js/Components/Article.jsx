// components/ModernArticleLayout.jsx
import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';
import SideWidgets from './SideWidgets';
import ArticleEditor from './ArticleEditor';
import { mockArticles, mockCategories, mockTrendingTags } from '../data/mockData';

const Article = () => {
  const [articles, setArticles] = useState(mockArticles);
  const [categories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const filteredArticles = articles
    .filter(article => 
      (selectedCategory === 'all' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
       article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return (b.likes + b.views * 0.5 + b.bookmarks * 2) - (a.likes + a.views * 0.5 + a.bookmarks * 2);
        default:
          return 0;
      }
    });

  const handleReaction = (articleId, type) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const updated = { ...article };
        
        if (type === 'like') {
          updated.isLiked = !updated.isLiked;
          updated.likes += updated.isLiked ? 1 : -1;
          if (updated.isDisliked) {
            updated.isDisliked = false;
            updated.dislikes -= 1;
          }
        } else if (type === 'dislike') {
          updated.isDisliked = !updated.isDisliked;
          updated.dislikes += updated.isDisliked ? 1 : -1;
          if (updated.isLiked) {
            updated.isLiked = false;
            updated.likes -= 1;
          }
        } else {
          if (!updated.reactions) updated.reactions = {};
          updated.reactions[type] = (updated.reactions[type] || 0) + 1;
        }
        
        return updated;
      }
      return article;
    }));
  };

  const handleBookmark = (articleId) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { 
            ...article, 
            isBookmarked: !article.isBookmarked,
            bookmarks: article.bookmarks + (article.isBookmarked ? -1 : 1)
          }
        : article
    ));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      
      <TopBar 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewArticle={() => {
          setEditingArticle(null);
          setIsEditorOpen(true);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>

                <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-1">
                  {['grid', 'list', 'masonry'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === mode 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {mode === 'grid' ? '◼️' : mode === 'list' ? '☰' : '◊'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : viewMode === 'list' 
                ? 'space-y-6'
                : 'masonry-grid gap-6'
            }>
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  viewMode={viewMode}
                  onReaction={handleReaction}
                  onBookmark={handleBookmark}
                  onEdit={(article) => {
                    setEditingArticle(article);
                    setIsEditorOpen(true);
                  }}
                  darkMode={darkMode}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          <SideWidgets 
            articles={articles}
            trendingTags={mockTrendingTags}
            darkMode={darkMode}
          />
        </div>
      </div>

      {isEditorOpen && (
        <ArticleEditor
          article={editingArticle}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingArticle(null);
          }}
          onSave={(articleData) => {
            if (editingArticle) {
              setArticles(prev => prev.map(a => 
                a.id === editingArticle.id ? { ...a, ...articleData } : a
              ));
            } else {
              const newArticle = {
                ...articleData,
                id: Date.now().toString(),
                publishedAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                reactions: {},
                views: 0,
                bookmarks: 0,
                featured: false,
              };
              setArticles(prev => [newArticle, ...prev]);
            }
            setIsEditorOpen(false);
            setEditingArticle(null);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Article;