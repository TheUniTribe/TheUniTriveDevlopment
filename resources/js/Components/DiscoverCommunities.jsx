/**
 * ============================================================================
 * DISCOVER COMMUNITIES COMPONENT
 * ============================================================================
 * 
 * A React component for discovering and joining communities with hierarchical
 * filtering: Interest → Topics → Communities (with Tags)
 * 
 * @fileoverview Main community discovery interface
 * @author Your Team
 * @version 2.0.0
 * 
 * ============================================================================
 * DATA FLOW & RELATIONSHIPS
 * ============================================================================
 * 
 * Backend Relationships:
 * ┌─────────────┐    1:M     ┌─────────────┐    M:M     ┌─────────────┐
 * │  Interest   │ ────────── │   Topic     │ ────────── │  Community  │
 * └─────────────┘            └─────────────┘            └─────────────┘
 *                                                              │
 *                                                         M:M  │
 *                                                              ▼
 *                                                       ┌─────────────┐
 *                                                       │    Tag      │
 *                                                       └─────────────┘
 * 
 * API Routes Used (from communityService):
 * ────────────────────────────────────────────────────────────────────────────
 * | Action                    | Service Method              | Route              |
 * |---------------------------|-----------------------------|--------------------|
 * | Load interests            | getInterests()              | GET /interests     |
 * | Load topics by interest   | getTopicsByInterest(id)     | GET /interests/:id/topics |
 * | Load communities by topic | getCommunitiesByTopic(id)   | GET /topics/:id/communities |
 * | Load communities by tag   | getCommunitiesByTag(id)     | GET /tags/:id/communities |
 * | Load all tags             | getTags()                   | GET /tags          |
 * | Load tags by community    | getTagsByCommunity(id)      | GET /communities/:id/tags |
 * | Search communities        | searchCommunities(q)        | GET /communities/search?q= |
 * | Get all communities       | getCommunities()            | GET /communities   |
 * | Join community            | joinCommunity(id)           | POST /communities/:id/join |
 * | Leave community           | leaveCommunity(id)          | POST /communities/:id/leave |
 * | Create community          | createCommunity(data)       | POST /communities  |
 * ────────────────────────────────────────────────────────────────────────────
 * 
 * ============================================================================
 * COMPONENT FEATURES
 * ============================================================================
 * 
 * ✅ Hierarchical filtering (Interest → Topic → Tag → Communities)
 * ✅ Debounced search
 * ✅ Optimistic UI updates for join/leave
 * ✅ Granular loading states
 * ✅ Error handling with user feedback
 * ✅ Community creation modal
 * ✅ Horizontal scrolling for filters
 * ✅ Tab filtering (All / Joined / Recommended)
 * 
 * ============================================================================
 * PROPS
 * ============================================================================
 * 
 * @param {boolean} showAddButtons - Show create community button (default: true)
 * @param {boolean} enableCommunityCreation - Enable community creation (default: true)
 * @param {Function} onCommunityJoin - Callback when user joins a community
 * @param {Function} onCommunityLeave - Callback when user leaves a community
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import communityService from "../services/communityService";
import CommunityDashboard from '@/Components/ui/CommunityDashboard';

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Debounce Hook - Delays value updates to prevent excessive API calls
 * 
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} Debounced value
 * 
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 500);
 */
const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalizes API response to extract data array
 * Handles various Laravel response formats:
 * - { data: [...] }
 * - { data: { items: [...] } }
 * - [...]
 * 
 * @param {Object|Array} response - API response
 * @param {string} key - Optional key to extract (e.g., 'communities', 'topics')
 * @returns {Array} Normalized array
 */
const normalizeResponse = (response, key = null) => {
    if (!response) return [];
    
    // Try specific key first
    if (key) {
        if (response?.data?.[key]) return response.data[key];
        if (response?.[key]) return response[key];
    }
    
    // Fallback to generic data extraction
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    
    return [];
};

/**
 * Extracts unique tags from communities array
 * Used when we need to show tags available for filtering
 * 
 * @param {Array} communities - Array of community objects
 * @returns {Array} Unique tags array
 */
const extractTagsFromCommunities = (communities) => {
    const tagsMap = new Map();
    
    communities.forEach(community => {
        if (community.tags && Array.isArray(community.tags)) {
            community.tags.forEach(tag => {
                if (!tagsMap.has(tag.id)) {
                    tagsMap.set(tag.id, tag);
                }
            });
        }
    });
    
    return Array.from(tagsMap.values());
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DiscoverCommunities = ({
    showAddButtons = true,
    enableCommunityCreation = true,
    onCommunityJoin = () => {},
    onCommunityLeave = () => {},
}) => {
    // =========================================================================
    // STATE MANAGEMENT
    // =========================================================================
    
    /**
     * Selection States
     * Track user's current filter selections
     */
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    /**
     * Data States
     * Store fetched data from API
     */
    const [interests, setInterests] = useState([]);
    const [topics, setTopics] = useState([]);
    const [tags, setTags] = useState([]);
    const [communities, setCommunities] = useState([]);

    /**
     * UI States
     */
    const [showModal, setShowModal] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [selectedCommunityForDashboard, setSelectedCommunityForDashboard] = useState(null);
    const [error, setError] = useState(null);
    
    /**
     * Granular Loading States
     * Track loading state for each data type separately
     */
    const [loading, setLoading] = useState({
        interests: false,
        topics: false,
        tags: false,
        communities: false,
    });

    /**
     * Scroll Refs
     * For horizontal scroll buttons
     */
    const interestsRef = useRef(null);
    const topicsRef = useRef(null);
    const tagsRef = useRef(null);

    /**
     * Debounced Search
     * Prevents API calls on every keystroke
     */
    const debouncedSearch = useDebounce(searchQuery, 500);

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    /**
     * Filter communities based on active tab
     */
    const filteredCommunities = useMemo(() => {
        switch (activeTab) {
            case "joined":
                return communities.filter(c => c.joined);
            case "recommended":
                // Could implement recommendation logic here
                return communities.filter(c => !c.joined).slice(0, 10);
            default:
                return communities;
        }
    }, [communities, activeTab]);

    /**
     * Count statistics
     */
    const totalCount = useMemo(() => communities.length, [communities]);
    const joinedCount = useMemo(() => 
        communities.filter(c => c.joined).length, 
        [communities]
    );

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================

    /**
     * Update specific loading state
     */
    const setLoadingState = useCallback((key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }));
    }, []);

    /**
     * Clear all filters and reset to initial state
     */
    const clearFilters = useCallback(() => {
        setSelectedTags([]);
        setSelectedTopic(null);
        setSearchQuery("");
    }, []);

    /**
     * Scroll container horizontally
     */
    const scrollContainer = useCallback((ref, direction, amount = 200) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === "left" ? -amount : amount,
                behavior: "smooth",
            });
        }
    }, []);

    /**
     * Get context-aware empty state message
     */
    const getEmptyMessage = useCallback(() => {
        if (debouncedSearch.trim()) {
            return {
                title: "No search results",
                description: `No communities found for "${debouncedSearch}"`,
                showClear: true,
            };
        }
        if (selectedTags.length > 0) {
            return {
                title: "No communities with selected tags",
                description: "Try selecting different tags",
                showClear: true,
            };
        }
        if (selectedTopic) {
            const topic = topics.find(t => t.id === selectedTopic);
            return {
                title: "No communities in this topic",
                description: topic ? `No communities found for "${topic.name}"` : "",
                showClear: true,
            };
        }
        return {
            title: "No communities available",
            description: "Check back later for new communities",
            showClear: false,
        };
    }, [debouncedSearch, selectedTags, selectedTopic, topics]);

    // =========================================================================
    // DATA FETCHING
    // =========================================================================

    /**
     * STEP 1: Fetch Interests on Mount
     * 
     * API: GET /interests
     * Service: communityService.getInterests()
     * 
     * This is the first level of the hierarchy.
     * Auto-selects the first interest to start the cascade.
     */
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                setLoadingState("interests", true);
                setError(null);

                const response = await communityService.getInterests();
                const data = normalizeResponse(response, "interests");
                
                console.log("[Interests] Fetched:", data.length);
                setInterests(data);

                // Auto-select first interest
                if (data.length > 0) {
                    setSelectedInterest(data[0].id);
                }
            } catch (err) {
                console.error("[Interests] Error:", err);
                setError("Failed to load interests. Please refresh the page.");
                setInterests([]);
            } finally {
                setLoadingState("interests", false);
            }
        };

        fetchInterests();
    }, [setLoadingState]);

    /**
     * STEP 2: Fetch Topics when Interest Changes
     * 
     * API: GET /interests/{interestId}/topics
     * Service: communityService.getTopicsByInterest(interestId)
     * 
     * Cascade effect: Interest selection triggers topics fetch.
     * Resets topic, tags, and communities on interest change.
     */
    useEffect(() => {
        // Reset downstream selections when interest changes
        if (!selectedInterest) {
            setTopics([]);
            setSelectedTopic(null);
            setTags([]);
            setSelectedTags([]);
            return;
        }

        const fetchTopics = async () => {
            try {
                setLoadingState("topics", true);

                const response = await communityService.getTopicsByInterest(selectedInterest);
                const data = normalizeResponse(response, "topics");
                
                console.log("[Topics] Fetched for interest", selectedInterest, ":", data.length);
                setTopics(data);

                // Auto-select first topic
                if (data.length > 0) {
                    setSelectedTopic(data[0].id);
                } else {
                    setSelectedTopic(null);
                }
            } catch (err) {
                console.error("[Topics] Error:", err);
                setError("Failed to load topics.");
                setTopics([]);
                setSelectedTopic(null);
            } finally {
                setLoadingState("topics", false);
            }
        };

        fetchTopics();
    }, [selectedInterest, setLoadingState]);

    /**
     * STEP 3: Fetch Communities when Topic Changes
     * 
     * API: GET /topics/{topicId}/communities
     * Service: communityService.getCommunitiesByTopic(topicId)
     * 
     * Tags are now eager loaded by Laravel, so they come with each community.
     */
    useEffect(() => {
        if (!selectedTopic) {
            setCommunities([]);
            setTags([]);
            setSelectedTags([]);
            return;
        }

        const fetchCommunities = async () => {
            try {
                setLoadingState("communities", true);
                setLoadingState("tags", true);

                const response = await communityService.getCommunitiesByTopic(selectedTopic);
                const data = normalizeResponse(response, "communities");
                
                console.log("[Communities] Fetched for topic", selectedTopic, ":", data.length);
                setCommunities(data);

                // Extract unique tags from all communities for the filter sidebar
                const extractedTags = extractTagsFromCommunities(data);
                console.log("[Tags] Extracted from communities:", extractedTags.length);
                setTags(extractedTags);
                setSelectedTags([]);

            } catch (err) {
                console.error("[Communities] Error:", err);
                setError("Failed to load communities.");
                setCommunities([]);
                setTags([]);
            } finally {
                setLoadingState("communities", false);
                setLoadingState("tags", false);
            }
        };

        fetchCommunities();
    }, [selectedTopic, setLoadingState]);

    /**
     * STEP 4: Filter by Tags
     * 
     * API: GET /tags/{tagId}/communities
     * Service: communityService.getCommunitiesByTag(tagId)
     * 
     * Tags are eager loaded by Laravel.
     */
    useEffect(() => {
        if (selectedTags.length === 0 || !selectedTopic) return;

        const filterByTags = async () => {
            try {
                setLoadingState("communities", true);
                
                // Server-side filtering by tag
                const response = await communityService.getCommunitiesByTag(selectedTags[0]);
                const data = normalizeResponse(response, "communities");
                
                console.log("[Communities] Filtered by tag:", data.length);
                setCommunities(data);

            } catch (err) {
                console.error("[Filter] Error:", err);
            } finally {
                setLoadingState("communities", false);
            }
        };

        filterByTags();
    }, [selectedTags, setLoadingState]);

    /**
     * SEARCH: Fetch Communities by Search Query
     * 
     * API: GET /communities/search?q={query}
     * Service: communityService.searchCommunities(query)
     * 
     * Tags are eager loaded by Laravel.
     */
    useEffect(() => {
        if (!debouncedSearch.trim()) return;

        const searchCommunities = async () => {
            try {
                setLoadingState("communities", true);

                const response = await communityService.searchCommunities(debouncedSearch);
                const data = normalizeResponse(response, "communities");
                
                console.log("[Search] Results for", debouncedSearch, ":", data.length);
                setCommunities(data);

            } catch (err) {
                console.error("[Search] Error:", err);
                setError("Search failed. Please try again.");
            } finally {
                setLoadingState("communities", false);
            }
        };

        searchCommunities();
    }, [debouncedSearch, setLoadingState]);

    // =========================================================================
    // ACTION HANDLERS
    // =========================================================================

    /**
     * Toggle Tag Selection
     * Multi-select supported
     */
    const toggleTag = useCallback((tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    }, []);

    /**
     * Join/Leave Community with Optimistic UI Update
     * 
     * API: POST /communities/{id}/join or /leave
     * Service: communityService.joinCommunity(id) / leaveCommunity(id)
     * 
     * Updates UI immediately, reverts on error.
     */
    const toggleMembership = useCallback(async (communityId) => {
        const community = communities.find(c => c.id === communityId);
        if (!community) return;

        const wasJoined = community.joined;

        // Optimistic update
        setCommunities(prev =>
            prev.map(c =>
                c.id === communityId ? { ...c, joined: !c.joined } : c
            )
        );

        try {
            if (wasJoined) {
                await communityService.leaveCommunity(communityId);
                console.log("[Membership] Left community:", communityId);
                onCommunityLeave(community);
            } else {
                await communityService.joinCommunity(communityId);
                console.log("[Membership] Joined community:", communityId);
                onCommunityJoin(community);
            }
        } catch (err) {
            console.error("[Membership] Error:", err);
            
            // Revert on error
            setCommunities(prev =>
                prev.map(c =>
                    c.id === communityId ? { ...c, joined: wasJoined } : c
                )
            );
            
            setError(`Failed to ${wasJoined ? "leave" : "join"} community.`);
        }
    }, [communities, onCommunityJoin, onCommunityLeave]);

    /**
     * Handle Community Creation
     * 
     * API: POST /communities
     * Service: communityService.createCommunity(data)
     */
    const handleCreateCommunity = useCallback(async (formData) => {
        try {
            const response = await communityService.createCommunity(formData);
            const newCommunity = response?.community || response?.data || response;
            
            console.log("[Create] New community:", newCommunity);
            
            // Add to list with joined status
            setCommunities(prev => [{ ...newCommunity, joined: true }, ...prev]);
            onCommunityJoin(newCommunity);
            setShowModal(false);
            
            return newCommunity;
        } catch (err) {
            console.error("[Create] Error:", err);
            throw err;
        }
    }, [onCommunityJoin]);

    // =========================================================================
    // DASHBOARD HANDLERS
    // =========================================================================

    const handleOpenDashboard = useCallback((community) => {
        setSelectedCommunityForDashboard(community);
        setShowDashboard(true);
    }, []);

    const handleCloseDashboard = useCallback(() => {
        setShowDashboard(false);
        setSelectedCommunityForDashboard(null);
    }, []);

    // =========================================================================
    // UI COMPONENTS
    // =========================================================================

    /**
     * Error Banner Component
     */
    const ErrorBanner = () => {
        if (!error) return null;
        
        return (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="text-red-800 font-bold">✕</button>
                </div>
            </div>
        );
    };

    /**
     * Loading Spinner Component
     */
    const Spinner = () => (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
    );

    /**
     * Empty State Component
     */
    const EmptyState = () => {
        const { title, description, showClear } = getEmptyMessage();
        
        return (
            <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-500 mb-4">{description}</p>
                {showClear && (
                    <button onClick={clearFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Clear Filters
                    </button>
                )}
            </div>
        );
    };

    /**
     * Horizontal Scroll Buttons
     */
    const ScrollButton = ({ direction, onClick }) => (
        <button
            onClick={onClick}
            className={`absolute ${direction === "left" ? "left-0 -ml-3" : "right-0 -mr-3"} top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg`}
        >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
        </button>
    );

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="max-w-7xl mx-auto font-sans">
            {/* Error Display */}
            <ErrorBanner />

            {/* ================================================================
                HERO SECTION
                - Title, description
                - Search bar
                - Stats counters
            ================================================================ */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-gray-100 shadow-sm px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_480px_auto] gap-4 items-center">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Discover Communities
                        </h1>
                        <p className="text-gray-600">
                            Explore communities that share your passions.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3">
                        <div className="bg-white rounded-xl px-6 py-3 shadow-md border-2 border-blue-100 text-center">
                            <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                            <div className="text-xs text-gray-600 uppercase">Total</div>
                        </div>
                        <div className="bg-white rounded-xl px-6 py-3 shadow-md border-2 border-green-100 text-center">
                            <div className="text-2xl font-bold text-gray-900">{joinedCount}</div>
                            <div className="text-xs text-gray-600 uppercase">Joined</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                INTERESTS SECTION
                API: GET /interests
                Service: communityService.getInterests()
            ================================================================ */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Interests
                </h2>

                {loading.interests ? (
                    <Spinner />
                ) : (
                    <div className="relative">
                        <ScrollButton direction="left" onClick={() => scrollContainer(interestsRef, "left", 300)} />
                        
                        <div ref={interestsRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
                            {interests.map((interest) => (
                                <div
                                    key={interest.id}
                                    onClick={() => {
                                        setSelectedInterest(interest.id);
                                        setSelectedTopic(null);
                                        setSelectedTags([]);
                                    }}
                                    className={`min-w-[200px] flex-shrink-0 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                                        selectedInterest === interest.id
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-200 hover:border-blue-300"
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-blue-100 mb-3">
                                        {interest.icon || "📁"}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{interest.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {interest.topics_count || 0} topics • {(interest.members_count || 0).toLocaleString()} members
                                    </p>
                                </div>
                            ))}
                        </div>

                        <ScrollButton direction="right" onClick={() => scrollContainer(interestsRef, "right", 300)} />
                    </div>
                )}
            </div>

            {/* ================================================================
                TOPICS & TAGS SECTION
                Topics API: GET /interests/{id}/topics
                Service: communityService.getTopicsByInterest(id)
                
                Tags: Extracted from communities (no direct route)
            ================================================================ */}
            {selectedInterest && topics.length > 0 && (
                <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    {/* Topics */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Topics
                    </h2>

                    <div className="relative mb-6">
                        <ScrollButton direction="left" onClick={() => scrollContainer(topicsRef, "left", 200)} />
                        
                        <div ref={topicsRef} className="flex gap-3 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
                            {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic.id)}
                                    className={`min-w-[120px] flex-shrink-0 p-3 rounded-lg text-center border cursor-pointer transition-colors ${
                                        selectedTopic === topic.id
                                            ? "bg-blue-100 border-blue-500"
                                            : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="text-2xl mb-2 block">{topic.icon || "📋"}</span>
                                    <span className="text-sm font-medium text-gray-800">{topic.name}</span>
                                </div>
                            ))}
                        </div>

                        <ScrollButton direction="right" onClick={() => scrollContainer(topicsRef, "right", 200)} />
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div>
                            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Filter by Tags
                            </h3>

                            <div className="relative">
                                <ScrollButton direction="left" onClick={() => scrollContainer(tagsRef, "left", 150)} />
                                
                                <div ref={tagsRef} className="flex gap-2 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                                                selectedTags.includes(tag.id)
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {tag.name}
                                            {selectedTags.includes(tag.id) && " ✓"}
                                        </button>
                                    ))}
                                </div>

                                <ScrollButton direction="right" onClick={() => scrollContainer(tagsRef, "right", 150)} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ================================================================
                COMMUNITIES SECTION
                API: GET /topics/{id}/communities
                Service: communityService.getCommunitiesByTopic(id)
                
                Join: POST /communities/{id}/join
                Leave: POST /communities/{id}/leave
            ================================================================ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Communities
                    </h2>

                    <div className="flex gap-2 items-center">
                        {/* Tabs */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            {["all", "joined", "recommended"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                                        activeTab === tab
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Create Button */}
                        {showAddButtons && enableCommunityCreation && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Community
                            </button>
                        )}
                    </div>
                </div>

                {/* Communities Grid */}
                {loading.communities ? (
                    <Spinner />
                ) : filteredCommunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommunities.map((community) => (
                            <div
                                key={community.id}
                                className={`border rounded-xl p-5 transition-all group ${
                                    community.joined
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 bg-white hover:shadow-md"
                                    }`}
                                onClick={() => handleOpenDashboard(community)}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <span className="text-3xl mr-3">{community.icon || "🌱"}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    community.visibility === "public"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-purple-100 text-purple-800"
                                                }`}>
                                                    {community.visibility}
                                                </span>
                                                {community.joined && (
                                                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                                                        ✓ Joined
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                                    {community.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {community.description}
                                </p>

                                {/* Tags as Hashtags */}
                                {community.tags && community.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
                                        {community.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                        {community.tags.length > 3 && (
                                            <span className="text-sm text-gray-400">
                                                +{community.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {(community.active_members_count || 0).toLocaleString()} members
                                    </div>
<button
    onClick={(e) => {
        e.stopPropagation();  // Prevent the click from bubbling up to the parent div
        toggleMembership(community.id);
    }}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        community.joined
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
>
    {community.joined ? "Leave" : "Join"}
</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* ================================================================
                CREATE COMMUNITY MODAL
                API: POST /communities
                Service: communityService.createCommunity(data)
            ================================================================ */}
            {showModal && (
                <CreateCommunityModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateCommunity}
                    interests={interests}
                />
            )}

{/* Community Dashboard Fullscreen */}
{showDashboard && selectedCommunityForDashboard && (
  <div className="fixed inset-0 z-50 bg-white flex flex-col">
    {/* Content */}
    <div className="flex-1 overflow-y-auto">
      <CommunityDashboard communityId={selectedCommunityForDashboard.id} />
    </div>

  </div>
)}

        </div>
    );
};

// ============================================================================
// FULL-SCREEN CREATE COMMUNITY MODAL
// Professional full-screen design with proper spacing and sensible sizing
// ============================================================================

const CreateCommunityModal = ({ isOpen, onClose, onSubmit, interests }) => {
    const [step, setStep] = useState(1);
    const [topics, setTopics] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tagsInput, setTagsInput] = useState("");
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);
    const [errors, setErrors] = useState({});
    const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);
    const [verificationQuestions, setVerificationQuestions] = useState([{ question: "", required: true }]);
    
    // Image states - store URLs for preview and final URLs
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    
    const [form, setForm] = useState({
        // Basic Info
        name: "",
        description: "",
        rules: "",
        about: "",
        
        // Categorization
        interest_id: "",
        topic_id: "",
        tags: [],
        
        // Type & Status
        type: "student",
        
        // Membership Settings
        require_manual_approval: true,
        eligibility_criteria: "",
        max_members: null,
        
        // Privacy & Access
        visibility: "public",
        join_policy: "request",
        content_visibility: "members_only",
        
        // Professional Settings
        require_linkedin_verification: false,
        
        // Visual Branding
        theme_color: "#3B82F6", // blue-500
        badge_color: "#3B82F6",
        avatar: "", // Store URL
        cover_image: "", // Store URL
        logo: "", // Store URL
        
        // Member Experience
        welcome_message: "",
        
        // Compliance
        terms_of_service: "",
        privacy_policy: "",
        
        // Integration
        enable_api_access: false,
        webhook_url: "",
    });

    const [imageFiles, setImageFiles] = useState({
        avatar: null,
        cover: null,
        logo: null
    });

    // Display-only state for admin settings
    const [displaySettings, setDisplaySettings] = useState({
        // Gamification (Display only)
        level: 1,
        rank: "newcomer",
        
        // Verification Badges (Display only)
        verified_badge_unlocked: false,
        partner_badge: false,
        official_badge: false,
        certified_badge: false,
        trending_badge: false,
        recommended_badge: false,
        
        // AI & Automation (Display only)
        enable_ai_moderation: false,
        enable_ai_recommendations: true,
        enable_smart_replies: false,
    });

    // Fetch topics when interest changes
    useEffect(() => {
        if (!form.interest_id) {
            setTopics([]);
            return;
        }

        const fetchTopics = async () => {
            try {
                const response = await communityService.getTopicsByInterest(form.interest_id);
                const data = normalizeResponse(response, "topics");
                setTopics(data);
            } catch (err) {
                console.error("Error fetching topics:", err);
                setTopics([]);
            }
        };

        fetchTopics();
    }, [form.interest_id]);

    // Fetch tags when topic changes
    useEffect(() => {
        if (!form.topic_id) {
            setAvailableTags([]);
            setFilteredTags([]);
            return;
        }

        const fetchTags = async () => {
            try {
                const response = await communityService.getTags(form.topic_id);
                const data = normalizeResponse(response, "tags");
                setAvailableTags(data);
                setFilteredTags(data);
            } catch (err) {
                console.error("Error fetching tags:", err);
                setAvailableTags([]);
                setFilteredTags([]);
            }
        };

        fetchTags();
    }, [form.topic_id]);

    // Filter tags based on input
    useEffect(() => {
        if (tagsInput.trim() === "") {
            setFilteredTags(availableTags);
        } else {
            const filtered = availableTags.filter(tag =>
                tag.name.toLowerCase().includes(tagsInput.toLowerCase()) ||
                tag.keywords?.some(keyword => 
                    keyword.toLowerCase().includes(tagsInput.toLowerCase())
                )
            );
            setFilteredTags(filtered);
        }
    }, [tagsInput, availableTags]);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Update display settings (not part of form submission)
    const updateDisplaySetting = (field, value) => {
        setDisplaySettings(prev => ({ ...prev, [field]: value }));
    };

// Image Upload Function - Just store filename, backend handles the path
const handleImageUpload = async (file, type) => {
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
    }
    
    setUploadingImage(true);
    
    try {
        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);
        
        // Store the actual file object
        setImageFiles(prev => ({
            ...prev,
            [type]: file
        }));
        
        if (type === 'avatar') {
            setAvatarPreview(previewUrl);
            updateField('avatar', file.name); // Just for display
        } else if (type === 'cover') {
            setCoverPreview(previewUrl);
            updateField('cover_image', file.name);
        } else if (type === 'logo') {
            setLogoPreview(previewUrl);
            updateField('logo', file.name);
        }
        
    } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try again.");
    } finally {
        setUploadingImage(false);
    }
};

    // Cleanup object URLs when component unmounts or images change
    useEffect(() => {
        return () => {
            [avatarPreview, coverPreview, logoPreview].forEach(preview => {
                if (preview && preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [avatarPreview, coverPreview, logoPreview]);

const removeImage = (type) => {
    if (type === 'avatar' && avatarPreview) {
        if (avatarPreview.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(null);
        updateField('avatar', '');
        setImageFiles(prev => ({ ...prev, avatar: null }));
    } else if (type === 'cover' && coverPreview) {
        if (coverPreview.startsWith('blob:')) {
            URL.revokeObjectURL(coverPreview);
        }
        setCoverPreview(null);
        updateField('cover_image', '');
        setImageFiles(prev => ({ ...prev, cover: null }));
    } else if (type === 'logo' && logoPreview) {
        if (logoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(null);
        updateField('logo', '');
        setImageFiles(prev => ({ ...prev, logo: null }));
    }
};

    // Tags functionality
    const addTag = (tag) => {
        if (form.tags.length >= 10) {
            setErrors(prev => ({ ...prev, tags: "Maximum 10 tags allowed" }));
            return;
        }
        
        if (!form.tags.some(t => t.id === tag.id)) {
            updateField("tags", [...form.tags, tag]);
        }
        setTagsInput("");
        setShowTagsDropdown(false);
    };

    const removeTag = (tagId) => {
        updateField("tags", form.tags.filter(tag => tag.id !== tagId));
    };

    const handleTagsInputChange = (e) => {
        const value = e.target.value;
        setTagsInput(value);
        setShowTagsDropdown(value.length > 0);
        if (errors.tags) {
            setErrors(prev => ({ ...prev, tags: null }));
        }
    };

    const handleTagsKeyDown = (e) => {
        if (e.key === 'Enter' && tagsInput.trim()) {
            e.preventDefault();
            const matchingTag = availableTags.find(tag => 
                tag.name.toLowerCase() === tagsInput.trim().toLowerCase()
            );
            if (matchingTag) {
                addTag(matchingTag);
            }
        } else if (e.key === 'Backspace' && !tagsInput && form.tags.length > 0) {
            const lastTag = form.tags[form.tags.length - 1];
            removeTag(lastTag.id);
        }
    };

    // FAQ Management
    const addFaqItem = () => {
        setFaqItems([...faqItems, { question: "", answer: "" }]);
    };

    const removeFaqItem = (index) => {
        if (faqItems.length > 1) {
            const updated = [...faqItems];
            updated.splice(index, 1);
            setFaqItems(updated);
        }
    };

    const updateFaqItem = (index, field, value) => {
        const updated = [...faqItems];
        updated[index][field] = value;
        setFaqItems(updated);
    };

    // Verification Questions Management
    const addVerificationQuestion = () => {
        setVerificationQuestions([...verificationQuestions, { question: "", required: true }]);
    };

    const removeVerificationQuestion = (index) => {
        if (verificationQuestions.length > 1) {
            const updated = [...verificationQuestions];
            updated.splice(index, 1);
            setVerificationQuestions(updated);
        }
    };

    const updateVerificationQuestion = (index, field, value) => {
        const updated = [...verificationQuestions];
        updated[index][field] = value;
        setVerificationQuestions(updated);
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Community name is required";
        if (!form.description.trim()) newErrors.description = "Description helps members understand your community";
        if (!form.interest_id) newErrors.interest_id = "Select an interest area";
        if (!form.topic_id) newErrors.topic_id = "Choose a specific topic";
        if (form.tags.length > 10) newErrors.tags = "Maximum 10 tags allowed";
        if (form.max_members && form.max_members < 1) newErrors.max_members = "Must be at least 1";
        if (form.max_members && form.max_members > 1000000) newErrors.max_members = "Maximum 1,000,000 members";
        if (form.webhook_url && !/^https?:\/\/.+/i.test(form.webhook_url)) {
            newErrors.webhook_url = "Must be a valid URL starting with http:// or https://";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

const prepareFormData = () => {
    return {
        ...form,
        tags: form.tags.map(tag => tag.id), // Extract only IDs from tag objects
        faqs: faqItems.filter(item => item.question.trim() && item.answer.trim()),
        verification_questions: verificationQuestions.filter(item => item.question.trim()),
        custom_theme: {
            primary_color: form.theme_color,
            secondary_color: form.badge_color,
        },
    };
};

const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
        // Create FormData for multipart/form-data
        const formData = new FormData();
        
        // Add all text fields
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('interest_id', form.interest_id);
        formData.append('topic_id', form.topic_id);
        formData.append('type', form.type);
        formData.append('visibility', form.visibility);
        formData.append('join_policy', form.join_policy);
        
        // Add optional text fields
        if (form.rules) formData.append('rules', form.rules);
        if (form.about) formData.append('about', form.about);
        if (form.welcome_message) formData.append('welcome_message', form.welcome_message);
        if (form.eligibility_criteria) formData.append('eligibility_criteria', form.eligibility_criteria);
        if (form.max_members) formData.append('max_members', form.max_members);
        if (form.content_visibility) formData.append('content_visibility', form.content_visibility);
        if (form.terms_of_service) formData.append('terms_of_service', form.terms_of_service);
        if (form.privacy_policy) formData.append('privacy_policy', form.privacy_policy);
        if (form.webhook_url) formData.append('webhook_url', form.webhook_url);
        
        // Add boolean fields
        formData.append('require_manual_approval', form.require_manual_approval ? '1' : '0');
        formData.append('require_linkedin_verification', form.require_linkedin_verification ? '1' : '0');
        formData.append('enable_api_access', form.enable_api_access ? '1' : '0');
        
        // Add colors
        formData.append('theme_color', form.theme_color);
        formData.append('badge_color', form.badge_color);
        
        // Add tags as array (send only IDs)
        form.tags.forEach(tag => {
            formData.append('tags[]', tag.id);
        });
        
        // Add FAQs as JSON string
        const validFaqs = faqItems.filter(item => item.question.trim() && item.answer.trim());
        if (validFaqs.length > 0) {
            formData.append('faqs', JSON.stringify(validFaqs));
        }
        
        // Add verification questions as JSON string
        const validQuestions = verificationQuestions.filter(item => item.question.trim());
        if (validQuestions.length > 0) {
            formData.append('verification_questions', JSON.stringify(validQuestions));
        }
        
        // Add custom theme as JSON string
        formData.append('custom_theme', JSON.stringify({
            primary_color: form.theme_color,
            secondary_color: form.badge_color,
        }));
        
        // Add IMAGE FILES (actual file objects, not filenames!)
        if (imageFiles.avatar) {
            formData.append('avatar', imageFiles.avatar);
        }
        if (imageFiles.cover) {
            formData.append('cover_image', imageFiles.cover);
        }
        if (imageFiles.logo) {
            formData.append('logo', imageFiles.logo);
        }
        
        // Send the FormData
        await onSubmit(formData);
        
    } catch (err) {
        setErrors({ submit: err.message || "Failed to create community" });
    } finally {
        setLoading(false);
    }
};

    if (!isOpen) return null;

    // Feature Card Component
    const FeatureCard = ({ icon, title, description, isSelected, onClick }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-full p-4 border rounded-lg text-left transition-colors hover:border-blue-400 ${
                isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
            }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${
                    isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{title}</h3>
                    <p className="text-xs text-gray-600">{description}</p>
                </div>
                {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
        </button>
    );

    // Option Card Component
    const OptionCard = ({ icon, title, description, isSelected, onClick, color = "blue" }) => {
        const colors = {
            blue: { border: 'border-blue-200', bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600' },
            purple: { border: 'border-purple-200', bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-600' },
            green: { border: 'border-green-200', bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-600' },
            orange: { border: 'border-orange-200', bg: 'bg-orange-50', iconBg: 'bg-orange-100', text: 'text-orange-600' },
            red: { border: 'border-red-200', bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600' },
            indigo: { border: 'border-indigo-200', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-600' }
        };
        const colorSet = colors[color];

        return (
            <button
                type="button"
                onClick={onClick}
                className={`w-full p-3 border rounded-lg text-left transition-colors hover:border-gray-300 ${
                    isSelected 
                        ? `${colorSet.border} ${colorSet.bg} border-2` 
                        : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${colorSet.iconBg} ${colorSet.text}`}>
                        <span className="text-sm">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-0.5">{title}</h4>
                        <p className="text-xs text-gray-600 truncate">{description}</p>
                    </div>
                    {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>
            </button>
        );
    };

    // Tag Component
    const TagPill = ({ tag, onRemove }) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
            <span className="text-xs">{tag.icon || '🏷️'}</span>
            <span>{tag.name}</span>
            <button
                type="button"
                onClick={() => onRemove(tag.id)}
                className="w-4 h-4 rounded-full hover:bg-blue-200 flex items-center justify-center transition-colors ml-1"
            >
                <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );

    // Toggle Switch Component
    const ToggleSwitch = ({ enabled, onChange, label, description, disabled = false }) => (
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <label className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                    {label} {disabled && <span className="text-xs text-gray-500 ml-1">(Admin Controlled)</span>}
                </label>
                {description && (
                    <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{description}</p>
                )}
            </div>
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    enabled ? 'bg-blue-600' : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && onChange(!enabled)}
                disabled={disabled}
            >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
        </div>
    );

    // Image Upload Component
    const ImageUpload = ({ 
        label, 
        preview, 
        onUpload, 
        onRemove, 
        type, 
        description,
        aspectRatio = "square",
        required = false 
    }) => {
        const fileInputRef = useRef(null);
        
        const handleClick = () => {
            fileInputRef.current?.click();
        };
        
        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                onUpload(file, type);
            }
        };
        
        const aspectClass = aspectRatio === "square" 
            ? "aspect-square" 
            : aspectRatio === "banner" 
                ? "aspect-[21/9]" 
                : "aspect-square";
        
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {preview && (
                        <button
                            type="button"
                            onClick={() => onRemove(type)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            Remove
                        </button>
                    )}
                </div>
                
                <div className={`border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors ${aspectClass} bg-gray-50`}>
                    {preview ? (
                        <div className="relative w-full h-full group">
                            <img 
                                src={preview} 
                                alt={`${label} preview`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleClick}
                            className="w-full h-full flex flex-col items-center justify-center p-6"
                        >
                            <div className="p-3 bg-gray-100 rounded-full mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900 mb-1">
                                Upload {label}
                            </span>
                            <span className="text-xs text-gray-500">
                                Click to browse or drag and drop
                            </span>
                            <span className="text-xs text-gray-400 mt-2">
                                PNG, JPG, GIF up to 5MB
                            </span>
                        </button>
                    )}
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                
                {description && (
                    <p className="text-xs text-gray-500">
                        {description}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Create New Community</h1>
                                <p className="text-sm text-gray-600 mt-0.5">Build a space where like-minded people can connect</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || uploadingImage}
                                className={`px-5 py-2 text-sm rounded-lg font-medium transition-colors ${
                                    loading || uploadingImage
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating...
                                    </span>
                                ) : uploadingImage ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : 'Create Community'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-6">
                    {[
                        { number: 1, label: "Basic Info", active: step === 1 },
                        { number: 2, label: "Settings", active: step === 2 },
                        { number: 3, label: "Advanced", active: step === 3 }
                    ].map((stepItem, index) => (
                        <div key={stepItem.number} className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => setStep(stepItem.number)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1.5 ${
                                        stepItem.active 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                                >
                                    {stepItem.number}
                                </button>
                                <span className={`text-xs font-medium ${
                                    stepItem.active ? 'text-blue-600' : 'text-gray-500'
                                }`}>
                                    {stepItem.label}
                                </span>
                            </div>
                            {index < 2 && (
                                <div className={`w-12 h-0.5 rounded-full ${
                                    stepItem.active ? 'bg-blue-200' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 max-w-7xl mx-auto">
                {/* Error Display */}
                {errors.submit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h4 className="font-medium text-red-800">Error Creating Community</h4>
                                <p className="text-sm text-red-700 mt-0.5">{errors.submit}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Form (2/3 width) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Community Identity Section */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Community Identity
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        {/* Name Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Community Name <span className="text-red-500">*</span>
                                                </label>
                                                <span className="text-xs text-gray-500">{form.name.length}/100</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => updateField("name", e.target.value)}
                                                maxLength={100}
                                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
                                                    errors.name ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                placeholder="Give your community a memorable name"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.name}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Choose a clear, descriptive name that represents your community's purpose
                                            </p>
                                        </div>

                                        {/* Description Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Description <span className="text-red-500">*</span>
                                                </label>
                                                <span className="text-xs text-gray-500">{form.description.length}/1000</span>
                                            </div>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => updateField("description", e.target.value)}
                                                maxLength={1000}
                                                rows={4}
                                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors resize-none ${
                                                    errors.description ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                                }`}
                                                placeholder="Describe what your community is about, what members can expect, and what makes it unique..."
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                A compelling description helps attract the right members and sets clear expectations
                                            </p>
                                        </div>

                                        {/* About Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    About Community
                                                </label>
                                                <span className="text-xs text-gray-500">{form.about?.length || 0}/2000</span>
                                            </div>
                                            <textarea
                                                value={form.about}
                                                onChange={(e) => updateField("about", e.target.value)}
                                                maxLength={2000}
                                                rows={3}
                                                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                                placeholder="Detailed information about your community's mission, values, and history..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Optional: Provide more detailed information about your community
                                            </p>
                                        </div>

                                        {/* Rules Field */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Community Rules
                                                </label>
                                                <span className="text-xs text-gray-500">{form.rules?.length || 0}/5000</span>
                                            </div>
                                            <textarea
                                                value={form.rules}
                                                onChange={(e) => updateField("rules", e.target.value)}
                                                maxLength={5000}
                                                rows={4}
                                                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                                placeholder="Define community rules and guidelines for members..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Establish clear guidelines for member behavior and content
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categorization Section */}
                            <div className="space-y-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Categorization
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Interest Field */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Interest Area <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={form.interest_id}
                                                onChange={(e) => {
                                                    updateField("interest_id", e.target.value);
                                                    updateField("topic_id", "");
                                                    updateField("tags", []);
                                                }}
                                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
                                                    errors.interest_id ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                                }`}
                                            >
                                                <option value="">Select primary interest...</option>
                                                {interests.map((interest) => (
                                                    <option key={interest.id} value={interest.id}>
                                                        {interest.icon} {interest.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.interest_id && (
                                                <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.interest_id}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Choose the main category that best fits your community
                                            </p>
                                        </div>

                                        {/* Topic Field */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Specific Topic <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={form.topic_id}
                                                onChange={(e) => {
                                                    updateField("topic_id", e.target.value);
                                                    updateField("tags", []);
                                                }}
                                                disabled={!form.interest_id}
                                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
                                                    errors.topic_id ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                                } ${
                                                    !form.interest_id ? 'bg-gray-100 text-gray-500' : ''
                                                }`}
                                            >
                                                <option value="">
                                                    {!form.interest_id ? "Select interest first..." : "Choose specific topic..."}
                                                </option>
                                                {topics.map((topic) => (
                                                    <option key={topic.id} value={topic.id}>
                                                        {topic.icon} {topic.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.topic_id && (
                                                <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.topic_id}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                Select a specific topic within your chosen interest area
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tags Section */}
                                    {form.topic_id && (
                                        <div className="space-y-4 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Tags <span className="text-gray-500 font-normal">(Optional)</span>
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Add relevant tags to help members find your community
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {form.tags.length}/10 tags
                                                </div>
                                            </div>
                                            
                                            {/* Selected Tags */}
                                            {form.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    {form.tags.map((tag) => (
                                                        <TagPill 
                                                            key={tag.id} 
                                                            tag={tag} 
                                                            onRemove={removeTag}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Tags Input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={tagsInput}
                                                    onChange={handleTagsInputChange}
                                                    onKeyDown={handleTagsKeyDown}
                                                    onFocus={() => setShowTagsDropdown(true)}
                                                    placeholder="Type to search tags or press Enter to add..."
                                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400"
                                                />
                                                
                                                {/* Tags Dropdown */}
                                                {showTagsDropdown && filteredTags.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        <div className="p-2">
                                                            {filteredTags.map((tag) => (
                                                                <button
                                                                    key={tag.id}
                                                                    type="button"
                                                                    onClick={() => addTag(tag)}
                                                                    disabled={form.tags.some(t => t.id === tag.id)}
                                                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                                                        form.tags.some(t => t.id === tag.id)
                                                                            ? 'text-gray-400 cursor-not-allowed'
                                                                            : 'text-gray-700 hover:text-blue-700'
                                                                    }`}
                                                                >
                                                                    <span className="text-lg">{tag.icon || '🏷️'}</span>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-sm">{tag.name}</div>
                                                                        {tag.description && (
                                                                            <div className="text-xs text-gray-500 mt-0.5">{tag.description}</div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {errors.tags && (
                                                <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.tags}
                                                </p>
                                            )}

                                            {/* Suggested Tags */}
                                            {availableTags.length > 0 && (
                                                <div className="pt-3">
                                                    <p className="text-xs text-gray-600 mb-2">Popular tags for this topic:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {availableTags.slice(0, 8).map((tag) => (
                                                            <button
                                                                key={tag.id}
                                                                type="button"
                                                                onClick={() => addTag(tag)}
                                                                disabled={form.tags.some(t => t.id === tag.id)}
                                                                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                                                    form.tags.some(t => t.id === tag.id)
                                                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                                                }`}
                                                            >
                                                                {tag.icon} {tag.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Settings (1/3 width) */}
                        <div className="space-y-8">
                            {/* Community Images Section */}
                            <div className="space-y-6">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Community Images
                                </h3>
                                
                                <div className="space-y-6">
                                    {/* Avatar Image */}
                                    <ImageUpload
                                        label="Avatar"
                                        preview={avatarPreview}
                                        onUpload={handleImageUpload}
                                        onRemove={removeImage}
                                        type="avatar"
                                        description="Square image that represents your community (Recommended: 400×400px)"
                                        aspectRatio="square"
                                    />
                                    
                                    {/* Cover Image */}
                                    <ImageUpload
                                        label="Cover Image"
                                        preview={coverPreview}
                                        onUpload={handleImageUpload}
                                        onRemove={removeImage}
                                        type="cover"
                                        description="Wide banner image for your community header (Recommended: 1920×640px)"
                                        aspectRatio="banner"
                                    />
                                    
                                    {/* Logo Image */}
                                    <ImageUpload
                                        label="Logo"
                                        preview={logoPreview}
                                        onUpload={handleImageUpload}
                                        onRemove={removeImage}
                                        type="logo"
                                        description="Official logo for your community (Recommended: 200×200px)"
                                        aspectRatio="square"
                                    />
                                </div>
                            </div>

                            {/* Color Theme */}
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                    Color Theme
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Primary Color
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={form.theme_color}
                                                onChange={(e) => updateField("theme_color", e.target.value)}
                                                className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={form.theme_color}
                                                    onChange={(e) => updateField("theme_color", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                                    placeholder="#3B82F6"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Sets the main color for your community
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Badge Color
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={form.badge_color}
                                                onChange={(e) => updateField("badge_color", e.target.value)}
                                                className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={form.badge_color}
                                                    onChange={(e) => updateField("badge_color", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                                    placeholder="#3B82F6"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Color for badges and highlights
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Settings */}
                {step === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Membership Settings */}
                            <div className="space-y-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a5 5 0 00-5-5" />
                                    </svg>
                                    Membership Settings
                                </h2>
                                
                                <div className="space-y-6">
                                    {/* Max Members */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Maximum Members
                                        </label>
                                        <input
                                            type="number"
                                            value={form.max_members || ''}
                                            onChange={(e) => updateField("max_members", e.target.value ? parseInt(e.target.value) : null)}
                                            min="1"
                                            max="1000000"
                                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
                                                errors.max_members ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            placeholder="Leave empty for unlimited members"
                                        />
                                        {errors.max_members && (
                                            <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.max_members}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Set a limit on total members (1-1,000,000) or leave empty for unlimited
                                        </p>
                                    </div>

                                    {/* Eligibility Criteria */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Eligibility Criteria
                                            </label>
                                            <span className="text-xs text-gray-500">{form.eligibility_criteria?.length || 0}/2000</span>
                                        </div>
                                        <textarea
                                            value={form.eligibility_criteria}
                                            onChange={(e) => updateField("eligibility_criteria", e.target.value)}
                                            maxLength={2000}
                                            rows={3}
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                            placeholder="Define who can join your community (e.g., students, professionals, specific interests)..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional: Specify requirements for joining your community
                                        </p>
                                    </div>

                                    {/* Manual Approval Toggle */}
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                                        <ToggleSwitch
                                            label="Require Manual Approval"
                                            description="Manually review and approve each new member"
                                            enabled={form.require_manual_approval}
                                            onChange={(value) => updateField("require_manual_approval", value)}
                                        />
                                    </div>

                                    {/* LinkedIn Verification */}
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                                        <ToggleSwitch
                                            label="Require LinkedIn Verification"
                                            description="Members must verify their LinkedIn profile"
                                            enabled={form.require_linkedin_verification}
                                            onChange={(value) => updateField("require_linkedin_verification", value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Welcome Message */}
                            <div className="space-y-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Member Experience
                                </h2>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Welcome Message
                                        </label>
                                        <span className="text-xs text-gray-500">{form.welcome_message?.length || 0}/1000</span>
                                    </div>
                                    <textarea
                                        value={form.welcome_message}
                                        onChange={(e) => updateField("welcome_message", e.target.value)}
                                        maxLength={1000}
                                        rows={4}
                                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                        placeholder="Write a welcome message that new members will see when they join..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This message helps new members feel welcomed and understand what to do next
                                    </p>
                                </div>
                            </div>

                            {/* FAQs */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Frequently Asked Questions
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addFaqItem}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add FAQ
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {faqItems.map((faq, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm font-medium text-gray-700">FAQ #{index + 1}</span>
                                                {faqItems.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFaqItem(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                                                    placeholder="Enter question..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                                                    placeholder="Enter answer..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Privacy & Access */}
                        <div className="space-y-8">
                            {/* Privacy & Access */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Privacy & Access
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Visibility Setting</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { value: "public", icon: "🌐", title: "Public", desc: "Anyone can find and view content", color: "green" },
                                                { value: "private", icon: "🔒", title: "Private", desc: "Only members can view content", color: "orange" },
                                                { value: "unlisted", icon: "👁️", title: "Unlisted", desc: "Hidden from search, accessible via link", color: "purple" },
                                                { value: "invite_only", icon: "✉️", title: "Invite Only", desc: "Requires invitation to view", color: "blue" }
                                            ].map((option) => (
                                                <OptionCard
                                                    key={option.value}
                                                    icon={option.icon}
                                                    title={option.title}
                                                    description={option.desc}
                                                    isSelected={form.visibility === option.value}
                                                    onClick={() => updateField("visibility", option.value)}
                                                    color={option.color}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Join Policy</label>
                                        <div className="space-y-2">
                                            {[
                                                { value: "open", icon: "🚪", title: "Open Join", desc: "Anyone can join instantly", color: "green" },
                                                { value: "request", icon: "✋", title: "Request to Join", desc: "Members must request to join", color: "blue" },
                                                { value: "invite", icon: "📨", title: "Invite Only", desc: "Members must be invited", color: "purple" },
                                                { value: "application", icon: "📝", title: "Application", desc: "Requires form submission", color: "orange" }
                                            ].map((option) => (
                                                <OptionCard
                                                    key={option.value}
                                                    icon={option.icon}
                                                    title={option.title}
                                                    description={option.desc}
                                                    isSelected={form.join_policy === option.value}
                                                    onClick={() => updateField("join_policy", option.value)}
                                                    color={option.color}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">Content Visibility</label>
                                        <div className="space-y-2">
                                            {[
                                                { value: "public", icon: "🌍", title: "Public", desc: "Anyone can view content", color: "green" },
                                                { value: "members_only", icon: "👥", title: "Members Only", desc: "Only community members", color: "blue" },
                                                { value: "verified_members_only", icon: "✅", title: "Verified Only", desc: "Only verified members", color: "purple" }
                                            ].map((option) => (
                                                <OptionCard
                                                    key={option.value}
                                                    icon={option.icon}
                                                    title={option.title}
                                                    description={option.desc}
                                                    isSelected={form.content_visibility === option.value}
                                                    onClick={() => updateField("content_visibility", option.value)}
                                                    color={option.color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Advanced Settings */}
                {step === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Verification Questions */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Verification Questions
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addVerificationQuestion}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Question
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {verificationQuestions.map((question, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm font-medium text-gray-700">Question #{index + 1}</span>
                                                {verificationQuestions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVerificationQuestion(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={question.question}
                                                    onChange={(e) => updateVerificationQuestion(index, 'question', e.target.value)}
                                                    placeholder="Enter verification question..."
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`required-${index}`}
                                                        checked={question.required}
                                                        onChange={(e) => updateVerificationQuestion(index, 'required', e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`required-${index}`} className="text-sm text-gray-700">
                                                        Required for joining
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Integration */}
                            <div className="space-y-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Integration
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Webhook URL
                                        </label>
                                        <input
                                            type="url"
                                            value={form.webhook_url}
                                            onChange={(e) => updateField("webhook_url", e.target.value)}
                                            className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
                                                errors.webhook_url ? "border-red-300" : "border-gray-300 hover:border-gray-400"
                                            }`}
                                            placeholder="https://example.com/webhook"
                                        />
                                        {errors.webhook_url && (
                                            <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.webhook_url}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Receive real-time updates about community activities
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                                        <ToggleSwitch
                                            label="Enable API Access"
                                            description="Allow programmatic access to community data"
                                            enabled={form.enable_api_access}
                                            onChange={(value) => updateField("enable_api_access", value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Compliance */}
                            <div className="space-y-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Compliance & Legal
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Terms of Service
                                            </label>
                                            <span className="text-xs text-gray-500">{form.terms_of_service?.length || 0}/5000</span>
                                        </div>
                                        <textarea
                                            value={form.terms_of_service}
                                            onChange={(e) => updateField("terms_of_service", e.target.value)}
                                            maxLength={5000}
                                            rows={4}
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                            placeholder="Custom terms of service for your community..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional: Override default terms of service
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Privacy Policy
                                            </label>
                                            <span className="text-xs text-gray-500">{form.privacy_policy?.length || 0}/5000</span>
                                        </div>
                                        <textarea
                                            value={form.privacy_policy}
                                            onChange={(e) => updateField("privacy_policy", e.target.value)}
                                            maxLength={5000}
                                            rows={4}
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-400 resize-none"
                                            placeholder="Custom privacy policy for your community..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional: Override default privacy policy
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* AI & Automation - DISPLAY ONLY SECTION */}
                            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    AI & Automation Settings
                                    <span className="text-xs font-normal bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        Admin Controlled
                                    </span>
                                </h2>
                                
                                <div className="space-y-4 opacity-70">
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="AI Moderation"
                                            description="Automatically flag inappropriate content"
                                            enabled={displaySettings.enable_ai_moderation}
                                            onChange={(value) => updateDisplaySetting("enable_ai_moderation", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="AI Recommendations"
                                            description="Suggest relevant content and members"
                                            enabled={displaySettings.enable_ai_recommendations}
                                            onChange={(value) => updateDisplaySetting("enable_ai_recommendations", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Smart Replies"
                                            description="Suggest automated responses"
                                            enabled={displaySettings.enable_smart_replies}
                                            onChange={(value) => updateDisplaySetting("enable_smart_replies", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600 italic pt-4">
                                        <p>ℹ️ These settings are managed by platform administrators based on community performance and compliance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Badges & Gamification - DISPLAY ONLY */}
                        <div className="space-y-8">
                            {/* Gamification - DISPLAY ONLY */}
                            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        Gamification Settings
                                    </h3>
                                    <span className="text-xs font-normal bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        Admin Controlled
                                    </span>
                                </div>
                                
                                <div className="space-y-4 opacity-70">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Starting Level
                                        </label>
                                        <input
                                            type="number"
                                            value={displaySettings.level}
                                            onChange={(e) => updateDisplaySetting("level", parseInt(e.target.value) || 1)}
                                            min="1"
                                            max="100"
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Platform sets starting level based on community quality
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Starting Rank
                                        </label>
                                        <select
                                            value={displaySettings.rank}
                                            onChange={(e) => updateDisplaySetting("rank", e.target.value)}
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white"
                                            disabled
                                        >
                                            <option value="newcomer">Newcomer</option>
                                            <option value="rising">Rising</option>
                                            <option value="established">Established</option>
                                            <option value="prominent">Prominent</option>
                                            <option value="elite">Elite</option>
                                            <option value="legendary">Legendary</option>
                                            <option value="hall_of_fame">Hall of Fame</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Rank is assigned by platform administrators
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600 italic pt-4">
                                        <p>ℹ️ Gamification settings are automatically configured based on community engagement and quality metrics.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Special Badges - DISPLAY ONLY */}
                            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Special Badges
                                    </h3>
                                    <span className="text-xs font-normal bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        Admin Awarded
                                    </span>
                                </div>
                                
                                <div className="space-y-3 opacity-70">
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Verified Badge"
                                            description="Community meets verification standards"
                                            enabled={displaySettings.verified_badge_unlocked}
                                            onChange={(value) => updateDisplaySetting("verified_badge_unlocked", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Partner Badge"
                                            description="Official partner community"
                                            enabled={displaySettings.partner_badge}
                                            onChange={(value) => updateDisplaySetting("partner_badge", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Official Badge"
                                            description="Official organization community"
                                            enabled={displaySettings.official_badge}
                                            onChange={(value) => updateDisplaySetting("official_badge", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Certified Badge"
                                            description="Quality certified community"
                                            enabled={displaySettings.certified_badge}
                                            onChange={(value) => updateDisplaySetting("certified_badge", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Trending Badge"
                                            description="High growth community"
                                            enabled={displaySettings.trending_badge}
                                            onChange={(value) => updateDisplaySetting("trending_badge", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
                                        <ToggleSwitch
                                            label="Recommended Badge"
                                            description="Editor's choice recommendation"
                                            enabled={displaySettings.recommended_badge}
                                            onChange={(value) => updateDisplaySetting("recommended_badge", value)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600 italic pt-4">
                                        <p>ℹ️ Special badges are awarded by platform administrators based on community performance, quality, and partnerships.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-5 py-2.5 text-sm text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous Step
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {step < 3 && (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="px-5 py-2.5 text-sm bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                Next Step
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom Information */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            By creating a community, you agree to our <a href="#" className="text-blue-600 hover:underline font-medium">Community Guidelines</a> and <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Need help? <a href="#" className="text-blue-600 hover:underline">Visit our help center</a> or <a href="#" className="text-blue-600 hover:underline">contact support</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverCommunities;