import React from 'react';
import HeroSection from './HeroSection';
import RecommendedGroups from './RecommendedGroups';
import PopularDiscussions from './PopularDiscussions';

const MainFeed: React.FC = () => {
  return (
    <div className="space-y-6">
      <HeroSection />
      <RecommendedGroups />
      <PopularDiscussions />
    </div>
  );
};

export default MainFeed;