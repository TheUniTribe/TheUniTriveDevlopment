import React from 'react';
import { Plus } from 'lucide-react';

interface MarketplaceSectionProps {
  onViewAll?: () => void;
  onSellItem?: () => void;
}

const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ onViewAll, onSellItem }) => {
  const items = [
    {
      title: 'MacBook Pro 13" M2',
      price: '$1,200',
      condition: 'Excellent condition, barely used',
      seller: 'Posted by Jamie • 2 miles away',
      image: 'MacBook Pro 2021'
    },
    {
      title: 'CS Textbook Bundle',
      price: '$150',
      condition: 'Algorithms, Data Structures, Operating Systems',
      seller: 'Posted by Alex • 1.5 miles away',
      image: 'Textbooks'
    },
    {
      title: 'Mini Fridge',
      price: '$80',
      condition: 'Perfect for dorm rooms',
      seller: 'Posted by Sam • 0.8 miles away',
      image: 'Dorm Furniture'
    },
    {
      title: 'iPad Air',
      price: '$400',
      condition: 'Great for note-taking',
      seller: 'Posted by Taylor • 1.2 miles away',
      image: 'Electronics'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Student Marketplace</h2>
        <button 
          onClick={onSellItem}
          className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Sell Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">{item.image}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xl font-bold text-gray-900 mb-2">{item.price}</p>
              <p className="text-sm text-gray-600 mb-2">{item.condition}</p>
              <p className="text-xs text-gray-500">{item.seller}</p>
              <div className="flex space-x-2 mt-3">
                <button 
                  onClick={onViewAll}
                  className="flex-1 border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  View
                </button>
                <button 
                  onClick={onSellItem}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Marketplace Button */}
      <div className="text-center mt-8">
        <button 
          onClick={onViewAll}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View All Marketplace
        </button>
      </div>
    </section>
  );
};

export default MarketplaceSection;