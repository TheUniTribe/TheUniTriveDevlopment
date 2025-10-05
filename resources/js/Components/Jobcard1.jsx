import React from "react";

const ROW_HEIGHT = "h-[50rem]"; // Set a fixed height for layout consistency

const JobCard1 = () => {
  return (
    <div className={`rounded-2xl px-4 py-6 flex items-center bg-gradient-to-r from-gray-100 via-gray-200 to-violet-100 ${ROW_HEIGHT}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full">
        {/* Tall image (left column) */}
        <div className="md:row-span-2 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
          <img
            src="https://picsum.photos/id/10/600/900"
            alt="Professional event"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* First small image (top right) */}
        <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src="https://picsum.photos/id/20/600/600"
            alt="Learning session"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Second small image (middle right) */}
        <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src="https://picsum.photos/id/30/600/600"
            alt="Tech workshop"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text content (bottom, spans 2 columns) */}
        <div className="md:col-span-2 bg-gray-50 p-8 rounded-xl shadow-lg h-full">
          <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Professional Learning Event
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Join our upcoming webinar series to learn from industry experts.
              Enhance your skills with hands-on workshops and network with professionals in your field.
              Our events are designed to provide practical knowledge you can apply immediately.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300">
              Explore Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard1;
