import React, { useState } from 'react';
import { Plus, Search, Filter, MapPin, MessageCircle, Heart } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const items = [
    {
      id: 1,
      title: 'MacBook Pro 13" M2',
      price: '$1,200',
      originalPrice: '$1,500',
      condition: 'Excellent condition, barely used',
      seller: 'Jamie Chen',
      location: '2 miles away',
      posted: '2 days ago',
      category: 'Electronics',
      images: ['MacBook Pro 2021'],
      description: 'Selling my MacBook Pro as I got a new one from work. Perfect condition, comes with original charger and box.',
      likes: 12,
      views: 45
    },
    {
      id: 2,
      title: 'CS Textbook Bundle',
      price: '$150',
      originalPrice: '$400',
      condition: 'Algorithms, Data Structures, Operating Systems',
      seller: 'Alex Rodriguez',
      location: '1.5 miles away',
      posted: '1 day ago',
      category: 'Textbooks',
      images: ['Textbooks'],
      description: 'Complete set of CS textbooks for sophomore year. All in great condition with minimal highlighting.',
      likes: 8,
      views: 23
    },
    {
      id: 3,
      title: 'Mini Fridge',
      price: '$80',
      originalPrice: '$120',
      condition: 'Perfect for dorm rooms',
      seller: 'Sam Wilson',
      location: '0.8 miles away',
      posted: '3 days ago',
      category: 'Furniture',
      images: ['Dorm Furniture'],
      description: 'Compact mini fridge, perfect for dorm rooms. Energy efficient and quiet operation.',
      likes: 5,
      views: 18
    },
    {
      id: 4,
      title: 'iPad Air',
      price: '$400',
      originalPrice: '$600',
      condition: 'Great for note-taking',
      seller: 'Taylor Kim',
      location: '1.2 miles away',
      posted: '1 week ago',
      category: 'Electronics',
      images: ['Electronics'],
      description: 'iPad Air with Apple Pencil included. Perfect for digital note-taking and studying.',
      likes: 15,
      views: 67
    },
    {
      id: 5,
      title: 'Study Desk',
      price: '$75',
      originalPrice: '$150',
      condition: 'Solid wood, good condition',
      seller: 'Morgan Davis',
      location: '3.2 miles away',
      posted: '5 days ago',
      category: 'Furniture',
      images: ['Furniture'],
      description: 'Spacious study desk with drawers. Moving out sale, must go this week!',
      likes: 3,
      views: 12
    },
    {
      id: 6,
      title: 'TI-84 Calculator',
      price: '$60',
      originalPrice: '$120',
      condition: 'Barely used, with case and manual',
      seller: 'Jordan Lee',
      location: '2.1 miles away',
      posted: '4 days ago',
      category: 'Electronics',
      images: ['Calculator'],
      description: 'TI-84 Plus CE calculator in excellent condition. Comes with protective case and manual.',
      likes: 7,
      views: 28
    }
  ];

  const categories = [
    'All Items',
    'Electronics',
    'Textbooks',
    'Furniture',
    'Clothing',
    'Sports Equipment',
    'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.toLowerCase().replace(' ', ''))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === category.toLowerCase().replace(' ', '')
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="$1000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Condition</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">New</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Like New</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Good</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Fair</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Campus Marketplace</h1>
              <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Sell Item</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                  <span className="text-gray-500">{item.images[0]}</span>
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                      {item.title}
                    </h3>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{item.price}</p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{item.originalPrice}</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{item.condition}</p>
                  <p className="text-xs text-gray-500 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    <span>{item.posted}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span>{item.likes} likes • {item.views} views</span>
                    </div>
                    <button className="flex items-center space-x-1 border border-blue-600 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                      <MessageCircle className="h-3 w-3" />
                      <span>Message</span>
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {item.seller.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{item.seller}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Items
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Selling Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>📸 Take clear, well-lit photos</p>
              <p>💰 Price competitively</p>
              <p>📝 Write detailed descriptions</p>
              <p>⚡ Respond quickly to messages</p>
              <p>🤝 Meet in safe, public places</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Popular This Week</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">Electronics</div>
                <div className="text-gray-600">45 new listings</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Textbooks</div>
                <div className="text-gray-600">32 new listings</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Furniture</div>
                <div className="text-gray-600">28 new listings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Safety Guidelines</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Meet in public places</p>
              <p>• Bring a friend when possible</p>
              <p>• Inspect items before buying</p>
              <p>• Use secure payment methods</p>
              <p>• Trust your instincts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;