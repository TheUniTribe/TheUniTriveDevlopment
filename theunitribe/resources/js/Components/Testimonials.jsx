// src/components/Testimonials.js
import React from 'react';

const TestimonialCard = ({ name, role, company, quote }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
        <div className="ml-4">
          <div className="font-bold">{name}</div>
          <div className="text-gray-600 text-sm">{role}, {company}</div>
        </div>
      </div>
      <p className="text-gray-700 italic">"{quote}"</p>
      <div className="flex mt-4 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      quote: "InVideo has transformed our social media strategy. We can now create professional videos in minutes instead of days."
    },
    {
      name: "Michael Chen",
      role: "Content Creator",
      company: "Creative Media",
      quote: "The template library is incredible. I've stopped outsourcing video work completely since discovering InVideo."
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Bloom Florist",
      quote: "As someone with zero design experience, InVideo made it possible for me to create beautiful promotional videos myself."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">Millions</span> of Creators
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses and creators who use InVideo to create stunning videos daily.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12" />
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12" />
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12" />
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;