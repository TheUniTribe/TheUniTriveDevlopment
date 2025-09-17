/**
 * @file Templates.jsx
 * @description Reusable template components for displaying student network content layouts
 * @author Student Network Team
 * @version 2.0.1
 * 
 * This file contains a collection of responsive template layouts designed for
 * the student network platform. Each template showcases different aspects of
 * student life including networking, job opportunities, marketplace, and learning resources.
 * 
 * Major improvements:
 * - Added memoization for performance optimization
 * - Enhanced accessibility with ARIA attributes
 * - Implemented responsive height units
 * - Created gradient utility class
 * - Added image dimensions for CLS prevention
 * - Created button size variants
 * - Added error boundaries
 * - Implemented responsive images with srcset
 * - Improved semantic HTML structure
 * - Standardized button sizes and spacing
 * 
 * @requires React
 * @requires JobBoard - Component for displaying job listings
 * @requires PrimaryButton - Reusable button component
 * 
 * @component Templates
 * @returns {JSX.Element} A collection of template rows showcasing student network features
 */

import React, { memo, lazy, Suspense } from "react";
import PrimaryButton from "@/Components/PrimaryButton";

// Lazy load heavy components
const JobBoard = lazy(() => import("./JobBoard"));

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Template Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
          <h3 className="font-bold">Component Failed to Load</h3>
          <p>Please refresh the page or try again later</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Template height configuration
const TEMPLATE_HEIGHTS = {
  row1: "min-h-[28dvh] md:h-[28rem]",
  row2: "min-h-[45dvh] md:h-[45rem]",
  row3: "min-h-[28dvh] md:h-[28rem]",
  row4: "min-h-[28dvh] md:h-[28rem]",
  row5: "min-h-[40dvh] md:h-[40rem]",
  row6: "min-h-[28dvh] md:h-[28rem]",
  row7: "min-h-[28dvh] md:h-[28rem]"
};

/**
 * SectionHeader Component
 * @description Creates a centered section header with responsive typography
 * @component SectionHeader
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The header text content
 * @param {number} [props.level=2] - Heading level (1-6)
 * @returns {JSX.Element} Centered section header with responsive text sizing
 * 
 * @example
 * <SectionHeader>Connect with Confidence</SectionHeader>
 * <SectionHeader level={1}>Main Title</SectionHeader>
 */
const SectionHeader = memo(({ children, level = 2 }) => {
  const HeaderTag = `h${level}`;
  return (
    <header className="w-[90%] mx-auto text-center">
      <HeaderTag className="text-2xl md:text-4xl font-bold text-gray-800 tracking-wide">
        {children}
      </HeaderTag>
    </header>
  );
});

/**
 * TemplateRow Component
 * @description Creates a styled container row with gradient background and shadow
 * @component TemplateRow
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be displayed inside the row
 * @param {string} [props.className=""] - Additional CSS classes for customization
 * @returns {JSX.Element} Styled container with gradient background
 * 
 * @example
 * <TemplateRow className="h-[28rem]">
 *   <div>Row content here</div>
 * </TemplateRow>
 */
const TemplateRow = memo(({ children, className = "" }) => (
  <div className={`rounded-2xl bg-network-gradient shadow-xl overflow-hidden border border-gray-100/20 ${className}`}>
    {children}
  </div>
));

/**
 * ImageContainer Component
 * @description Responsive image container with lazy loading support
 * @component ImageContainer
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for accessibility
 * @param {string} [props.srcSet] - Responsive image sources
 * @param {string} [props.sizes] - Responsive image sizes
 * @param {string} [props.className=""] - Additional CSS classes for styling
 * @param {string} [props.role="img"] - ARIA role
 * @returns {JSX.Element} Responsive image container
 * 
 * @example
 * <ImageContainer 
 *   src="/images/example-400.jpg"
 *   srcSet="/images/example-400.jpg 400w, /images/example-800.jpg 800w"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   alt="Students collaborating" 
 *   className="h-full rounded-xl" 
 * />
 */
const ImageContainer = memo(({ 
  src, 
  alt, 
  srcSet, 
  sizes,
  className = "", 
  role = "img" 
}) => (
  <div 
    className={`overflow-hidden ${className} relative group`} 
    role={role}
  >
    <img 
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className="w-full h-full object-cover object-center filter brightness-105 contrast-110 saturate-110 transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      width="100%"
      height="100%"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
));

/**
 * Templates Component
 * @description Main component displaying 7 template rows showcasing student network features
 * @component Templates
 * @returns {JSX.Element} Complete template layout with all features
 */
const Templates = () => {
  return (
    <div className="w-[80%] pt-5 pb-10 mx-auto space-y-6 md:space-y-8">
      <SectionHeader>Connect with Confidence</SectionHeader>

      {/* Row 1: Student Networking Showcase */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row1}>
        <ErrorBoundary>
          <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            {/* Main Feature Image - 65% width */}
            <div className="md:w-[65%] h-full">
              <ImageContainer 
                src="/images/Office Collaboration Scene.png"
                alt="Students collaborating in a modern workspace with laptops and whiteboards" 
                className="h-full rounded-xl" 
              />
            </div>

            {/* Side Panel - 35% width */}
            <div className="md:w-[35%] h-full flex flex-col gap-4">
              <ImageContainer 
                src="/images/Creative Team Brainstorming Session.png"
                alt="Team meeting discussion with students sharing ideas" 
                className="h-[11rem] rounded-xl" 
              />
              <ImageContainer 
                src="/images/craiyon_033722_Investing.png"
                alt="Students working on laptops during investment workshop" 
                className="h-[11rem] rounded-xl" 
              />
              <div className="flex items-center justify-center mt-2">
                <PrimaryButton size="lg" className="px-8 py-3 text-lg">
                  Join Your Student Network
                </PrimaryButton>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      {/* Row 2: Discussion Forum Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row2}>
        <ErrorBoundary>
          <div className="h-[17rem] flex flex-col md:flex-row gap-4 pb-1 p-5">
            <div className="md:w-[40%] h-full">
              <ImageContainer 
                src="/images/Team Brainstorming Session.png"
                alt="Discussion Image showing students engaged in conversation" 
                className="h-full rounded-xl" 
              />
            </div>
            <div className="md:w-[60%] h-full items-center p-4">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Thought Network</h1>
              <p className="text-gray-800 text-base md:text-lg leading-relaxed">
                How to prepare for technical interviews at FAANG companies? Looking for advice on coding interview preparation. What resources did you find most helpful?
              </p>
            </div>
          </div>
          <div className="h-[28rem] flex flex-col md:flex-row gap-4 pt-0 p-4">
            <div className="md:w-[60%] h-full">
              <ImageContainer 
                src="/images/Flux_Dev_A_vibrant_and_dynamic_scene_depicting_a_group_of_stud_1.jpg"
                alt="Feature Image showing students working on innovative projects" 
                className="h-full rounded-xl" 
              />
            </div>
            <div className="md:w-[40%] h-full flex flex-col gap-4">
              <ImageContainer 
                src="/images/99.webp"
                alt="Supporting Image showing student collaboration" 
                className="h-[22rem] rounded-xl" 
              />
              <div className="flex items-center justify-center mt-2">
                <PrimaryButton size="lg" className="px-8 py-3 text-lg">
                  + New Post
                </PrimaryButton>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      {/* Row 3: Career Resources Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row3}>
        <ErrorBoundary>
          <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            <div className="md:w-[50%] h-full flex flex-col gap-4">
              <div className="h-[24rem] rounded-xl bg-transparent p-4 shadow-sm">
                <Suspense fallback={<div className="bg-gray-100 animate-pulse rounded-xl h-full" />}>
                  <JobBoard />
                </Suspense>
              </div>
            </div>
            <div className="md:w-[50%] h-full">
              <ImageContainer 
                src="/images/craiyon_031038_Can_you_generate_some_images_where_we_have_a_students_and_students_can_browse_jobs_and_internship_wh.png"
                alt="Career Resources showing students browsing job opportunities" 
                className="h-full rounded-xl" 
              />
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      {/* Row 4: Marketplace Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row4}>
        <ErrorBoundary>
          <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            {/* Column 1 – 2 Images */}
            <div className="md:w-[65%] h-full flex flex-col gap-4">
              <ImageContainer 
                src="/images/Marketplace primarily for students_to_sell_and_buy_various_items.jpg"
                alt="Student Marketplace showing buy and sell interface" 
                className="h-[13rem] rounded-xl" 
              />
              <ImageContainer 
                src="/images/studentsgroup.jpg"
                alt="Campus Events showing student community gathering" 
                className="h-[13rem] rounded-xl" 
              />
            </div>

            {/* Column 2 – Text, Stretching Image, Button */}
            <div className="md:w-[35%] h-full flex flex-col gap-4">
              <div className="bg-Transparent text-center rounded-xl shadow-sm">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Marketplace</h1>
                <p className="text-gray-700 text-lg text-center">
                  Buy and Sell made easy here with genuine people connecting with each other.
                </p>
              </div>
              <ImageContainer 
                src="/images/studentsgroup.jpg"
                alt="Student Marketplace community" 
                className="h-[16rem] rounded-xl" 
              />
              <div className="flex items-center justify-center mt-2">
                <PrimaryButton size="lg" className="px-8 py-3 text-lg">
                  + Sell Item
                </PrimaryButton>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      {/* Row 5: Learning Insights Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row5}>
        <ErrorBoundary>
          <div className="h-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-4 h-full">
              {/* First row - Column 1 (2/3 width) */}
              <div className="md:col-span-8 rounded-xl overflow-hidden">
                <ImageContainer 
                  src="/images/Office Collaboration Scene.png"
                  alt="Students collaborating in a modern workspace with laptops and whiteboards" 
                  className="h-full w-full" 
                />
              </div>

              {/* First row - Column 2 (1/3 width) */}
              <div className="md:col-span-4 rounded-xl overflow-hidden">
                <ImageContainer 
                  src="/images/Team Brainstorming Session.png"
                  alt="Team brainstorming session with students sharing ideas" 
                  className="h-full w-full" 
                />
              </div>

              {/* Second row - Column 1 (text column) */}
              <div className="md:col-span-4 rounded-xl p-6 flex flex-col justify-center shadow-inner">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Learning Insights</h1>
                <p className="text-gray-700">
                  Modern workspaces designed for collaboration enhance productivity and encourage knowledge sharing. These spaces are essential for preparing students for real-world professional environments.
                </p>
                <div className="flex items-center justify-center mt-4">
                  <PrimaryButton size="lg" className="px-8 py-3 text-lg">
                    Explore All Resources
                  </PrimaryButton>
                </div>
              </div>

              {/* Second row - Column 2 (image column) */}
              <div className="md:col-span-8 rounded-xl overflow-hidden">
                <ImageContainer 
                  src="/images/Team Brainstorming Session.png"
                  alt="Students developing cutting-edge projects in collaborative environment" 
                  className="h-full w-full" 
                />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      <SectionHeader level={1}>For Students with a Desire to Succeed</SectionHeader>

      {/* Row 6: Academic Resources Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row6}>
        <ErrorBoundary>
          <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            <div className="md:w-[50%] h-full">
              <ImageContainer 
                src="/images/craiyon_035333_Trading_forex.png"
                alt="Academic Resources showing forex trading education session" 
                className="h-full rounded-xl" 
              />
            </div>
            <div className="md:w-[50%] h-full">
              <ImageContainer 
                src="/images/craiyon_031225_Learning_Objectives__Demonstrate_Teaching_Fundamentals_Communicate_Ideas_Clearly_Engage_Learners.png"
                alt="Study Groups showing collaborative learning environment" 
                className="h-full rounded-xl" 
              />
            </div>
          </div>
        </ErrorBoundary>
      </TemplateRow>

      {/* Row 7: Campus Community Template */}
      <TemplateRow className={TEMPLATE_HEIGHTS.row7}>
        <ErrorBoundary>
          <div className="h-full p-4">
            <ImageContainer 
              src="/images/startupimage.webp"
              alt="Campus Community showing startup culture and entrepreneurship" 
              className="h-full rounded-xl" 
            />
          </div>
        </ErrorBoundary>
      </TemplateRow>
    </div>
  );
};

export default memo(Templates);