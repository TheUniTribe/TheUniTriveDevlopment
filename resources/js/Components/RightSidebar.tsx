import React from 'react';
import YourNetwork from './YourNetwork';
import UpcomingDeadlines from './UpcomingDeadlines';
import StudyResources from './StudyResources';

const RightSidebar: React.FC = () => {
  return (
    <aside className="space-y-6">
      <YourNetwork />
      <UpcomingDeadlines />
      <StudyResources />
    </aside>
  );
};

export default RightSidebar;