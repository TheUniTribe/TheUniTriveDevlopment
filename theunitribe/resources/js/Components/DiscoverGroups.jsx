import React, { useState, useEffect } from "react";

const DiscoverGroups = () => {
    const [selectedCategory, setSelectedCategory] = useState("Technology");
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showInterestsModal, setShowInterestsModal] = useState(false);
    const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false);
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const [activeTab, setActiveTab] = useState("all"); // all, joined, recommended
    const [loading, setLoading] = useState(false);
    const [joinedGroups, setJoinedGroups] = useState(new Set());

    // Form states
    const [interestForm, setInterestForm] = useState({ name: "", description: "" });
    const [subcategoryForm, setSubcategoryForm] = useState({ name: "", category: "" });
    const [groupForm, setGroupForm] = useState({
        name: "",
        description: "",
        privacy: "Public",
        category: "",
    });

    // Sample data with more entries
    const categories = [
        {
            id: 1,
            name: "Technology",
            subcategories: 12,
            icon: "💻",
            color: "bg-blue-100 text-blue-800",
            trending: true,
            members: 125000
        },
        {
            id: 2,
            name: "Arts & Design",
            subcategories: 8,
            icon: "🎨",
            color: "bg-purple-100 text-purple-800",
            trending: false,
            members: 84500
        },
        {
            id: 3,
            name: "Fitness",
            subcategories: 6,
            icon: "💪",
            color: "bg-green-100 text-green-800",
            trending: true,
            members: 97800
        },
        {
            id: 4,
            name: "Education",
            subcategories: 15,
            icon: "📚",
            color: "bg-red-100 text-red-800",
            trending: false,
            members: 156000
        },
        {
            id: 5,
            name: "Music",
            subcategories: 9,
            icon: "🎵",
            color: "bg-yellow-100 text-yellow-800",
            trending: true,
            members: 112300
        },
        {
            id: 6,
            name: "Gaming",
            subcategories: 7,
            icon: "🎮",
            color: "bg-indigo-100 text-indigo-800",
            trending: true,
            members: 137500
        },
        {
            id: 7,
            name: "Business",
            subcategories: 11,
            icon: "💼",
            color: "bg-gray-100 text-gray-800",
            trending: false,
            members: 89500
        },
        {
            id: 8,
            name: "Food & Cooking",
            subcategories: 10,
            icon: "🍳",
            color: "bg-orange-100 text-orange-800",
            trending: true,
            members: 102400
        },
    ];

    const categoryDetails = {
        Technology: {
            subcategories: ["Web Development", "Mobile Apps", "AI/ML", "Data Science", "DevOps", "Cybersecurity", "Cloud Computing", "Blockchain", "IoT", "UI/UX Design", "Game Development", "AR/VR"],
            tags: ["React", "JavaScript", "Node.js", "Frontend", "Python", "UI/UX", "AWS", "Docker", "Kubernetes", "TensorFlow", "Swift", "Kotlin"]
        },
        "Arts & Design": {
            subcategories: ["Digital Art", "Painting", "Sculpture", "Graphic Design", "Photography", "Illustration", "3D Modeling", "Typography"],
            tags: ["Photoshop", "Illustrator", "Procreate", "Watercolor", "Portrait", "Landscape", "Abstract", "Minimalism"]
        },
        Fitness: {
            subcategories: ["Yoga", "Weightlifting", "Running", "CrossFit", "Pilates", "Calisthenics", "Nutrition", "Mental Health"],
            tags: ["Beginner", "Advanced", "Home Workout", "Gym", "Weight Loss", "Muscle Gain", "Flexibility", "Meditation"]
        },
        Education: {
            subcategories: ["Mathematics", "Science", "Languages", "History", "Literature", "Computer Science", "Test Prep", "Online Learning", "Early Childhood", "Higher Education", "Special Education", "Homeschooling"],
            tags: ["Tutoring", "Online Courses", "Study Group", "Exam Prep", "Reading", "Writing", "STEM", "Homework Help"]
        },
        Music: {
            subcategories: ["Guitar", "Piano", "Production", "Singing", "Theory", "Hip Hop", "Electronic", "Classical", "Jazz"],
            tags: ["Beginner", "Advanced", "Collaboration", "Recording", "Mixing", "Live Performance", "Songwriting", "Cover"]
        },
        Gaming: {
            subcategories: ["PC Gaming", "Console", "Mobile Games", "eSports", "Indie Games", "Retro", "VR Gaming", "Game Development"],
            tags: ["FPS", "RPG", "Strategy", "Multiplayer", "Co-op", "Competitive", "Casual", "Streaming"]
        },
        Business: {
            subcategories: ["Entrepreneurship", "Marketing", "Finance", "Startups", "Leadership", "Networking", "Sales", "Real Estate", "Investing", "Management", "Consulting"],
            tags: ["Small Business", "Digital Marketing", "VC", "Stock Market", "Career Growth", "Freelance", "Remote Work", "Side Hustle"]
        },
        "Food & Cooking": {
            subcategories: ["Baking", "Vegetarian", "Vegan", "BBQ", "Meal Prep", "International Cuisine", "Cocktails", "Food Photography", "Restaurant Reviews", "Food Science"],
            tags: ["Easy Recipes", "Gourmet", "Healthy", "Comfort Food", "Quick Meals", "Budget Cooking", "Gluten Free", "Keto"]
        }
    };

    // More sample groups
    const allGroups = [
        {
            id: 1,
            name: "React Developers",
            description: "A community for React developers to share knowledge and collaborate on projects",
            members: 2341,
            privacy: "Public",
            icon: "⚛️",
            category: "Technology",
            tags: ["React", "JavaScript", "Frontend"],
            joined: false
        },
        {
            id: 2,
            name: "Full Stack Professionals",
            description: "Exclusive group for experienced full-stack developers to network and share insights",
            members: 456,
            privacy: "Private",
            icon: "🚀",
            category: "Technology",
            tags: ["Fullstack", "Web Development", "Backend"],
            joined: false
        },
        {
            id: 3,
            name: "JavaScript Enthusiasts",
            description: "Learn and discuss all things JavaScript from basics to advanced concepts",
            members: 1829,
            privacy: "Public",
            icon: "📜",
            category: "Technology",
            tags: ["JavaScript", "Programming", "Web"],
            joined: true
        },
        {
            id: 4,
            name: "Data Science Beginners",
            description: "A friendly community for those starting their data science journey",
            members: 3200,
            privacy: "Public",
            icon: "📊",
            category: "Technology",
            tags: ["Data Science", "Python", "Machine Learning"],
            joined: false
        },
        {
            id: 5,
            name: "Digital Artists Collective",
            description: "Showcase your digital art and get feedback from fellow artists",
            members: 1875,
            privacy: "Public",
            icon: "🎨",
            category: "Arts & Design",
            tags: ["Digital Art", "Procreate", "Illustration"],
            joined: true
        },
        {
            id: 6,
            name: "Fitness Motivation",
            description: "Get motivated, share progress, and discuss all things fitness",
            members: 5420,
            privacy: "Public",
            icon: "💪",
            category: "Fitness",
            tags: ["Workout", "Nutrition", "Wellness"],
            joined: false
        },
        {
            id: 7,
            name: "Language Exchange",
            description: "Practice languages with native speakers from around the world",
            members: 8920,
            privacy: "Public",
            icon: "🗣️",
            category: "Education",
            tags: ["Languages", "Learning", "Culture"],
            joined: true
        },
        {
            id: 8,
            name: "Indie Game Developers",
            description: "For independent game developers to share resources and collaborate",
            members: 1560,
            privacy: "Private",
            icon: "🎮",
            category: "Gaming",
            tags: ["Game Dev", "Indie", "Unity"],
            joined: false
        },
    ];

    const [filteredGroups, setFilteredGroups] = useState(allGroups);

    // Filter groups based on selected category, tags, and search query
    useEffect(() => {
        setLoading(true);
        let result = allGroups;
        
        // Filter by active tab
        if (activeTab === "joined") {
            result = result.filter(group => group.joined);
        } else if (activeTab === "recommended") {
            // Simple recommendation algorithm based on user's joined groups and interests
            result = result.filter(group => 
                !group.joined && 
                (group.category === selectedCategory || 
                 group.tags.some(tag => selectedTags.includes(tag)))
            );
        }
        
        // Filter by category
        if (selectedCategory !== "All") {
            result = result.filter(group => group.category === selectedCategory);
        }
        
        // Filter by tags if any are selected
        if (selectedTags.length > 0) {
            result = result.filter(group => 
                group.tags.some(tag => selectedTags.includes(tag))
            );
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(group => 
                group.name.toLowerCase().includes(query) || 
                group.description.toLowerCase().includes(query) ||
                group.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        setFilteredGroups(result);
        
        // Simulate loading delay
        setTimeout(() => setLoading(false), 300);
    }, [selectedCategory, selectedTags, searchQuery, activeTab]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const toggleJoinGroup = (groupId) => {
        setAllGroups(prevGroups => 
            prevGroups.map(group => 
                group.id === groupId 
                    ? { ...group, joined: !group.joined } 
                    : group
            )
        );
        
        if (joinedGroups.has(groupId)) {
            setJoinedGroups(prev => {
                const newSet = new Set(prev);
                newSet.delete(groupId);
                return newSet;
            });
        } else {
            setJoinedGroups(prev => new Set(prev).add(groupId));
        }
    };

    // Modal handlers
    const handleAddInterest = (e) => {
        e.preventDefault();
        console.log("Adding interest:", interestForm);
        setShowInterestsModal(false);
        setInterestForm({ name: "", description: "" });
    };

    const handleAddSubcategory = (e) => {
        e.preventDefault();
        console.log("Adding subcategory:", subcategoryForm);
        setShowSubcategoriesModal(false);
        setSubcategoryForm({ name: "", category: "" });
    };

    const handleAddGroup = (e) => {
        e.preventDefault();
        console.log("Adding group:", groupForm);
        
        // Add the new group to the list
        const newGroup = {
            id: allGroups.length + 1,
            name: groupForm.name,
            description: groupForm.description,
            members: 1, // Starting with the creator
            privacy: groupForm.privacy,
            icon: "🌱", // Default icon for new groups
            category: groupForm.category,
            tags: [],
            joined: true
        };
        
        setAllGroups(prev => [newGroup, ...prev]);
        setJoinedGroups(prev => new Set(prev).add(newGroup.id));
        
        setShowGroupsModal(false);
        setGroupForm({ name: "", description: "", privacy: "Public", category: "" });
    };

    // Modal Components
    const InterestsModal = () => (
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter interest name"
                        />
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
    );

    const SubcategoriesModal = () => (
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter subcategory name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            required
                            value={subcategoryForm.category}
                            onChange={(e) => setSubcategoryForm({ ...subcategoryForm, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
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
    );

    const GroupsModal = () => (
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter group name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            value={groupForm.description}
                            onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="Describe the purpose of this group"
                        ></textarea>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
            {/* Hero Section */}
            <div className="mb-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-1 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Communities</h1>
                        <p className="text-gray-600 text-lg max-w-2xl">
                            Find and connect with communities that share your interests. 
                            Join conversations, learn new skills, and meet like-minded people.
                        </p>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Popular Categories
                    </h2>
                    <button 
                        onClick={() => setSelectedCategory("All")}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                    >
                        View all
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                selectedCategory === category.name ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${category.color}`}>
                                    {category.icon}
                                </div>
                                {category.trending && (
                                    <span className="px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-medium rounded-full flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        Trending
                                    </span>
                                )}
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{category.subcategories} subcategories</p>
                                <p className="text-xs text-gray-500">{category.members.toLocaleString()} members</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subcategories & Tags Section */}
            {selectedCategory !== "All" && (
                <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {selectedCategory} Subcategories
                        </h2>
                        <button onClick={() => setShowSubcategoriesModal(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center shadow-xs">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Subcategory
                        </button>
                    </div>

                    {/* Subcategory Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                        {categoryDetails[selectedCategory]?.subcategories.map((subcategory, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200 border border-gray-100 cursor-pointer">
                                <span className="text-sm font-medium text-gray-800">{subcategory}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tags Section */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Refine by Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categoryDetails[selectedCategory]?.tags.map((tag, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                                        selectedTags.includes(tag) 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-xs"
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
                            <button onClick={() => setShowInterestsModal(true)} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 flex items-center border border-gray-300 shadow-xs">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Groups Section with Tabs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Communities
                    </h2>
                    
                    <div className="flex gap-2 items-center">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {["all", "joined", "recommended"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                                        activeTab === tab
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={() => setShowGroupsModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center whitespace-nowrap">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Group
                        </button>
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
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${group.privacy === "Public" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>
                                                {group.privacy}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">{group.category}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleJoinGroup(group.id)}
                                        className={`p-1.5 rounded-full transition-colors ${
                                            group.joined ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    >
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {group.members.toLocaleString()} members
                                    </div>
                                    <button
                                        onClick={() => toggleJoinGroup(group.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            group.joined 
                                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                                                : group.privacy === "Public" 
                                                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                                                    : "bg-purple-600 text-white hover:bg-purple-700"
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
                        <p className="text-gray-500 max-w-md mx-auto">
                            Try adjusting your search or filter criteria to find more communities.
                        </p>
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

export default DiscoverGroups;