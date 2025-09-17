import React from 'react';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import MainFeed from '../Components/MainFeed';
import RightSidebar from '../Components/RightSidebar';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          
          <div className="flex-1 min-w-0">
            <MainFeed />
          </div>
          
          <div className="w-80 flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;