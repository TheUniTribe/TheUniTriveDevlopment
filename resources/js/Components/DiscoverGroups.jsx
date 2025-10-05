import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * DiscoverGroups Component
 * 
 * A comprehensive community discovery interface with filtering, search, and group management.
 * Features include:
 * - Category and subcategory browsing with horizontal scrolling
 * - Tag-based filtering system
 * - Advanced search functionality
 * - Modal-based creation forms
 * - Responsive design with Tailwind CSS
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.showAddButtons - Controls visibility of all add buttons
 * @param {boolean} props.enableCategoryCreation - Enable/disable category creation
 * @param {boolean} props.enableSubcategoryCreation - Enable/disable subcategory creation
 * @param {boolean} props.enableTagCreation - Enable/disable tag creation
 * @param {boolean} props.enableGroupCreation - Enable/disable group creation
 * @param {Function} props.onGroupJoin - Callback when user joins a group
 * @param {Function} props.onGroupLeave - Callback when user leaves a group
 * @param {Array} props.customCategories - Custom categories to extend default ones
 * @param {Array} props.customGroups - Custom groups to extend default ones
 * @returns {JSX.Element} DiscoverGroups component
 */
const DiscoverGroups = ({
  showAddButtons = true,
  enableCategoryCreation = true,
  enableSubcategoryCreation = true,
  enableTagCreation = true,
  enableGroupCreation = true,
  onGroupJoin = () => {},
  onGroupLeave = () => {},
  customCategories = [],
  customGroups = []
}) => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});

  // Refs for horizontal scrolling
  const categoriesRef = useRef(null);
  const subcategoriesRef = useRef(null);
  const tagsRef = useRef(null);

  // Form states
  const [interestForm, setInterestForm] = useState({ name: "", description: "" });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: "", category: "" });
  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
    privacy: "Public",
    category: "",
  });

  // Default sample data with subcategory icons
  const defaultCategories = [
    { id: 1, name: "Technology", subcategories: 12, icon: "💻", color: "bg-blue-100 text-blue-800", trending: true, members: 125000 },
    { id: 2, name: "Arts & Design", subcategories: 8, icon: "🎨", color: "bg-purple-100 text-purple-800", trending: false, members: 84500 },
    { id: 3, name: "Fitness", subcategories: 6, icon: "💪", color: "bg-green-100 text-green-800", trending: true, members: 97800 },
    { id: 4, name: "Education", subcategories: 15, icon: "📚", color: "bg-red-100 text-red-800", trending: false, members: 156000 },
    { id: 5, name: "Music", subcategories: 9, icon: "🎵", color: "bg-yellow-100 text-yellow-800", trending: true, members: 112300 },
    { id: 6, name: "Gaming", subcategories: 7, icon: "🎮", color: "bg-indigo-100 text-indigo-800", trending: true, members: 137500 },
    { id: 7, name: "Business", subcategories: 11, icon: "💼", color: "bg-gray-100 text-gray-800", trending: false, members: 89500 },
    { id: 8, name: "Food & Cooking", subcategories: 10, icon: "🍳", color: "bg-orange-100 text-orange-800", trending: true, members: 102400 },
  ];

  // Combine default categories with custom ones
  const categories = useMemo(() => {
    return [...defaultCategories, ...customCategories];
  }, [customCategories]);

  // Updated category details with subcategory icons and proper tag associations
  const categoryDetails = {
    Technology: {
      subcategories: [
        { name: "Web Development", icon: "🌐", tags: ["React", "JavaScript", "Node.js", "Frontend"] },
        { name: "Mobile Apps", icon: "📱", tags: ["Swift", "Kotlin", "React Native", "Flutter"] },
        { name: "AI/ML", icon: "🤖", tags: ["TensorFlow", "Python", "Neural Networks", "Data Science"] },
        { name: "Data Science", icon: "📊", tags: ["Python", "R", "SQL", "Visualization"] },
        { name: "DevOps", icon: "🔄", tags: ["AWS", "Docker", "Kubernetes", "CI/CD"] },
        { name: "Cybersecurity", icon: "🔒", tags: ["Security", "Encryption", "Pen Testing", "Network"] },
      ],
      tags: ["React", "JavaScript", "Node.js", "Frontend", "Python", "UI/UX", "AWS", "Docker", "Kubernetes", "TensorFlow", "Swift", "Kotlin"],
    },
    "Arts & Design": {
      subcategories: [
        { name: "Digital Art", icon: "🖥️", tags: ["Photoshop", "Illustrator", "Procreate", "Digital Painting"] },
        { name: "Painting", icon: "🎨", tags: ["Watercolor", "Oil", "Acrylic", "Canvas"] },
        { name: "Sculpture", icon: "🗿", tags: ["Clay", "Stone", "Metal", "3D"] },
        { name: "Graphic Design", icon: "✏️", tags: ["Logo", "Typography", "Branding", "Layout"] },
        { name: "Photography", icon: "📷", tags: ["Portrait", "Landscape", "Editing", "Lightroom"] },
        { name: "Illustration", icon: "🖌️", tags: ["Vector", "Digital", "Hand-drawn", "Character Design"] },
      ],
      tags: ["Photoshop", "Illustrator", "Procreate", "Watercolor", "Portrait", "Landscape", "Abstract", "Minimalism"],
    },
    Fitness: {
      subcategories: [
        { name: "Yoga", icon: "🧘", tags: ["Flexibility", "Meditation", "Beginner", "Advanced"] },
        { name: "Weightlifting", icon: "🏋️", tags: ["Strength", "Bodybuilding", "Powerlifting", "Technique"] },
        { name: "Running", icon: "🏃", tags: ["Marathon", "5K", "Trail Running", "Endurance"] },
        { name: "CrossFit", icon: "🔥", tags: ["WOD", "HIIT", "Functional", "Competition"] },
        { name: "Pilates", icon: "💫", tags: ["Core", "Posture", "Reformer", "Mat"] },
        { name: "Nutrition", icon: "🥗", tags: ["Diet", "Macros", "Supplements", "Meal Planning"] },
      ],
      tags: ["Beginner", "Advanced", "Home Workout", "Gym", "Weight Loss", "Muscle Gain", "Flexibility", "Meditation"],
    },
    Education: {
      subcategories: [
        { name: "Mathematics", icon: "➗", tags: ["Algebra", "Calculus", "Statistics", "Problem Solving"] },
        { name: "Science", icon: "🔬", tags: ["Biology", "Chemistry", "Physics", "Experiments"] },
        { name: "Languages", icon: "🗣️", tags: ["English", "Spanish", "French", "Learning"] },
        { name: "History", icon: "📜", tags: ["World History", "Ancient", "Modern", "Research"] },
        { name: "Literature", icon: "📖", tags: ["Fiction", "Poetry", "Classics", "Analysis"] },
        { name: "Computer Science", icon: "💻", tags: ["Programming", "Algorithms", "Data Structures", "OS"] },
      ],
      tags: ["Tutoring", "Online Courses", "Study Group", "Exam Prep", "Reading", "Writing", "STEM", "Homework Help"],
    },
  };

  // Sample groups with proper tag associations
  const defaultGroups = [
    {
      id: 1,
      name: "React Developers",
      description: "A community for React developers to share knowledge and collaborate on projects",
      members: 2341,
      privacy: "Public",
      icon: "⚛️",
      category: "Technology",
      subcategory: "Web Development",
      tags: ["React", "JavaScript", "Frontend"],
      joined: false,
    },
    {
      id: 2,
      name: "Full Stack Professionals",
      description: "Exclusive group for experienced full-stack developers to network and share insights",
      members: 456,
      privacy: "Private",
      icon: "🚀",
      category: "Technology",
      subcategory: "Web Development",
      tags: ["Fullstack", "Web Development", "Backend"],
      joined: false,
    },
    {
      id: 3,
      name: "AI Enthusiasts",
      description: "Exploring the world of artificial intelligence and machine learning",
      members: 3200,
      privacy: "Public",
      icon: "🤖",
      category: "Technology",
      subcategory: "AI/ML",
      tags: ["Python", "Machine Learning", "TensorFlow"],
      joined: false,
    },
    {
      id: 4,
      name: "Digital Artists Collective",
      description: "Showcase your digital art and get feedback from fellow artists",
      members: 1875,
      privacy: "Public",
      icon: "🎨",
      category: "Arts & Design",
      subcategory: "Digital Art",
      tags: ["Digital Art", "Procreate", "Illustration"],
      joined: true,
    },
    {
      id: 5,
      name: "Fitness Motivation",
      description: "Get motivated, share progress, and discuss all things fitness",
      members: 5420,
      privacy: "Public",
      icon: "💪",
      category: "Fitness",
      subcategory: "Weightlifting",
      tags: ["Workout", "Nutrition", "Wellness"],
      joined: false,
    },
    {
      id: 6,
      name: "Language Exchange",
      description: "Practice languages with native speakers from around the world",
      members: 8920,
      privacy: "Public",
      icon: "🗣️",
      category: "Education",
      subcategory: "Languages",
      tags: ["Languages", "Learning", "Culture"],
      joined: true,
    },
  ];

  // Combine default groups with custom ones
  const [allGroups, setAllGroups] = useState([...defaultGroups, ...customGroups]);
  const [filteredGroups, setFilteredGroups] = useState(allGroups);

  // Custom hook for horizontal scrolling
  const useHorizontalScroll = (scrollAmount) => {
    const ref = useRef(null);
    
    const scroll = useCallback((direction) => {
      if (ref.current) {
        ref.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    }, [scrollAmount]);
    
    return { ref, scroll };
  };

  // Initialize scroll hooks
  const { ref: categoriesScrollRef, scroll: scrollCategories } = useHorizontalScroll(300);
  const { ref: subcategoriesScrollRef, scroll: scrollSubcategories } = useHorizontalScroll(200);
  const { ref: tagsScrollRef, scroll: scrollTags } = useHorizontalScroll(150);

  // Assign refs to the external refs for DOM access
  useEffect(() => {
    categoriesRef.current = categoriesScrollRef.current;
    subcategoriesRef.current = subcategoriesScrollRef.current;
    tagsRef.current = tagsScrollRef.current;
  }, [categoriesScrollRef, subcategoriesScrollRef, tagsScrollRef]);

  // Filter groups based on selected category, subcategory, tags, and search query
  useEffect(() => {
    setLoading(true);
    let result = allGroups;

    // Filter by active tab
    if (activeTab === "joined") {
      result = result.filter((group) => group.joined);
    } else if (activeTab === "recommended") {
      result = result.filter((group) => !group.joined && (group.category === selectedCategory || group.tags.some((tag) => selectedTags.includes(tag))));
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((group) => group.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      result = result.filter((group) => group.subcategory === selectedSubcategory);
    }

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      result = result.filter((group) => group.tags.some((tag) => selectedTags.includes(tag)));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((group) => 
        group.name.toLowerCase().includes(query) || 
        group.description.toLowerCase().includes(query) || 
        group.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredGroups(result);

    // Simulate loading delay
    const loadingTimer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(loadingTimer);
  }, [selectedCategory, selectedSubcategory, selectedTags, searchQuery, activeTab, allGroups]);

  // Form validation functions
  const validateInterestForm = useCallback(() => {
    const errors = {};
    if (!interestForm.name.trim()) errors.name = "Interest name is required";
    if (interestForm.name.length > 50) errors.name = "Interest name is too long (max 50 characters)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [interestForm]);

  const validateSubcategoryForm = useCallback(() => {
    const errors = {};
    if (!subcategoryForm.name.trim()) errors.name = "Subcategory name is required";
    if (!subcategoryForm.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [subcategoryForm]);

  const validateGroupForm = useCallback(() => {
    const errors = {};
    if (!groupForm.name.trim()) errors.name = "Group name is required";
    if (!groupForm.description.trim()) errors.description = "Description is required";
    if (!groupForm.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [groupForm]);

  // Event handlers
  const toggleTag = useCallback((tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  }, []);

  const toggleJoinGroup = useCallback((groupId) => {
    setAllGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          const updatedGroup = { ...group, joined: !group.joined };
          
          // Call the appropriate callback
          if (updatedGroup.joined) {
            onGroupJoin(updatedGroup);
          } else {
            onGroupLeave(updatedGroup);
          }
          
          return updatedGroup;
        }
        return group;
      })
    );

    setJoinedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, [onGroupJoin, onGroupLeave]);

  const handleSubcategoryClick = useCallback((subcategory) => {
    setSelectedSubcategory(subcategory.name);
    setSelectedTags(subcategory.tags);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSubcategory(null);
    setSelectedTags([]);
    setSearchQuery("");
  }, []);

  // Modal handlers
  const handleAddInterest = useCallback((e) => {
    e.preventDefault();
    if (!validateInterestForm()) return;
    
    console.log("Adding interest:", interestForm);
    setShowInterestsModal(false);
    setInterestForm({ name: "", description: "" });
    setFormErrors({});
  }, [interestForm, validateInterestForm]);

  const handleAddSubcategory = useCallback((e) => {
    e.preventDefault();
    if (!validateSubcategoryForm()) return;
    
    console.log("Adding subcategory:", subcategoryForm);
    setShowSubcategoriesModal(false);
    setSubcategoryForm({ name: "", category: "" });
    setFormErrors({});
  }, [subcategoryForm, validateSubcategoryForm]);

  const handleAddGroup = useCallback((e) => {
    e.preventDefault();
    if (!validateGroupForm()) return;
    
    console.log("Adding group:", groupForm);

    // Add the new group to the list
    const newGroup = {
      id: Math.max(...allGroups.map(g => g.id), 0) + 1,
      name: groupForm.name,
      description: groupForm.description,
      members: 1, // Starting with the creator
      privacy: groupForm.privacy,
      icon: "🌱", // Default icon for new groups
      category: groupForm.category,
      subcategory: "",
      tags: [],
      joined: true,
    };

    setAllGroups((prev) => [newGroup, ...prev]);
    setJoinedGroups((prev) => new Set(prev).add(newGroup.id));
    onGroupJoin(newGroup);

    setShowGroupsModal(false);
    setGroupForm({ name: "", description: "", privacy: "Public", category: "" });
    setFormErrors({});
  }, [groupForm, allGroups, validateGroupForm, onGroupJoin]);

  // Modal Components
  const InterestsModal = useCallback(() => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">Add New Interest</h3>
          </div>
          <button onClick={() => setShowInterestsModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddInterest}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Name</label>
            <input
              type="text"
              required
              value={interestForm.name}
              onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter interest name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={interestForm.description}
              onChange={(e) => setInterestForm({ ...interestForm, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Brief description of this interest"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowInterestsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center">
              Add Interest
            </button>
          </div>
        </form>
      </div>
    </div>
  ), [interestForm, formErrors, handleAddInterest]);

  const SubcategoriesModal = useCallback(() => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">Add New Subcategory</h3>
          </div>
          <button onClick={() => setShowSubcategoriesModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddSubcategory}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory Name</label>
            <input
              type="text"
              required
              value={subcategoryForm.name}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter subcategory name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              required
              value={subcategoryForm.category}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, category: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowSubcategoriesModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center">
              Add Subcategory
            </button>
          </div>
        </form>
      </div>
    </div>
  ), [subcategoryForm, formErrors, handleAddSubcategory, categories]);

  const GroupsModal = useCallback(() => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">Create New Group</h3>
          </div>
          <button onClick={() => setShowGroupsModal(false)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddGroup}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              required
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter group name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={groupForm.description}
              onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows="3"
              placeholder="Describe the purpose of this group"
            ></textarea>
            {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Setting</label>
              <select
                required
                value={groupForm.privacy}
                onChange={(e) => setGroupForm({ ...groupForm, privacy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                value={groupForm.category}
                onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowGroupsModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  ), [groupForm, formErrors, handleAddGroup, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Hero Section */}
      <div className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-1 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Communities</h1>
            <p className="text-gray-600 text-lg max-w-2xl">Find and connect with communities that share your interests. Join conversations, learn new skills, and meet like-minded people.</p>
          </div>
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for groups, topics, or interests..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Categories
          </h2>
          {showAddButtons && enableCategoryCreation && (
            <button onClick={() => setShowInterestsModal(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center shadow-xs">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </button>
          )}
        </div>

        {/* Categories Slider */}
        <div className="relative">
          <button 
            onClick={() => scrollCategories('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            style={{ marginLeft: '-12px' }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div 
            ref={categoriesScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className={`min-w-[200px] flex-shrink-0 p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.name
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedSubcategory(null);
                  setSelectedTags([]);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${category.color}`}
                  >
                    {category.icon}
                  </div>
                  {category.trending && (
                    <span className="px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-medium rounded-full flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Trending
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{category.subcategories} subcategories</p>
                  <p className="text-xs text-gray-500">
                    {category.members.toLocaleString()} members
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scrollCategories('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
            style={{ marginRight: '-12px' }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subcategories & Tags Section */}
      {selectedCategory !== "All" && categoryDetails[selectedCategory] && (
        <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {selectedCategory} Subcategories
              {selectedSubcategory && (
                <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {selectedSubcategory}
                  <button 
                    onClick={() => setSelectedSubcategory(null)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </h2>
            {showAddButtons && enableSubcategoryCreation && (
              <button onClick={() => setShowSubcategoriesModal(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center shadow-xs">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Subcategory
              </button>
            )}
          </div>

          {/* Subcategory Slider */}
          <div className="relative mb-6">
            <button 
              onClick={() => scrollSubcategories('left')} 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              style={{ marginLeft: '-12px' }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div 
              ref={subcategoriesScrollRef}
              className="flex overflow-x-auto gap-3 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}
            >
              {categoryDetails[selectedCategory]?.subcategories.map((subcategory, index) => (
                <div 
                  key={index} 
                  className={`min-w-[120px] flex-shrink-0 p-3 rounded-lg text-center transition-colors duration-200 border cursor-pointer flex flex-col items-center ${
                    selectedSubcategory === subcategory.name ? "bg-blue-100 border-blue-500" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <span className="text-2xl mb-2">{subcategory.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{subcategory.name}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scrollSubcategories('right')} 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
              style={{ marginRight: '-12px' }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Tags Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-gray-800 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Refine by Tags
              </h3>
              {selectedTags.length > 0 && (
                <button 
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Tags Slider */}
            <div className="relative">
              <button 
                onClick={() => scrollTags('left')} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
                style={{ marginLeft: '-10px' }}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div 
                ref={tagsScrollRef}
                className="flex overflow-x-auto gap-2 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thumb-rounded-full"
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}
              >
                {categoryDetails[selectedCategory]?.tags.map((tag, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center flex-shrink-0 ${
                      selectedTags.includes(tag) ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-xs"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                ))}
                {showAddButtons && enableTagCreation && (
                  <button onClick={() => setShowInterestsModal(true)} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center border border-gray-300 shadow-xs flex-shrink-0">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Tag
                  </button>
                )}
              </div>

              <button 
                onClick={() => scrollTags('right')} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
                style={{ marginRight: '-10px' }}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedSubcategory || selectedTags.length > 0) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedSubcategory && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                      Subcategory: {selectedSubcategory}
                      <button 
                        onClick={() => setSelectedSubcategory(null)}
                        className="ml-1 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedTags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                      {tag}
                      <button 
                        onClick={() => toggleTag(tag)}
                        className="ml-1 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Groups Section with Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Groups
          </h2>

          <div className="flex gap-2 items-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["all", "joined", "recommended"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {showAddButtons && enableGroupCreation && (
              <button onClick={() => setShowGroupsModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center whitespace-nowrap">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Group
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-white group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{group.icon}</span>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${group.privacy === "Public" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>{group.privacy}</span>
                      <p className="text-xs text-gray-500 mt-1">{group.category} • {group.subcategory}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleJoinGroup(group.id)} className={`p-1.5 rounded-full transition-colors ${group.joined ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {group.joined ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{group.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {group.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {group.members.toLocaleString()} members
                  </div>
                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      group.joined ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : group.privacy === "Public" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {group.joined ? "Joined" : group.privacy === "Public" ? "Join Group" : "Request Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No groups found</h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search or filter criteria to find more communities.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showInterestsModal && <InterestsModal />}
      {showSubcategoriesModal && <SubcategoriesModal />}
      {showGroupsModal && <GroupsModal />}
    </div>
  );
};

// PropTypes for better component documentation and validation
DiscoverGroups.propTypes = {
  showAddButtons: PropTypes.bool,
  enableCategoryCreation: PropTypes.bool,
  enableSubcategoryCreation: PropTypes.bool,
  enableTagCreation: PropTypes.bool,
  enableGroupCreation: PropTypes.bool,
  onGroupJoin: PropTypes.func,
  onGroupLeave: PropTypes.func,
  customCategories: PropTypes.array,
  customGroups: PropTypes.array,
};

export default DiscoverGroups;