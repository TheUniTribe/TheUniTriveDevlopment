import React, { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState({
    // Account Settings
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Digital creator & tech enthusiast",
    location: "San Francisco, CA",
    
    // Privacy Settings
    profileVisibility: "public",
    activityStatus: true,
    readReceipts: false,
    blockedUsers: ["user123", "spammer456"],
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    messageNotifications: true,
    commentNotifications: true,
    tagNotifications: true,
    
    // Theme Settings
    darkMode: false,
    themeColor: "blue",
    fontSize: "medium",
    reduceAnimations: false,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    recognizedDevices: [
      { id: 1, name: "MacBook Pro", lastActive: "2 hours ago" },
      { id: 2, name: "iPhone 13", lastActive: "Currently active" }
    ],
    
    // Content Preferences
    autoPlayVideos: true,
    dataSaverMode: false,
    language: "en",
    contentLanguage: "all",
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parentKey, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value
      }
    }));
  };

  const handleArrayChange = (key, value, index) => {
    setSettings((prev) => {
      const newArray = [...prev[key]];
      newArray[index] = value;
      return { ...prev, [key]: newArray };
    });
  };

  const addBlockedUser = () => {
    const username = prompt("Enter username to block:");
    if (username && !settings.blockedUsers.includes(username)) {
      setSettings(prev => ({
        ...prev,
        blockedUsers: [...prev.blockedUsers, username]
      }));
    }
  };

  const removeBlockedUser = (username) => {
    setSettings(prev => ({
      ...prev,
      blockedUsers: prev.blockedUsers.filter(user => user !== username)
    }));
  };

  const revokeDevice = (deviceId) => {
    setSettings(prev => ({
      ...prev,
      recognizedDevices: prev.recognizedDevices.filter(device => device.id !== deviceId)
    }));
  };

  const saveSettings = () => {
    // In a real app, this would send the settings to a backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const resetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      // In a real app, this would fetch default settings
      console.log("Resetting settings to default");
      alert("Settings have been reset to default values.");
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = "social_settings.json";
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Tab navigation
  const tabs = [
    { id: "account", name: "Account", icon: "user" },
    { id: "privacy", name: "Privacy", icon: "lock" },
    { id: "notifications", name: "Notifications", icon: "bell" },
    { id: "theme", name: "Theme", icon: "palette" },
    { id: "security", name: "Security", icon: "shield" },
    { id: "content", name: "Content", icon: "film" },
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case "user": return <i className="fas fa-user text-blue-500"></i>;
      case "lock": return <i className="fas fa-lock text-green-500"></i>;
      case "bell": return <i className="fas fa-bell text-yellow-500"></i>;
      case "palette": return <i className="fas fa-palette text-purple-500"></i>;
      case "shield": return <i className="fas fa-shield-alt text-red-500"></i>;
      case "film": return <i className="fas fa-film text-indigo-500"></i>;
      default: return <i className="fas fa-cog text-gray-500"></i>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Settings</h1>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2 text-lg">{getIcon(tab.icon)}</span>
            {tab.name}
          </button>
        ))}
      </div>
      
      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Tell people about yourself</p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Account Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                Change Password
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                Deactivate Account
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Download Data
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Settings */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Privacy Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Profile Visibility</h3>
                <p className="text-sm text-gray-600">Who can see your profile</p>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleChange("profileVisibility", e.target.value)}
                className="border rounded-lg p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Activity Status</h3>
                <p className="text-sm text-gray-600">Show when you're active</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.activityStatus}
                  onChange={(e) => handleChange("activityStatus", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Read Receipts</h3>
                <p className="text-sm text-gray-600">Show when you've seen messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={(e) => handleChange("readReceipts", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-800">Blocked Users</h3>
              <button 
                onClick={addBlockedUser}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                + Add User
              </button>
            </div>
            
            {settings.blockedUsers.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                {settings.blockedUsers.map((user, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-800">@{user}</span>
                    <button 
                      onClick={() => removeBlockedUser(user)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i> Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">You haven't blocked any users yet.</p>
            )}
          </div>
        </div>
      )}
      
      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Push Notifications</h3>
                <p className="text-sm text-gray-600">Receive push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleChange("smsNotifications", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Notification Types</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">New Messages</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.messageNotifications}
                      onChange={(e) => handleChange("messageNotifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Comments</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.commentNotifications}
                      onChange={(e) => handleChange("commentNotifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tags</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.tagNotifications}
                      onChange={(e) => handleChange("tagNotifications", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Theme Settings */}
      {activeTab === "theme" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Theme & Display</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Dark Mode</h3>
                <p className="text-sm text-gray-600">Switch between light and dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange("darkMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Theme Color</h3>
              <div className="flex space-x-3">
                {["blue", "green", "purple", "pink", "red", "orange"].map(color => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full bg-${color}-500 ${settings.themeColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    onClick={() => handleChange("themeColor", color)}
                  ></button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Font Size</h3>
              <div className="flex space-x-3">
                {["small", "medium", "large", "x-large"].map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-lg ${settings.fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => handleChange("fontSize", size)}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Reduce Animations</h3>
                <p className="text-sm text-gray-600">Minimize motion and animations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reduceAnimations}
                  onChange={(e) => handleChange("reduceAnimations", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Login Alerts</h3>
                <p className="text-sm text-gray-600">Get notified of new logins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.loginAlerts}
                  onChange={(e) => handleChange("loginAlerts", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Recognized Devices</h3>
              
              {settings.recognizedDevices.map(device => (
                <div key={device.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="text-gray-800">{device.name}</p>
                    <p className="text-sm text-gray-600">{device.lastActive}</p>
                  </div>
                  <button 
                    onClick={() => revokeDevice(device.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Revoke Access
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Security Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                Change Password
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                View Login History
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
                Log Out of All Devices
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Settings */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Content Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Auto-play Videos</h3>
                <p className="text-sm text-gray-600">Play videos automatically when scrolling</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoPlayVideos}
                  onChange={(e) => handleChange("autoPlayVideos", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Data Saver Mode</h3>
                <p className="text-sm text-gray-600">Reduce data usage when on mobile networks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dataSaverMode}
                  onChange={(e) => handleChange("dataSaverMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Language</h3>
              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Content Language</h3>
              <select
                value={settings.contentLanguage}
                onChange={(e) => handleChange("contentLanguage", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Preferred languages for content in your feed</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <div className="flex space-x-3">
          <button 
            onClick={resetSettings}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
          >
            Reset to Default
          </button>
          <button 
            onClick={exportData}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
          >
            Export Settings
          </button>
        </div>
        <button 
          onClick={saveSettings}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}