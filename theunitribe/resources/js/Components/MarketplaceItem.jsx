// src/components/MarketplaceItem.js
import React from 'react';

const MarketplaceItem = ({ title, price, seller, distance }) => {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16"></div>
      <div className="ml-3">
        <div className="font-medium">{title}</div>
        <div className="font-bold text-indigo-600">{price}</div>
        <div className="text-xs text-gray-500">Posted by {seller} • {distance}</div>
      </div>
    </div>
  );
};

export default MarketplaceItem;