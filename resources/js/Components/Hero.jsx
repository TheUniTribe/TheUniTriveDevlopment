import React, { useEffect, useRef, useState } from 'react';

// Constants
const COLUMNS_VISIBLE = 5;
const AUTO_SLIDE_INTERVAL = 15000;
const COLUMN_GAP = 20;
const COLUMN_WIDTH = 200;
const DOUBLE_COLUMN_WIDTH = COLUMN_WIDTH * 2 + COLUMN_GAP;
const COLUMN_HEIGHT = 400;

// Slider images from public/images/slider directory
// pic1 to pic5 displayed first, remaining images shown randomly
const IMAGES = [
  '/images/slider/pic1.png',
  '/images/slider/pic2.png',
  '/images/slider/pic3.png',
  '/images/slider/pic4.png',
  '/images/slider/pic5.png',
  ...[
    '/images/slider/Generate some images where we are having the professinal learning event which is taking place for the students and professional for exmaple in finance tech and webinars where knowledge is getting shared and image c copy.png',
    '/images/slider/Generate some images where we are having the professinal learning event which is taking place for the students and professional for exmaple in finance tech and webinars where knowledge is getting shared and image c.png',
    '/images/slider/pic6.png',
    '/images/slider/pic7.png',
    '/images/slider/pic8.png',
    '/images/slider/pic9.png',
    '/images/slider/pic10.png',
    '/images/slider/pic11.png',
    '/images/slider/pic12.png',
    '/images/slider/pic13.png',
    '/images/slider/pic14.png',
     '/images/slider/pic15.png'
  ].sort(() => Math.random() - 0.5) // Randomize remaining images
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Generate columns based on available images
  const generateColumns = () => {
    const columns = [];
    let imageIndex = 0;
    let columnId = 0;
    
    while (imageIndex < IMAGES.length) {
      const isDouble = Math.random() < 0.3 && (imageIndex + 1) < IMAGES.length;
      console.log("isDouble", isDouble);
      const column = {
        id: columnId++,
        isDouble,
        images: isDouble
          ? [IMAGES[imageIndex], IMAGES[imageIndex + 1]]
          : [IMAGES[imageIndex]],
      };
      
      columns.push(column);
      imageIndex += isDouble ? 2 : 1;
    }
    console.log(columns);
    return columns;
  };

  const columns = useRef(generateColumns()).current;
  const TOTAL_COLUMNS = columns.length;

  // Calculate total width
  const totalWidth = columns.reduce(
    (sum, col) =>
      sum + (col.isDouble ? DOUBLE_COLUMN_WIDTH : COLUMN_WIDTH) + COLUMN_GAP,
    0
  );
  const visibleWidth = COLUMNS_VISIBLE * (COLUMN_WIDTH + COLUMN_GAP);
  const maxScroll = totalWidth - visibleWidth;
  const maxIndex = Math.floor(maxScroll / (COLUMN_WIDTH + COLUMN_GAP));

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [maxIndex]);

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === maxIndex;

  return (
    <div className="w-[85vw] mx-auto overflow-hidden relative">
      <div
        ref={sliderRef}
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          gap: `${COLUMN_GAP}px`,
          transform: `translateX(-${currentIndex * (COLUMN_WIDTH + COLUMN_GAP)}px)`,
        }}
      >
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md"
            style={{
              width: col.isDouble ? DOUBLE_COLUMN_WIDTH : COLUMN_WIDTH,
              height: COLUMN_HEIGHT,
              display: 'flex',
              flexDirection: col.isDouble ? 'column' : 'row',
              gap: col.isDouble ? '20px' : 0,
            }}
          >
            {col.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Slide ${col.id}-${idx}`}
                className="w-full object-cover transition-transform duration-500 hover:scale-105 rounded-lg"
                style={{
                  height: col.isDouble ? '50%' : '100%',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      {!isAtStart && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {!isAtEnd && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Hero;
