// components/ArticleCard.jsx
import React, { useState } from 'react';
import Reactions from '../Pages/Reactions';
import Comments from './Comments';

const ArticleCard = ({ article, viewMode, onReaction, onBookmark, onEdit, darkMode }) => {
  const [showComments, setShowComments] = useState(false);

  if (viewMode === 'list') {
    return <ArticleListCard article={article} onReaction={onReaction} onBookmark={onBookmark} />;
  }

  return (
    <article className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
      darkMode 
        ? 'bg-gray-800 shadow-lg hover:shadow-xl' 
        : 'bg-white shadow-md hover:shadow-lg'
    }`}>
      <div className="relative overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
            darkMode ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
          }`}>
            {article.category}
          </span>
        </div>

        <button
          onClick={() => onBookmark(article.id)}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
            article.isBookmarked 
              ? 'bg-red-500 text-white' 
              : darkMode 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-black/20 text-white hover:bg-black/30'
          }`}
        >
          {article.isBookmarked ? '🔴' : '⚪'}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium">{article.author.name}</span>
            {article.author.isVerified && (
              <span className="text-blue-500" title="Verified">✓</span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{article.readTime} min read</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map(tag => (
            <span key={tag} className={`px-2 py-1 rounded-lg text-xs ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Reactions
            article={article}
            onReaction={onReaction}
            darkMode={darkMode}
          />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
          >
            <span>💬</span>
            <span>42</span>
          </button>

          <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
            📤
          </button>

          {article.author.id === 'current-user' && (
            <button
              onClick={() => onEdit(article)}
              className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              ✏️
            </button>
          )}
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Comments articleId={article.id} darkMode={darkMode} />
          </div>
        )}
      </div>
    </article>
  );
};

const ArticleListCard = ({ article, onReaction, onBookmark }) => (
  <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-64 lg:flex-shrink-0">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 lg:h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {article.category}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{article.readTime} min read</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 text-lg">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="block font-medium text-gray-700">{article.author.name}</span>
              <span className="text-sm text-gray-500">Published Author</span>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-gray-500">
            <span className="flex items-center space-x-2">
              <span className="text-lg">👁️</span>
              <span>{article.views} views</span>
            </span>
            <span className="flex items-center space-x-2">
              <span className="text-lg">❤️</span>
              <span>{article.likes} likes</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
);

export default ArticleCard;