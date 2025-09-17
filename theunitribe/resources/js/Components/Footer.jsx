// src/components/Footer.js
import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Send,
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  Heart
} from 'lucide-react';

// Enhanced Tooltip Component with better positioning
const Tooltip = ({ children, content, position = "right" }) => {
  const [visible, setVisible] = useState(false);
  
  // Position classes based on the position prop
  const positionClasses = {
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2"
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`absolute z-50 ${positionClasses[position]} transition-opacity duration-200`}>
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl max-w-xs w-max">
            <div className="font-medium">{content}</div>
            <div className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 ${
              position === "right" ? "-left-1 top-1/2 -translate-y-1/2" :
              position === "left" ? "-right-1 top-1/2 -translate-y-1/2" :
              position === "top" ? "bottom-0 left-1/2 -translate-x-1/2 -mb-1" :
              "top-0 left-1/2 -translate-x-1/2 -mt-1"
            }`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  const studentLinks = [
    {
      text: 'Find Study Groups',
      icon: <Users size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Connect with peers studying similar courses and prepare together through virtual or in-person study sessions.'
    },
    {
      text: 'Career Services',
      icon: <Briefcase size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Explore resume workshops, interview preparation, and career counseling services tailored for student development.'
    },
    {
      text: 'Campus Events',
      icon: <GraduationCap size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Stay updated on academic conferences, networking events, workshops, and social gatherings happening on campus.'
    },
    {
      text: 'Student Resources',
      icon: <BookOpen size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Access learning materials, research databases, writing centers, and academic support services.'
    },
    {
      text: 'Internship Portal',
      icon: <Briefcase size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Browse and apply for internship opportunities from companies specifically looking for student talent.'
    }
  ];

  const supportLinks = [
    {
      text: 'Help Center',
      icon: <BookOpen size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Find answers to frequently asked questions and get guidance on using TheUniTribe platform effectively.'
    },
    {
      text: 'Contact Support',
      icon: <Mail size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Reach out to our dedicated support team for personalized assistance with any issues or questions.'
    },
    {
      text: 'Community Guidelines',
      icon: <Users size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Understand the values and behaviors expected from all community members to ensure a positive environment.'
    },
    {
      text: 'Privacy Policy',
      icon: <BookOpen size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Learn how we collect, use, and protect your personal information in compliance with data protection regulations.'
    },
    {
      text: 'Terms of Service',
      icon: <BookOpen size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Review the legal agreements that govern your use of TheUniTribe platform and services.'
    },
    {
      text: 'Report Issue',
      icon: <BookOpen size={16} className="mr-2 flex-shrink-0" />,
      tooltip: 'Notify us about technical problems, inappropriate content, or violations of community guidelines.'
    }
  ];

  const socialMedia = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/theunitribe', color: '#1877F2' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/theunitribe', color: '#1DA1F2' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/theunitribe', color: '#E1306C' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/theunitribe', color: '#0077B5' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/theunitribe', color: '#FF0000' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-900 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-800 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-transparent border-2 border-blue-500/20 rounded-lg rotate-12"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-transparent border-2 border-indigo-500/20 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-transparent border-2 border-blue-500/20 rotate-45"></div>
      </div>

      {/* Wave Divider */}
      <div className="w-full h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -translate-y-1"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-4 shadow-lg">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 bg-clip-text text-transparent">
                  TheUniTribe
                </h3>
              </div>
              <p className="text-gray-300 text-base leading-relaxed max-w-lg">
                Empowering students worldwide through meaningful connections, career opportunities,
                and academic excellence. Join thousands of students building their future together.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                <div className="p-2 rounded-full bg-gray-800 flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">support@theunitribe.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                <div className="p-2 rounded-full bg-gray-800 flex-shrink-0">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                <div className="p-2 rounded-full bg-gray-800 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm">San Francisco, CA 94105</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              {socialMedia.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="bg-gray-800 p-3 rounded-full hover:scale-110 transition-all duration-300 relative overflow-hidden group"
                  onMouseEnter={() => setHoveredSocial(label)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{ 
                    background: hoveredSocial === label ? color : '',
                    transform: hoveredSocial === label ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <Icon className="h-5 w-5 text-white" />
                  <div 
                    className={`absolute inset-0 bg-white/10 rounded-full scale-0 transition-transform duration-300 ${
                      hoveredSocial === label ? 'scale-150' : ''
                    }`}
                  ></div>
                </a>
              ))}
            </div>
          </div>

          {/* For Students Section */}
          <div>
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-indigo-600/30 flex items-center">
              <Users className="mr-2 text-indigo-400" size={20} />
              For Students
            </h4>
            <ul className="space-y-3">
              {studentLinks.map((link, index) => (
                <li key={index}>
                  <Tooltip content={link.tooltip} position="top">
                    <a
                      href="#"
                      className="flex items-center text-gray-300 hover:text-indigo-300 transition-all duration-200 group py-1"
                    >
                      {link.icon}
                      <span className="transition-all group-hover:translate-x-1">{link.text}</span>
                    </a>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal Section */}
          <div>
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-indigo-600/30 flex items-center">
              <BookOpen className="mr-2 text-indigo-400" size={20} />
              Support & Legal
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Tooltip content={link.tooltip} position="right">
                    <a
                      href="#"
                      className="flex items-center text-gray-300 hover:text-indigo-300 transition-all duration-200 group py-1"
                    >
                      {link.icon}
                      <span className="transition-all group-hover:translate-x-1">{link.text}</span>
                    </a>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-xl border border-indigo-800/30 backdrop-blur-sm">
              <h4 className="text-lg font-bold mb-4 flex items-center">
                <Send className="mr-2 text-indigo-400" size={20} />
                Stay Updated
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for the latest updates, resources, and opportunities.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-gray-800 border border-indigo-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                {submitted && (
                  <div className="text-green-400 text-sm py-2 flex items-center animate-pulse">
                    <Heart className="mr-2" size={16} />
                    Thank you for subscribing!
                  </div>
                )}
              </form>
              
              <p className="text-gray-500 text-xs mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TheUniTribe. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">Cookie Policy</a>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="mt-4 md:mt-0 flex items-center space-x-1 bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 hover:text-white px-4 py-2 rounded-full transition-all duration-300 group"
          >
            <span className="group-hover:-translate-y-0.5 transition-transform">Back to Top</span>
            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;