// components/SideWidgets.jsx
import React from 'react';

const SideWidgets = ({ articles, trendingTags, darkMode }) => {
  const trendingArticles = articles
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="lg:w-80 space-y-6">
      {/* Trending Tags */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-4">Trending Tags</h3>
        <div className="space-y-2">
          {trendingTags.map(tag => (
            <button
              key={tag.name}
              className={`flex justify-between items-center w-full p-3 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">#{tag.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Articles */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-4">Trending Articles</h3>
        <div className="space-y-4">
          {trendingArticles.map(article => (
            <div key={article.id} className="flex items-center space-x-3">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{article.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {article.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-purple-100 to-blue-100'} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm mb-4">Get the latest articles delivered to your inbox</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideWidgets;