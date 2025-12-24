// src/services/profileService.js
import api from "../utils/fetchService";

/**
 * ProfileService
 *
 * Notes:
 * - By default this file uses routes under /profiles/:id (adjust the ROUTES below
 *   if your backend uses /api/users/:id or a different structure).
 * - Uses POST for create, PATCH for updates (change to PUT if your backend requires it).
 * - fetchService handles headers, CSRF and FormData content-type behaviour.
 */

const ROUTES = {
  PROFILE: (id) => `/profiles/${id}`,
  EXPERIENCES: (id) => `/profiles/${id}/experiences`,
  EDUCATIONS: (id) => `/profiles/${id}/educations`,
  // If you have other user-scoped API namespace (uncomment / edit as needed)
  // USER_API: (id) => `/api/users/${id}`,
};

class ProfileService {
  // ---------- Profile ----------
  async getProfile(userId) {
    try {
      console.log(`[profileService] GET ${ROUTES.PROFILE(userId)}`);
      const data = await api.get(ROUTES.PROFILE(userId));
      return data;
    } catch (err) {
      console.error("[profileService] getProfile error:", err);
      throw err;
    }
  }

  // Use PATCH for partial updates. Use PUT if your API expects a full replacement.
  async updateProfile(userId, payload) {
    try {
      const isForm = payload instanceof FormData;
      console.log(
        `[profileService] PATCH ${ROUTES.PROFILE(userId)} (isForm: ${isForm})`,
        isForm ? "[FormData]" : payload
      );

      // many backends accept PATCH for profile edits; change to api.put if needed
      return await api.post(ROUTES.PROFILE(userId), payload);
    } catch (err) {
      console.error("[profileService] updateProfile error:", err);
      throw err;
    }
  }

  // ---------- Educations ----------
  async getEducations(userId) {
    try {
      console.log(`[profileService] GET ${ROUTES.EDUCATIONS(userId)}`);
      return await api.get(ROUTES.EDUCATIONS(userId));
    } catch (err) {
      console.error("[profileService] getEducations error:", err);
      throw err;
    }
  }

  async addEducation(userId, educationData) {
    try {
      const isForm = educationData instanceof FormData;
      console.log(`[profileService] POST ${ROUTES.EDUCATIONS(userId)} (isForm: ${isForm})`, educationData);
      return await api.post(ROUTES.EDUCATIONS(userId), educationData);
    } catch (err) {
      console.error("[profileService] addEducation error:", err);
      throw err;
    }
  }

  async updateEducation(userId, educationId, educationData) {
    try {
      const isForm = educationData instanceof FormData;
      const url = `${ROUTES.EDUCATIONS(userId)}/${educationId}`;
      console.log(`[profileService] PUT ${url} (isForm: ${isForm})`, educationData);
      return await api.put(url, educationData);
    } catch (err) {
      console.error("[profileService] updateEducation error:", err);
      throw err;
    }
  }

  async deleteEducation(userId, educationId) {
    try {
      const url = `${ROUTES.EDUCATIONS(userId)}/${educationId}`;
      console.log(`[profileService] DELETE ${url}`);
      return await api.delete(url);
    } catch (err) {
      console.error("[profileService] deleteEducation error:", err);
      throw err;
    }
  }

  // ---------- Experiences ----------
  async getExperiences(userId) {
    try {
      console.log(`[profileService] GET ${ROUTES.EXPERIENCES(userId)}`);
      return await api.get(ROUTES.EXPERIENCES(userId));
    } catch (err) {
      console.error("[profileService] getExperiences error:", err);
      throw err;
    }
  }

  async addExperience(userId, experienceData) {
    try {
      const isForm = experienceData instanceof FormData;
      console.log(`[profileService] POST ${ROUTES.EXPERIENCES(userId)} (isForm: ${isForm})`, experienceData);
      return await api.post(ROUTES.EXPERIENCES(userId), experienceData);
    } catch (err) {
      console.error("[profileService] addExperience error:", err);
      throw err;
    }
  }

  async updateExperience(userId, experienceId, experienceData) {
    try {
      const isForm = experienceData instanceof FormData;
      const url = `${ROUTES.EXPERIENCES(userId)}/${experienceId}`;
      console.log(`[profileService] PUT ${url} (isForm: ${isForm})`, experienceData);
      return await api.put(url, experienceData);
    } catch (err) {
      console.error("[profileService] updateExperience error:", err);
      throw err;
    }
  }

  async deleteExperience(userId, experienceId) {
    try {
      const url = `${ROUTES.EXPERIENCES(userId)}/${experienceId}`;
      console.log(`[profileService] DELETE ${url}`);
      return await api.delete(url);
    } catch (err) {
      console.error("[profileService] deleteExperience error:", err);
      throw err;
    }
  }

  // ---------- Social links & About (optional endpoints) ----------
  // If your backend uses /profiles/:id/social-links or /api/users/:id/... change the route below
  async updateSocialLinks(userId, socialLinksData) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/social-links`; // e.g. /profiles/:id/social-links
      console.log(`[profileService] PATCH ${url}`, socialLinksData);
      return await api.patch(url, socialLinksData);
    } catch (err) {
      console.error("[profileService] updateSocialLinks error:", err);
      throw err;
    }
  }

  async updateAbout(userId, aboutData) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/about`; // e.g. /profiles/:id/about
      console.log(`[profileService] PATCH ${url}`, aboutData);
      return await api.patch(url, aboutData);
    } catch (err) {
      console.error("[profileService] updateAbout error:", err);
      throw err;
    }
  }

  // ---------- Comments (optional) ----------
  async getComments(userId) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/comments`;
      console.log(`[profileService] GET ${url}`);
      return await api.get(url);
    } catch (err) {
      console.error("[profileService] getComments error:", err);
      throw err;
    }
  }

  async addComment(userId, commentData) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/comments`;
      console.log(`[profileService] POST ${url}`, commentData);
      return await api.post(url, commentData);
    } catch (err) {
      console.error("[profileService] addComment error:", err);
      throw err;
    }
  }

  // ---------- Network helpers (optional) ----------
  async getFollowers(userId) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/followers`;
      console.log(`[profileService] GET ${url}`);
      return await api.get(url);
    } catch (err) {
      console.error("[profileService] getFollowers error:", err);
      throw err;
    }
  }

  async getFollowing(userId) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/following`;
      console.log(`[profileService] GET ${url}`);
      return await api.get(url);
    } catch (err) {
      console.error("[profileService] getFollowing error:", err);
      throw err;
    }
  }

  async followUser(userId, targetUserId) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/follow/${targetUserId}`;
      console.log(`[profileService] POST ${url}`);
      return await api.post(url);
    } catch (err) {
      console.error("[profileService] followUser error:", err);
      throw err;
    }
  }

  async unfollowUser(userId, targetUserId) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/follow/${targetUserId}`;
      console.log(`[profileService] DELETE ${url}`);
      return await api.delete(url);
    } catch (err) {
      console.error("[profileService] unfollowUser error:", err);
      throw err;
    }
  }

  // ---------- File uploads (optional) ----------
  async uploadProfilePicture(userId, formData) {
    try {
      const url = `${ROUTES.PROFILE(userId)}/profile-picture`;
      console.log(`[profileService] POST ${url} (FormData)`);
      return await api.post(url, formData);
    } catch (err) {
      console.error("[profileService] uploadProfilePicture error:", err);
      throw err;
    }
  }
}

const profileService = new ProfileService();
export default profileService;
