// src/components/Features.js
import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="text-blue-600 mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: '🎬',
      title: '5000+ Templates',
      description: 'Professionally designed templates for every occasion and industry.'
    },
    {
      icon: '🎥',
      title: 'AI Video Creation',
      description: 'Create videos instantly with AI by simply typing your idea.'
    },
    {
      icon: '🔄',
      title: 'Automated Workflows',
      description: 'Automatically resize videos for different platforms with one click.'
    },
    {
      icon: '🤝',
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time on video projects.'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Create <span className="text-blue-600">Stunning Videos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            InVideo provides all the tools and features to create professional videos quickly and easily.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        <div className="mt-20 flex justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
        </div>
      </div>
    </div>
  );
};

export default Features;