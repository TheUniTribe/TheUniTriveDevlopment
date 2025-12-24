/**
 * Community Service
 * 
 * Relationships:
 * - Interest -> Topics (One to Many)
 * - Topics -> Communities (Many to Many)
 * - Communities -> Tags (Many to Many)
 */


import api from '../utils/fetchService';

// =============================================================================
// INTERESTS
// =============================================================================

/** GET /interests */
const getInterests = async () => {
    return await api.get('/interests');
};

// =============================================================================
// TOPICS
// =============================================================================

/** GET /interests/{interest}/topics */
const getTopicsByInterest = async (interestId) => {
    if (!interestId) return [];
    return await api.get(`/interests/${interestId}/topics`);
};

/** GET /topics */
const getTopics = async () => {
    return await api.get('/topics');
};

// =============================================================================
// TAGS
// =============================================================================

/** GET /tags */
const getTags = async () => {
    return await api.get('/tags');
};

/** GET /communities/{community}/tags */
const getTagsByCommunity = async (communityId) => {
    if (!communityId) return [];
    return await api.get(`/communities/${communityId}/tags`);
};

// =============================================================================
// COMMUNITIES
// =============================================================================

/** GET /communities */
const getCommunities = async () => {
    return await api.get('/communities');
};

/** GET /communities/published */
const getPublishedCommunities = async () => {
    return await api.get('/communities/published');
};

/** GET /communities/trending */
const getTrendingCommunities = async () => {
    return await api.get('/communities/trending');
};

/** GET /communities/featured */
const getFeaturedCommunities = async () => {
    return await api.get('/communities/featured');
};

/** GET /communities/leaderboard/top */
const getLeaderboard = async () => {
    return await api.get('/communities/leaderboard/top');
};

/** GET /communities/search?q={query} */
const searchCommunities = async (query) => {
    if (!query?.trim()) return [];
    return await api.get(`/communities/search?q=${encodeURIComponent(query.trim())}`);
};

/** GET /communities/{slug} */
const getCommunity = async (slug) => {
    return await api.get(`/communities/${slug}`);
};

/** GET /topics/{topic}/communities */
const getCommunitiesByTopic = async (topicId) => {
    if (!topicId) return [];
    return await api.get(`/topics/${topicId}/communities`);
};

/** GET /tags/{tag}/communities */
const getCommunitiesByTag = async (tagId) => {
    if (!tagId) return [];
    return await api.get(`/tags/${tagId}/communities`);
};

// =============================================================================
// MEMBERSHIP (Auth Required)
// =============================================================================

/** POST /communities/{community}/join */
const joinCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/join`);
};

/** POST /communities/{community}/leave */
const leaveCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/leave`);
};

// =============================================================================
// CRUD (Auth Required)
// =============================================================================

/** POST /communities */
const createCommunity = async (data) => {
    return await api.post('/communities', data);
};

/** PUT /communities/{community} */
const updateCommunity = async (communityId, data) => {
    return await api.put(`/communities/${communityId}`, data);
};

/** DELETE /communities/{community} */
const deleteCommunity = async (communityId) => {
    return await api.delete(`/communities/${communityId}`);
};

// =============================================================================
// WORKFLOW (Auth Required)
// =============================================================================

/** POST /communities/{community}/submit */
const submitForApproval = async (communityId) => {
    return await api.post(`/communities/${communityId}/submit`);
};

/** POST /communities/{community}/archive */
const archiveCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/archive`);
};

/** POST /communities/{community}/unarchive */
const unarchiveCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/unarchive`);
};

// =============================================================================
// ADMIN (Auth Required)
// =============================================================================

/** POST /communities/{community}/approve */
const approveCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/approve`);
};

/** POST /communities/{community}/reject */
const rejectCommunity = async (communityId, reason) => {
    return await api.post(`/communities/${communityId}/reject`, { rejection_reason: reason });
};

/** POST /communities/{community}/block */
const blockCommunity = async (communityId, reason) => {
    return await api.post(`/communities/${communityId}/block`, { block_reason: reason });
};

/** POST /communities/{community}/unblock */
const unblockCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/unblock`);
};

/** POST /communities/{community}/verify */
const verifyCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/verify`);
};

/** POST /communities/{community}/unverify */
const unverifyCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/unverify`);
};

/** POST /communities/{community}/feature */
const featureCommunity = async (communityId, priority = 0) => {
    return await api.post(`/communities/${communityId}/feature`, { priority });
};

/** POST /communities/{community}/unfeature */
const unfeatureCommunity = async (communityId) => {
    return await api.post(`/communities/${communityId}/unfeature`);
};

// =============================================================================
// EXPORT
// =============================================================================

const communityService = {
    // Interests
    getInterests,

    // Topics  
    getTopicsByInterest,
    getTopics,

    // Tags
    getTags,
    getTagsByCommunity,

    // Communities
    getCommunities,
    getPublishedCommunities,
    getTrendingCommunities,
    getFeaturedCommunities,
    getLeaderboard,
    searchCommunities,
    getCommunity,
    getCommunitiesByTopic,
    getCommunitiesByTag,

    // Membership
    joinCommunity,
    leaveCommunity,

    // CRUD
    createCommunity,
    updateCommunity,
    deleteCommunity,

    // Workflow
    submitForApproval,
    archiveCommunity,
    unarchiveCommunity,

    // Admin
    approveCommunity,
    rejectCommunity,
    blockCommunity,
    unblockCommunity,
    verifyCommunity,
    unverifyCommunity,
    featureCommunity,
    unfeatureCommunity,
};

export default communityService;