// src/components/Pricing.js
import React from 'react';

const PricingCard = ({ title, price, description, features, isPopular }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isPopular ? 'border-2 border-blue-500 relative' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <ul className="mb-8 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        
        <button className={`w-full py-3 px-4 rounded-lg font-bold ${
          isPopular 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}>
          Get Started
        </button>
      </div>
    </div>
  );
};

const Pricing = () => {
  const plans = [
    {
      title: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "Access to 5000+ templates",
        "10 mins/week of AI generation",
        "Up to 4 exports per week",
        "Watermark on exports"
      ],
      isPopular: false
    },
    {
      title: "Business",
      price: 20,
      description: "For professionals and businesses",
      features: [
        "Unlimited exports",
        "No watermark",
        "60 mins/week of AI generation",
        "Premium templates",
        "Priority support"
      ],
      isPopular: true
    },
    {
      title: "Unlimited",
      price: 48,
      description: "For agencies and power users",
      features: [
        "Unlimited AI generation",
        "Unlimited premium templates",
        "Team collaboration",
        "Custom branding",
        "Dedicated account manager"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-blue-600">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include our powerful video editor.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Need custom solutions? <a href="#" className="text-blue-600 font-bold">Contact our sales team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;