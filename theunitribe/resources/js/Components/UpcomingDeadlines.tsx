import React from 'react';

const UpcomingDeadlines: React.FC = () => {
  const deadlines = [
    { title: 'Scholarship Application', date: 'Due May 30, 2025' },
    { title: 'Summer Internship Deadline', date: 'Due June 15, 2025' }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div key={index} className="border-l-4 border-red-500 pl-3">
            <div className="font-medium text-gray-900 text-sm">{deadline.title}</div>
            <div className="text-xs text-gray-600">{deadline.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;