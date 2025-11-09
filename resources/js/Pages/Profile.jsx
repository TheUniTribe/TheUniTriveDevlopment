import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * @file Profile.jsx - Dynamic user profile component with user ID support
 * @description Feature-rich profile system that dynamically loads user data based on ID,
 * with tab navigation, social links, reputation tracking, user interactions and editable profile
 *
 * @module Profile
 * @version 4.1.1
 * @since 1.0.0
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DEFAULT_IMAGES = {
  AVATAR:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=480&auto=format&fit=crop",
  PLACEHOLDER: "https://i.pravatar.cc/72?img=1",
};

const TAB_CONFIG = [
  { key: "aboutus", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "overview", label: "Overview" },
  { key: "discussions", label: "Discussions" },
  { key: "reputation", label: "Reputation" },
  { key: "activities", label: "Activities" },
  { key: "comments", label: "Comments" },
//   { key: "connections", label: "Connections" },
];

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

const simulateAPICall = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

// =============================================================================
// NETWORK MODAL COMPONENT
// =============================================================================

function NetworkModal({ isOpen, type, onClose, userId }) {
  const [activeTab, setActiveTab] = useState('alreadyJoined');
  const [data, setData] = useState({ alreadyJoined: [], suggested: [] });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // API endpoints for different types
  const API_ENDPOINTS = {
    followers: `/api/profiles/${userId}/followers`,
    following: `/api/profiles/${userId}/following`,
    groups: `/api/profiles/${userId}/groups`,
  };

  // Fetch data when modal opens or type changes
  useEffect(() => {
    if (isOpen && type) {
      fetchNetworkData();
    }
  }, [isOpen, type]);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API endpoints
      const response = await fetch(API_ENDPOINTS[type]);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const result = await response.json();
      setData({
        alreadyJoined: result.alreadyJoined || [],
        suggested: result.suggested || []
      });
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      // Fallback mock data
      setData({
        alreadyJoined: [
          { 
            id: 1, 
            name: 'John Doe', 
            avatar: DEFAULT_IMAGES.PLACEHOLDER, 
            isConnected: true,
            bio: 'Software Developer at Tech Corp',
            mutualConnections: 5
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            avatar: DEFAULT_IMAGES.PLACEHOLDER, 
            isConnected: true,
            bio: 'Product Manager at Design Co',
            mutualConnections: 3
          },
        ],
        suggested: [
          { 
            id: 3, 
            name: 'Mike Johnson', 
            avatar: DEFAULT_IMAGES.PLACEHOLDER, 
            isConnected: false,
            bio: 'Full Stack Developer',
            mutualConnections: 2
          },
          { 
            id: 4, 
            name: 'Sarah Wilson', 
            avatar: DEFAULT_IMAGES.PLACEHOLDER, 
            isConnected: false,
            bio: 'UX Designer at Creative Agency',
            mutualConnections: 1
          },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddConnection = async (itemId) => {
    try {
      // API call to add connection
      await fetch(`/api/profiles/${userId}/${type}/${itemId}`, {
        method: 'POST',
      });
      
      // Update local state
      const itemToAdd = data.suggested.find(item => item.id === itemId);
      if (itemToAdd) {
        setData(prev => ({
          ...prev,
          suggested: prev.suggested.filter(item => item.id !== itemId),
          alreadyJoined: [...prev.alreadyJoined, { ...itemToAdd, isConnected: true }]
        }));
      }
    } catch (error) {
      console.error('Error adding connection:', error);
    }
  };

  const handleRemoveConnection = async (itemId) => {
    try {
      // API call to remove connection
      await fetch(`/api/profiles/${userId}/${type}/${itemId}`, {
        method: 'DELETE',
      });
      
      // Update local state
      const itemToRemove = data.alreadyJoined.find(item => item.id === itemId);
      if (itemToRemove) {
        setData(prev => ({
          ...prev,
          alreadyJoined: prev.alreadyJoined.filter(item => item.id !== itemId),
          suggested: [...prev.suggested, { ...itemToRemove, isConnected: false }]
        }));
      }
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  const filteredAlreadyJoined = data.alreadyJoined.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = data.suggested.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'followers': return 'Followers';
      case 'following': return 'Following';
      case 'groups': return 'Groups';
      default: return 'Network';
    }
  };

  const getEmptyStateMessage = () => {
    if (searchQuery) return 'No results found';
    
    switch (activeTab) {
      case 'alreadyJoined':
        return `No ${type} yet`;
      case 'suggested':
        return `No ${type} suggestions available`;
      default:
        return 'No data available';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${getTitle().toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('alreadyJoined')}
              className={cx(
                "px-4 py-3 font-medium border-b-2 transition-colors duration-200",
                activeTab === 'alreadyJoined'
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Already Joined
            </button>
            <button
              onClick={() => setActiveTab('suggested')}
              className={cx(
                "px-4 py-3 font-medium border-b-2 transition-colors duration-200",
                activeTab === 'suggested'
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Suggested
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {(activeTab === 'alreadyJoined' ? filteredAlreadyJoined : filteredSuggested).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.bio && <p className="text-sm text-gray-600 mt-1">{item.bio}</p>}
                      {item.mutualConnections && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.mutualConnections} mutual connections
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {activeTab === 'alreadyJoined' ? (
                    <button
                      onClick={() => handleRemoveConnection(item.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddConnection(item.id)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}

              {(activeTab === 'alreadyJoined' ? filteredAlreadyJoined : filteredSuggested).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {getEmptyStateMessage()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EDIT MODALS COMPONENTS
// =============================================================================

function EditPersonalInfoModal({ isOpen, onClose, initial, onSave, saving }) {
  const [form, setForm] = useState({
    first_name: initial.first_name || "",
    last_name: initial.last_name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    location: initial.location || "",
    designation: initial.designation || "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        first_name: initial.first_name || "",
        last_name: initial.last_name || "",
        email: initial.email || "",
        phone: initial.phone || "",
        location: initial.location || "",
        designation: initial.designation || "",
      });
    }
  }, [isOpen, initial]);

  const handleChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Personal Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                value={form.first_name} 
                onChange={handleChange("first_name")} 
                placeholder="First name" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                value={form.last_name} 
                onChange={handleChange("last_name")} 
                placeholder="Last name" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                value={form.email} 
                onChange={handleChange("email")} 
                placeholder="Email" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                value={form.phone} 
                onChange={handleChange("phone")} 
                placeholder="Phone number" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                value={form.location} 
                onChange={handleChange("location")} 
                placeholder="Location" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation/Title</label>
              <input 
                value={form.designation} 
                onChange={handleChange("designation")} 
                placeholder="Designation" 
                className="w-full rounded-lg border px-3 py-2" 
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={cx(
                "rounded-lg px-6 py-2 bg-gray-900 text-white transition-colors duration-200", 
                saving ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditAboutModal({ isOpen, onClose, initial, onSave, saving }) {
  const [aboutContent, setAboutContent] = useState(initial.aboutContent || "");

  useEffect(() => {
    if (isOpen) {
      setAboutContent(initial.aboutContent || "");
    }
  }, [isOpen, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ aboutContent });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit About Section</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea 
              value={aboutContent} 
              onChange={(e) => setAboutContent(e.target.value)} 
              rows={8} 
              className="w-full rounded-lg border px-3 py-2" 
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={cx(
                "rounded-lg px-6 py-2 bg-gray-900 text-white transition-colors duration-200", 
                saving ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditExperienceModal({ isOpen, onClose, initial, onSave, saving }) {
  const [experienceContent, setExperienceContent] = useState(initial.experienceContent || "");

  useEffect(() => {
    if (isOpen) {
      setExperienceContent(initial.experienceContent || "");
    }
  }, [isOpen, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ experienceContent });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Experience</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <textarea 
              value={experienceContent} 
              onChange={(e) => setExperienceContent(e.target.value)} 
              rows={8} 
              className="w-full rounded-lg border px-3 py-2" 
              placeholder="Share your professional experience..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={cx(
                "rounded-lg px-6 py-2 bg-gray-900 text-white transition-colors duration-200", 
                saving ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditEducationModal({ isOpen, onClose, initial, onSave, saving }) {
  const [educations, setEducations] = useState(initial.educations || []);

  useEffect(() => {
    if (isOpen) {
      setEducations(initial.educations || []);
    }
  }, [isOpen, initial]);

  const handleEducationChange = (idx, key) => (e) => {
    setEducations(prev => {
      const copied = [...prev];
      copied[idx] = { ...(copied[idx] || {}), [key]: e.target.value };
      return copied;
    });
  };

  const addEducation = () => setEducations(prev => [...prev, { 
    institution: "", 
    degree: "", 
    field_of_study: "", 
    start_date: "", 
    end_date: "" 
  }]);

  const removeEducation = (idx) => setEducations(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ educations });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Education</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Education History</label>
            <button type="button" onClick={addEducation} className="text-sm text-gray-600 hover:text-gray-900">
              + Add Education
            </button>
          </div>
          
          <div className="space-y-4">
            {educations.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg">
                <input 
                  value={edu.institution} 
                  onChange={handleEducationChange(idx, "institution")} 
                  placeholder="Institution" 
                  className="rounded-lg border px-3 py-2" 
                />
                <input 
                  value={edu.degree} 
                  onChange={handleEducationChange(idx, "degree")} 
                  placeholder="Degree" 
                  className="rounded-lg border px-3 py-2" 
                />
                <input 
                  value={edu.field_of_study} 
                  onChange={handleEducationChange(idx, "field_of_study")} 
                  placeholder="Field of study" 
                  className="rounded-lg border px-3 py-2" 
                />
                <input 
                  value={edu.start_date} 
                  onChange={handleEducationChange(idx, "start_date")} 
                  placeholder="Start date (YYYY-MM-DD)" 
                  className="rounded-lg border px-3 py-2" 
                />
                <input 
                  value={edu.end_date} 
                  onChange={handleEducationChange(idx, "end_date")} 
                  placeholder="End date (YYYY-MM-DD)" 
                  className="rounded-lg border px-3 py-2" 
                />
                <div className="flex items-center gap-2 md:col-span-2">
                  <button 
                    type="button" 
                    onClick={() => removeEducation(idx)} 
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={cx(
                "rounded-lg px-6 py-2 bg-gray-900 text-white transition-colors duration-200", 
                saving ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditSocialLinksModal({ isOpen, onClose, initial, onSave, saving }) {
  const [social_links, setSocialLinks] = useState(initial.social_links || []);

  useEffect(() => {
    if (isOpen) {
      setSocialLinks(initial.social_links || []);
    }
  }, [isOpen, initial]);

  const handleSocialChange = (idx, key) => (e) => {
    setSocialLinks(prev => {
      const copied = [...prev];
      copied[idx] = { ...(copied[idx] || {}), [key]: e.target.value };
      return copied;
    });
  };

  const addSocial = () => setSocialLinks(prev => [...prev, { platform: "", url: "" }]);

  const removeSocial = (idx) => setSocialLinks(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ social_links });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Social Links</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <button type="button" onClick={addSocial} className="text-sm text-gray-600 hover:text-gray-900">
              + Add Social Link
            </button>
          </div>
          
          <div className="space-y-2">
            {social_links.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input 
                  value={s.platform} 
                  onChange={handleSocialChange(idx, "platform")} 
                  placeholder="Platform (e.g. linkedin)" 
                  className="rounded-lg border px-3 py-2" 
                />
                <input 
                  value={s.url} 
                  onChange={handleSocialChange(idx, "url")} 
                  placeholder="URL" 
                  className="rounded-lg border px-3 py-2" 
                />
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => removeSocial(idx)} 
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-lg px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className={cx(
                "rounded-lg px-6 py-2 bg-gray-900 text-white transition-colors duration-200", 
                saving ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

const API_PROFILE_ROUTE = (id) => `/profiles/${id}`;

function useProfile(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_CONFIG[0].key);

  // Transform backend data to match frontend expectations
  const transformBackendData = (data) => {
    if (!data) return null;

    return {
      id: data.user?.id ?? userId,
      profileType:
        data.user?.account_type === "student" ? "student" : "professional",
      name:
        data.user?.full_name ??
        `${data.user?.first_name ?? ""} ${data.user?.last_name ?? ""}`.trim(),
      avatar: data.user?.profile_picture ?? DEFAULT_IMAGES.AVATAR,
      social_links: data.profile?.social_links ?? data?.profile?.social_links ?? [],
      email: data.user?.email ?? "",
      phone: data.profile?.phone ?? "",
      location: data.profile?.location ?? "",
      major: data.user?.major ?? "",
      university: data.user?.university ?? "",
      designation: data.profile?.title ?? "",
      company: data.user?.company ?? "",
      yearsExperience: data.user?.years_experience ?? 0,
      aboutContent: data.content?.about ?? data?.profile?.about ?? "No about information available.",
      experienceContent: data.content?.experience ?? data?.profile?.experience ?? "No experience information available.",
      comments: data.comments ?? [],
      discussions: data.discussions ?? [],
      activities: data.activities ?? [],
      badges: data.badges ?? [],
      projects: data.projects ?? [],
      courses: data.courses ?? [],
      skills: data.skills ?? [],
      reputation:
        data.reputation ?? {
          stats: [
            { label: "Posts", value: 0 },
            { label: "Likes", value: 0 },
            { label: "Comments", value: 0 },
            { label: "Followers", value: data.network?.followers ?? 0 },
          ],
          details: data.reputation?.details ?? [],
        },
      network: {
        followers: data.network?.followers ?? 0,
        following: data.network?.following ?? 0,
        connections: data.network?.connections ?? 0,
        followerBreakdown: data.network?.follower_breakdown ?? {},
      },
      connections: data.network?.connectionsList ?? [],
      profile_completeness:
        data.profile?.profile_completeness ?? data?.profile_completeness ?? 0,
      is_verified: data.user?.is_verified ?? false,
      account_status: data.user?.account_status ?? "active",
      last_activity_at: data.user?.last_activity_at,
      username: data.user?.username,
      first_name: data.user?.first_name ?? "",
      last_name: data.user?.last_name ?? "",
      // Add educations from professional data
      educations: data.professional?.educations ?? [],
      experiences: data.professional?.experiences ?? [],
      // server-provided ownership flag
      is_owner: data?.is_owner === true,
    };
  };
    console.log("use profilein profile is_owner", transformBackendData);
    
  useEffect(() => {
    if (!userId) {
      setProfileData(null);
      setError("No user id provided");
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(API_PROFILE_ROUTE(userId), { signal });

        if (!res.ok) {
          let message = `Failed to load profile (status ${res.status})`;
          try {
            const errJson = await res.json();
            if (errJson?.message) message = errJson.message;
          } catch (e) {
            /* ignore JSON parse errors */
          }
          throw new Error(message);
        }

        const data = await res.json();

        // Transform the backend data to match frontend expectations
        const transformedData = transformBackendData(data);
        setProfileData(transformedData);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("useProfile fetch error:", err);
        setError(err.message || "Failed to load profile");
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    return () => controller.abort();
  }, [userId]);

  const addComment = async (commentText) => {
    await simulateAPICall(500);

    const newComment = {
      id: Date.now(),
      name: "You",
      when: "Just now",
      text: commentText,
      avatar: DEFAULT_IMAGES.PLACEHOLDER,
    };

    setProfileData((prev) => ({
      ...prev,
      comments: [newComment, ...(prev?.comments ?? [])],
    }));
  };

  // Update profile fields — optimistic update + PATCH to backend.
  // The backend should accept the fields we send (see updateProfile usage).
  const updateProfile = async (updatedFields) => {
    // optimistic update
    setProfileData((prev) => ({ ...prev, ...updatedFields }));

    try {
      await simulateAPICall(600);
      // Persist to server
      const res = await fetch(API_PROFILE_ROUTE(userId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        // revert or handle error
        const errText = await res.text().catch(() => "Failed to save");
        throw new Error(errText || "Failed to save changes");
      }

      const serverData = await res.json().catch(() => null);
      if (serverData) {
        // merge server response if present
        setProfileData((prev) => ({
          ...prev,
          ...transformBackendData(serverData),
        }));
      }

      return { ok: true };
    } catch (err) {
      console.error("updateProfile error", err);
      setError(err.message || "Failed to save profile");
      return { ok: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    profileData,
    activeTab,
    setActiveTab,
    addComment,
    updateProfile,
  };
}

// =============================================================================
// ICONS, TOOLTIP, METRICS, AND UI COMPONENTS
// =============================================================================

function FollowersIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );
}

function FollowingIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ConnectionsIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Tooltip({ children, content, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(false), 150);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cx(
            "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap",
            positionClasses[position]
          )}
          role="tooltip"
        >
          {content}
          <div
            className={cx(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              position === "top" &&
                "top-full left-1/2 -translate-x-1/2 -mt-1",
              position === "bottom" &&
                "bottom-full left-1/2 -translate-x-1/2 -mb-1",
              position === "left" &&
                "left-full top-1/2 -translate-y-1/2 -ml-1",
              position === "right" &&
                "right-full top-1/2 -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  );
}

function FollowersMetric({ count = 0, breakdown = {}, onClick }) {
  const tooltipContent = useMemo(() => {
    if (!breakdown || Object.keys(breakdown).length === 0)
      return `${count.toLocaleString()} followers`;
    const breakdownText = Object.entries(breakdown)
      .map(([dept, deptCount]) => `${dept}: ${deptCount}`)
      .join("\n");
    return `${count.toLocaleString()} followers\n\nBreakdown:\n${breakdownText}`;
  }, [count, breakdown]);

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-blue-200"
      >
        <div className="p-2 rounded-lg bg-blue-500 text-white group-hover:bg-blue-600 transition-colors duration-200">
          <FollowersIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-blue-900">
            {Number(count).toLocaleString()}
          </span>
          <span className="text-xs text-blue-700 font-medium">Followers</span>
        </div>
      </div>
    </Tooltip>
  );
}

function FollowingMetric({ count = 0, onClick }) {
  return (
    <Tooltip content={`Following ${Number(count).toLocaleString()} people`} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-green-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-green-200"
      >
        <div className="p-2 rounded-lg bg-green-500 text-white group-hover:bg-green-600 transition-colors duration-200">
          <FollowingIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-green-900">
            {Number(count).toLocaleString()}
          </span>
          <span className="text-xs text-green-700 font-medium">Following</span>
        </div>
      </div>
    </Tooltip>
  );
}

function ConnectionsMetric({ count = 0, connections = [], onClick }) {
  const tooltipContent =
    connections?.length > 0 ? `${count} connections\nClick to view network` : `${count} connections`;

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div 
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl hover:border-purple-300 transition-all duration-200 cursor-pointer group p-3 border border-transparent hover:border-purple-200"
      >
        <div className="p-2 rounded-lg bg-purple-500 text-white group-hover:bg-purple-600 transition-colors duration-200">
          <ConnectionsIcon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-purple-900">{count}</span>
          <span className="text-xs text-purple-700 font-medium">Groups</span>
        </div>
      </div>
    </Tooltip>
  );
}

function SocialMetricsGrid({ network = { followers: 0, following: 0, connections: [], followerBreakdown: {} }, onFollowersClick, onFollowingClick, onGroupsClick }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      <FollowersMetric 
        count={network.followers} 
        breakdown={network.followerBreakdown} 
        onClick={onFollowersClick}
      />
      <FollowingMetric 
        count={network.following} 
        onClick={onFollowingClick}
      />
      <ConnectionsMetric 
        count={network.connections?.length ?? 0} 
        connections={network.connections ?? []} 
        onClick={onGroupsClick}
      />
    </div>
  );
}

function SectionCard({ title, action, children, className }) {
  return (
    <section className={cx("rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

function TabNav({ tabs = [], active, onChange }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Profile sections">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={cx(
            "px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg border",
            active === tab.key ? "text-gray-900 bg-white border-gray-300 shadow-sm" : "text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

// =============================================================================
// EDIT DROPDOWN COMPONENT
// =============================================================================

function EditDropdown({ isOpen, onClose, onEditPersonal, onEditAbout, onEditExperience, onEditEducation, onEditSocialLinks }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="py-1">
        <button
          onClick={() => { onEditPersonal(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Personal Information
        </button>
        <button
          onClick={() => { onEditAbout(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          About Section
        </button>
        <button
          onClick={() => { onEditExperience(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Experience
        </button>
        <button
          onClick={() => { onEditEducation(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Education
        </button>
        <button
          onClick={() => { onEditSocialLinks(); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Social Links
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// Remaining UI components (Comments, Discussions, etc.)
// =============================================================================

function StudentCourses({ courses = [] }) {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
        Current Courses
      </h4>
      <div className="flex flex-wrap gap-2">
        {courses.map((course, index) => (
          <span key={index} className="px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
            {course}
          </span>
        ))}
      </div>
    </div>
  );
}

function StudentSkills({ skills = [] }) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
        Skills & Technologies
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="px-3 py-1.5 bg-white text-green-700 rounded-lg text-sm font-medium border border-green-200">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function StudentAcademicInfo({ courses = [], skills = [] }) {
  if ((!courses || courses.length === 0) && (!skills || skills.length === 0)) return null;
  return (
    <div className="space-y-4">
      <StudentCourses courses={courses} />
      <StudentSkills skills={skills} />
    </div>
  );
}

function SocialLinks({ social_links = [], email, phone }) {
  const socialIcons = {
    linkedin: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    ),
    github: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    email: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  };

  // Handle empty social links array
  if (!social_links || social_links.length === 0) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {email && (
          <Tooltip content={`Email: ${email}`} position="bottom">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 transition-all duration-200 font-medium"
            >
              {socialIcons.email}
            </a>
          </Tooltip>
        )}
        {phone && (
          <Tooltip content={`Call: ${phone}`} position="bottom">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition-all duration-200 font-medium"
            >
              {socialIcons.phone}
            </a>
          </Tooltip>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {social_links.map((link, index) => (
        <Tooltip key={index} content={link.platform || "Social link"} position="bottom">
          <a
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200 font-medium"
          >
            {socialIcons[link.platform] || socialIcons.email}
          </a>
        </Tooltip>
      ))}

      {(social_links.length > 0 && (email || phone)) && <div className="w-px h-6 bg-gray-300 mx-1" />}

      {email && (
        <Tooltip content={`Email: ${email}`} position="bottom">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-105 transition-all duration-200 font-medium"
          >
            {socialIcons.email}
          </a>
        </Tooltip>
      )}
      {phone && (
        <Tooltip content={`Call: ${phone}`} position="bottom">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105 transition-all duration-200 font-medium"
          >
            {socialIcons.phone}
          </a>
        </Tooltip>
      )}
    </div>
  );
}

function Discussions({ items = [] }) {
  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-sm md:text-base break-words flex-1 min-w-0 text-gray-900">{item.title}</h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-medium shrink-0">{item.tag}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
          <p className="text-sm text-gray-600 mt-2 break-words">{item.snippet}</p>
        </li>
      ))}
    </ul>
  );
}

function Reputation({ stats = [], details = [] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(stats || []).map((stat, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-4 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {details && details.length > 0 && (
        <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
          <h4 className="text-sm font-semibold mb-4 text-gray-900">Detailed Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Count</th>
                  <th className="py-2.5 px-4 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors duration-200">
                    <td className="py-2.5 px-4 font-medium text-gray-900">{detail.category}</td>
                    <td className="py-2.5 px-4 font-medium text-gray-900">{detail.count}</td>
                    <td className="py-2.5 px-4 text-gray-500">{detail.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Activities({ items = [] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-gray-900 break-words">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1.5">{item.when}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CommentForm({ onSubmit }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    await onSubmit(comment);
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Add a Comment</h4>
      <div className="mb-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200 resize-none"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting || !comment.trim()} className={cx("rounded-lg px-4 py-2.5 text-sm text-white font-medium transition-colors duration-200", isSubmitting || !comment.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800")}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}

function Comments({ items = [], onAddComment }) {
  return (
    <div>
      <CommentForm onSubmit={onAddComment} />
      <div className="space-y-4">
        {(!items || items.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          items.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar} alt={`${comment.name}'s avatar`} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{comment.name}</p>
                  <span className="text-xs text-gray-500">{comment.when}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ContentDisplay({ content = "" }) {
  return <div className="text-sm text-gray-700 whitespace-pre-wrap">{content}</div>;
}

function ConnectionCard({ connection = {} }) {
  const isStudent = connection?.profileType === "student";
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
      <div className="relative mb-3">
        <img src={connection.avatar ?? DEFAULT_IMAGES.PLACEHOLDER} alt={`${connection.name}'s avatar`} className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center" />
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate w-full">{connection.name ?? "Unknown"}</h4>
      <p className="text-xs text-gray-600 mb-2 truncate w-full">{isStudent ? `${connection.major ?? ""} • ${connection.university ?? ""}` : connection.designation ?? ""}</p>
      <div className="flex flex-wrap gap-1 justify-center mb-3">
        {(connection.roles ?? []).slice(0, 2).map((role, index) => (
          <span key={index} className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-md">
            {role.role}
          </span>
        ))}
        {isStudent && connection.academicLevel && <span className="inline-block px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-md">{connection.academicLevel}</span>}
      </div>
      <div className="flex gap-2 w-full">
        <button className="flex-1 py-1.5 px-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">Message</button>
        <button className="flex-1 py-1.5 px-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">View</button>
      </div>
    </div>
  );
}

function Connections({ connections = [] }) {
  if (!connections || connections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connections Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">Start connecting with other people to build your network and discover new opportunities.</p>
        <button className="mt-4 rounded-lg px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium">Find Connections</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {connections.length} Connection{connections.length !== 1 ? "s" : ""}
          </h3>
          <p className="text-sm text-gray-600 mt-1">People in your network</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">Sort by: Recent</button>
          <button className="rounded-lg px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">+ Add Connection</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {connections.map((connection) => (
          <ConnectionCard key={connection.id ?? connection.name ?? Math.random()} connection={connection} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="rounded-lg px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">Load More Connections</button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
}

function ErrorDisplay({ message = "Something went wrong", onRetry = () => window.location.reload() }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button onClick={onRetry} className="rounded-lg px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 font-medium">
          Try Again
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PROFILE COMPONENT
// =============================================================================

export default function Profile({ userId, viewerId = null, isAuthenticated = false }) {
  const { loading, error, profileData, activeTab, setActiveTab, addComment, updateProfile } = useProfile(userId);
  const [isSaving, setIsSaving] = useState(false);
  const [networkModal, setNetworkModal] = useState({ isOpen: false, type: null });
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const [editModals, setEditModals] = useState({
    personal: false,
    about: false,
    experience: false,
    education: false,
    socialLinks: false
  });

  const canEdit = Boolean(profileData?.is_owner === true);
  
  // Network modal handlers
  const handleFollowersClick = () => {
    setNetworkModal({ isOpen: true, type: 'followers' });
  };

  const handleFollowingClick = () => {
    setNetworkModal({ isOpen: true, type: 'following' });
  };

  const handleGroupsClick = () => {
    setNetworkModal({ isOpen: true, type: 'groups' });
  };

  const handleCloseModal = () => {
    setNetworkModal({ isOpen: false, type: null });
  };

  // Edit modal handlers
  const openEditModal = (modalType) => {
    setEditModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeEditModal = (modalType) => {
    setEditModals(prev => ({ ...prev, [modalType]: false }));
  };

  const handleSave = async (payload) => {
    setIsSaving(true);
    const result = await updateProfile(payload);
    setIsSaving(false);
    if (result.ok) {
      // Close all modals on successful save
      setEditModals({
        personal: false,
        about: false,
        experience: false,
        education: false,
        socialLinks: false
      });
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error or missing data — stop rendering the rest
  if (error || !profileData) {
    return <ErrorDisplay message={error || "User not found"} onRetry={() => window.location.reload()} />;
  }

  const isStudent = profileData?.profileType === "student";

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title={isStudent ? "Study Discussions" : "Latest & Popular Discussions"}>
        <Discussions items={profileData.discussions} />
      </SectionCard>

      <SectionCard title="Reputation">
        <Reputation stats={profileData.reputation?.stats ?? []} details={profileData.reputation?.details ?? []} />
      </SectionCard>

      <SectionCard title="Activities">
        <Activities items={profileData.activities} />
      </SectionCard>

      {isStudent && profileData.projects && (
        <SectionCard title="Recent Projects">
          <div className="space-y-4">
            {profileData.projects.map((project, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">{project.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title="Comments from Users">
        <div className="space-y-4">
          {(profileData.comments || []).slice(0, 2).map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img src={comment.avatar ?? DEFAULT_IMAGES.PLACEHOLDER} alt={`${comment.name}'s avatar`} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{comment.name}</p>
                  <span className="text-xs text-gray-500">{comment.when}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{comment.text}</p>
              </div>
            </div>
          ))}
          {profileData.comments && profileData.comments.length > 2 && (
            <div className="text-center pt-2">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200" onClick={() => setActiveTab("comments")}>
                View all comments ({profileData.comments.length})
              </button>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );

  // Mentor / Mentee icons that are non-editable and displayed below the avatar (in flow)
  const MentorIcon = () => (
    <div className="flex items-center gap-2 text-xs text-gray-700 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z"/></svg>
      Mentor
    </div>
  );

  const MenteeIcon = () => (
    <div className="flex items-center gap-2 text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c5 0 9 2.5 9 5v1H3v-1c0-2.5 4-5 9-5z"/></svg>
      Mentee
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto grid gap-4">
      {/* Network Modal */}
      <NetworkModal
        isOpen={networkModal.isOpen}
        type={networkModal.type}
        onClose={handleCloseModal}
        userId={userId}
      />

      {/* Edit Modals */}
      <EditPersonalInfoModal
        isOpen={editModals.personal}
        onClose={() => closeEditModal('personal')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
      />

      <EditAboutModal
        isOpen={editModals.about}
        onClose={() => closeEditModal('about')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
      />

      <EditExperienceModal
        isOpen={editModals.experience}
        onClose={() => closeEditModal('experience')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
      />

      <EditEducationModal
        isOpen={editModals.education}
        onClose={() => closeEditModal('education')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
      />

      <EditSocialLinksModal
        isOpen={editModals.socialLinks}
        onClose={() => closeEditModal('socialLinks')}
        initial={profileData}
        onSave={handleSave}
        saving={isSaving}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-rows-[auto_auto] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="relative w-32 h-32 mx-auto md:mx-0">
              <img src={profileData.avatar ?? DEFAULT_IMAGES.AVATAR} alt="User avatar" className="w-full h-full rounded-xl object-cover border-2 border-gray-100 shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>

              {/* Mentor / Mentee badges placed below the avatar (in document flow) */}
              <div className="mt-2 flex items-center gap-2 justify-center">
                <MentorIcon />
                {/* <MenteeIcon /> */}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 truncate">
                      {profileData?.name || "User"}
                    </h2>
                    <span
                      className={cx(
                        "px-2.5 py-1 text-xs font-medium rounded-full border",
                        isStudent
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-purple-100 text-purple-800 border-purple-200"
                      )}
                    >
                      {isStudent ? "Student" : "Professional"}
                    </span>
                  </div>

                  <p className="text-gray-600 font-medium truncate">
                    {isStudent
                      ? `${profileData.major || "No major"} • ${profileData.university || "No university"}`
                      : `${profileData.designation || "No designation"}${profileData.company ? ` at ${profileData.company}` : ""}`}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {profileData.location || "No location specified"}
                    {isStudent && profileData.yearsExperience ? ` • ${profileData.yearsExperience} years experience` : ""}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2 flex-wrap justify-end">
                    {(profileData.badges || []).map((badge, index) => (
                      <Tooltip key={index} content={badge} position="bottom">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md font-medium border border-yellow-200 whitespace-nowrap">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {badge}
                        </span>
                      </Tooltip>
                    ))}
                  </div>

                  {/* Edit button visible only to owner */}
                  {canEdit && (
                    <div className="relative">
                      <button 
                        onClick={() => setEditDropdownOpen(!editDropdownOpen)}
                        className="rounded-lg px-3 py-1.5 border border-gray-300 text-sm font-medium hover:bg-gray-50 flex items-center gap-1"
                      >
                        Edit Profile
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <EditDropdown
                        isOpen={editDropdownOpen}
                        onClose={() => setEditDropdownOpen(false)}
                        onEditPersonal={() => openEditModal('personal')}
                        onEditAbout={() => openEditModal('about')}
                        onEditExperience={() => openEditModal('experience')}
                        onEditEducation={() => openEditModal('education')}
                        onEditSocialLinks={() => openEditModal('socialLinks')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <SocialMetricsGrid 
                network={profileData.network} 
                onFollowersClick={handleFollowersClick}
                onFollowingClick={handleFollowingClick}
                onGroupsClick={handleGroupsClick}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 mt-2 pt-3">
            <SocialLinks
              social_links={profileData.social_links}
              email={profileData.email}
              phone={profileData.phone}
            />
          </div>
        </div>

        <div className="mt-6">
          <StudentAcademicInfo courses={profileData.courses} skills={profileData.skills} />
        </div>
      </div>

      <TabNav tabs={TAB_CONFIG} active={activeTab} onChange={setActiveTab} />

      {activeTab === "aboutus" && (
        <SectionCard 
          title="About" 
          action={canEdit && (
            <button 
              onClick={() => openEditModal('about')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Edit
            </button>
          )}
        >
          <ContentDisplay content={profileData.aboutContent} />
        </SectionCard>
      )}

      {activeTab === "experience" && (
        <SectionCard 
          title={isStudent ? "Experience & Activities" : "Experience"}
          action={canEdit && (
            <button 
              onClick={() => openEditModal('experience')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Edit
            </button>
          )}
        >
          <ContentDisplay content={profileData.experienceContent} />
        </SectionCard>
      )}

      {activeTab === "overview" && renderOverview()}

      {activeTab === "discussions" && (
        <SectionCard title={isStudent ? "Study Discussions" : "Discussions"}>
          <Discussions items={profileData.discussions} />
        </SectionCard>
      )}

      {activeTab === "reputation" && (
        <SectionCard title="Reputation">
          <Reputation stats={profileData.reputation?.stats ?? []} details={profileData.reputation?.details ?? []} />
        </SectionCard>
      )}

      {activeTab === "activities" && (
        <SectionCard title="Activities">
          <Activities items={profileData.activities} />
        </SectionCard>
      )}

      {activeTab === "comments" && (
        <SectionCard title="Comments from Users">
          <Comments items={profileData.comments} onAddComment={addComment} />
        </SectionCard>
      )}
    </div>
  );
}