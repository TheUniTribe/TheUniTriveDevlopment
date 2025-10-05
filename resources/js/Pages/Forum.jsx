import React, { useState, useEffect, useMemo } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaComments, FaFilter, FaTimes, FaSort, FaArrowRight, FaStar, FaUserAlt } from 'react-icons/fa';

const Forum = () => {
  const { forums: initialForums, flash = {} } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeForum, setActiveForum] = useState(null);

  const form = useForm({
    title: '',
    description: '',
    category: 'general',
  });

  const categories = [
    { id: 'student', name: 'Student Discussions', color: 'bg-blue-100 text-blue-800', icon: '🎓' },
    { id: 'professional', name: 'Professional Network', color: 'bg-green-100 text-green-800', icon: '💼' },
    { id: 'general', name: 'General Discussion', color: 'bg-gray-100 text-gray-800', icon: '💬' },
    { id: 'career', name: 'Career Advice', color: 'bg-purple-100 text-purple-800', icon: '🚀' },
    { id: 'academic', name: 'Academic Help', color: 'bg-yellow-100 text-yellow-800', icon: '📚' },
    { id: 'events', name: 'Events & Meetups', color: 'bg-red-100 text-red-800', icon: '🎉' },
  ];

  // Memoized filtered and sorted forums
  const filteredForums = useMemo(() => {
    let result = [...initialForums] || [];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(forum => forum.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(forum =>
        forum.title.toLowerCase().includes(term) ||
        (forum.description && forum.description.toLowerCase().includes(term))
      );
    }

    // Sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'popular':
        result.sort((a, b) => (b.comments || 0) - (a.comments || 0));
        break;
      case 'trending':
        // Simple trending calculation (comments per day since creation)
        result.sort((a, b) => {
          const aDays = Math.max(1, Math.floor((new Date() - new Date(a.created_at)) / (1000 * 60 * 60 * 24)));
          const bDays = Math.max(1, Math.floor((new Date() - new Date(b.created_at)) / (1000 * 60 * 60 * 24)));
          const aTrend = (a.comments || 0) / aDays;
          const bTrend = (b.comments || 0) / bDays;
          return bTrend - aTrend;
        });
        break;
      default:
        break;
    }

    return result;
  }, [initialForums, searchTerm, selectedCategory, sortOption]);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      totalForums: initialForums.length,
      totalComments: initialForums.reduce((sum, forum) => sum + (forum.comments || 0), 0),
      distinctCategories: new Set(initialForums.map(f => f.category)).size,
      topContributor: initialForums.reduce((acc, forum) => {
        if (!acc || forum.comments > acc.comments) return forum;
        return acc;
      }, null),
    };
  }, [initialForums]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      form.put(route('forums.update', editingId), {
        onSuccess: () => {
          resetForm();
          setIsFormOpen(false);
        },
      });
    } else {
      form.post(route('forums.store'), {
        onSuccess: () => {
          resetForm();
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (forum) => {
    form.setData({
      title: forum.title,
      description: forum.description || '',
      category: forum.category || 'general',
    });
    setEditingId(forum.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this forum?")) {
      Inertia.delete(route('forums.destroy', id));
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingId(null);
    setIsFormOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortOption('newest');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <div className="bg-blue-600 text-white p-3 rounded-xl mr-3">
              <FaComments className="text-xl" />
            </div>
            Community Forums
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Connect with students, professionals, and mentors. Share knowledge, ask questions, and grow together.
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          <FaPlus className="text-sm" /> Create New Forum
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-700">{stats.totalForums}</div>
          <div className="text-gray-600 mt-1">Total Forums</div>
          <div className="w-12 h-1 bg-blue-200 rounded-full mt-3"></div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 shadow-sm">
          <div className="text-3xl font-bold text-green-700">{stats.totalComments}</div>
          <div className="text-gray-600 mt-1">Total Comments</div>
          <div className="w-12 h-1 bg-green-200 rounded-full mt-3"></div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100 shadow-sm">
          <div className="text-3xl font-bold text-purple-700">{stats.distinctCategories}</div>
          <div className="text-gray-600 mt-1">Categories</div>
          <div className="w-12 h-1 bg-purple-200 rounded-full mt-3"></div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center mr-3">
              <FaUserAlt className="text-gray-500" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">{stats.topContributor?.user?.name || 'Community'}</div>
              <div className="text-gray-600 text-sm">Top Contributor</div>
            </div>
          </div>
          <div className="w-12 h-1 bg-amber-200 rounded-full mt-3"></div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forums, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaFilter />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaSort />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
        
        {(searchTerm || selectedCategory !== 'all' || sortOption !== 'newest') && (
          <div className="mt-4 flex items-center">
            <span className="text-gray-600 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-sm flex items-center">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              
              {selectedCategory !== 'all' && (
                <div className="bg-purple-50 text-purple-700 py-1 px-3 rounded-full text-sm flex items-center">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
              
              {sortOption !== 'newest' && (
                <div className="bg-amber-50 text-amber-700 py-1 px-3 rounded-full text-sm flex items-center">
                  Sort: {sortOption === 'oldest' ? 'Oldest First' : 
                         sortOption === 'popular' ? 'Most Popular' : 'Trending'}
                  <button 
                    onClick={() => setSortOption('newest')}
                    className="ml-2 text-amber-500 hover:text-amber-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={clearFilters}
              className="ml-auto text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Flash messages */}
      <Transition
        show={!!flash.success}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="mb-6"
      >
        <div className="p-4 bg-green-100 text-green-700 rounded-xl border border-green-200 shadow-sm">
          {flash.success}
        </div>
      </Transition>

      {form.errors.title && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200">
          {form.errors.title}
        </div>
      )}

      {/* Category tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Forums
          </button>
          
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-3 rounded-xl flex items-center whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? `${cat.color} shadow-md font-medium` 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Create/Edit Forum Form */}
      <Transition
        show={isFormOpen}
        enter="transition duration-300 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? "Edit Forum" : "Create New Forum"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive title for your forum"
                value={form.data.title}
                onChange={e => form.setData('title', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Provide details about the discussion topic..."
                value={form.data.description}
                onChange={e => form.setData('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => form.setData('category', cat.id)}
                    className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      form.data.category === cat.id
                        ? `border-blue-500 bg-blue-50 text-blue-700 shadow-inner ${cat.color}`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.processing}
                className={`px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center ${
                  form.processing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {form.processing ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {editingId ? "Update Forum" : "Create Forum"}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      {/* Forums grid */}
      {filteredForums.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-5 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No forums found</h3>
          <p className="text-gray-500 mb-8 max-w-md">
            {searchTerm
              ? `We couldn't find any forums matching "${searchTerm}"`
              : "There are no forums in this category yet. Be the first to start a discussion!"}
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center"
          >
            Clear filters and view all forums
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredForums.map(forum => {
            const categoryInfo = categories.find(c => c.id === forum.category) || categories[0];
            const isPopular = forum.comments > 10;
            const isNew = (new Date() - new Date(forum.created_at)) < 1000 * 60 * 60 * 24 * 2; // Less than 2 days old
            
            return (
              <div 
                key={forum.id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center ${categoryInfo.color} text-sm font-medium py-1.5 px-3 rounded-full`}>
                      <span className="mr-1.5">{categoryInfo.icon}</span> {categoryInfo.name}
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(forum)}
                        className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50"
                        aria-label="Edit forum"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(forum.id)}
                        className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50"
                        aria-label="Delete forum"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{forum.title}</h3>
                  <p className="text-gray-600 mb-5 line-clamp-2">{forum.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {isPopular && (
                      <span className="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        <FaStar className="mr-1 text-amber-500" size={10} /> Popular
                      </span>
                    )}
                    {isNew && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {forum.comments > 5 && (
                      <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        Active discussion
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center mr-2">
                        <FaUserAlt className="text-gray-500" size={12} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">{forum.user?.name || 'Anonymous'}</div>
                        <div>{timeSince(forum.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <FaComments className="mr-1.5 text-gray-400" />
                      <span className="font-medium text-gray-700">{forum.comments}</span>
                      <span className="ml-1">comments</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <button 
                    onClick={() => setActiveForum(activeForum?.id === forum.id ? null : forum)}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                  >
                    View discussion
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Featured forum section */}
      {filteredForums.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Discussions</h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredForums.slice(0, 3).map(forum => {
              const categoryInfo = categories.find(c => c.id === forum.category) || categories[0];
              return (
                <div key={`featured-${forum.id}`} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center ${categoryInfo.color} text-xs font-medium py-1 px-2.5 rounded-full`}>
                      {categoryInfo.icon} {categoryInfo.name}
                    </div>
                    <button className="text-gray-400 hover:text-blue-600">
                      <FaStar />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{forum.title}</h3>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2">{forum.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-blue-100">
                    <div className="text-gray-500 text-sm">
                      <FaComments className="inline mr-1.5 -mt-1" /> {forum.comments} comments
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      Join discussion
                      <FaArrowRight className="ml-1 text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Community call to action */}
      <div className="mt-16 mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Join the conversation</h2>
        <p className="max-w-2xl mx-auto mb-6 text-blue-100">
          Our community is growing every day. Share your knowledge, ask questions, and connect with like-minded individuals.
        </p>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-xl shadow-lg transition-all inline-flex items-center"
        >
          <FaPlus className="mr-2" /> Start a new discussion
        </button>
      </div>
    </div>
  );
};

export default Forum;