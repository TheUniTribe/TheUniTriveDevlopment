import React, { useState, useMemo } from 'react';

// Mock data for users
const mockUsers = [
  { id: 1, name: "John Doe", avatar: "JD", online: true },
  { id: 2, name: "Alice Smith", avatar: "AS", online: false },
  { id: 3, name: "Bob Johnson", avatar: "BJ", online: true },
  { id: 4, name: "Emma Wilson", avatar: "EW", online: true },
];

// Messages Component
const Messages = () => {
  const [activeView, setActiveView] = useState('inbox');
  const [selectedUser, setSelectedUser] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [drafts, setDrafts] = useState([]);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      alert(`Message sent to ${selectedUser.name}: ${message}`);
      setMessage('');
      setComposeOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSaveDraft = () => {
    if (message.trim()) {
      const newDraft = {
        id: Date.now(),
        content: message,
        to: selectedUser?.name || 'Unknown',
        time: new Date().toLocaleTimeString()
      };
      setDrafts([...drafts, newDraft]);
      setMessage('');
      setComposeOpen(false);
      setSelectedUser(null);
      alert('Draft saved successfully!');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <button
            onClick={() => setComposeOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Compose
          </button>
        </div>
      </div>

      {/* Compose Message Modal */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">New Message</h3>
              <button
                onClick={() => {
                  setComposeOpen(false);
                  setSelectedUser(null);
                  setMessage('');
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {searchTerm && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchTerm(user.name);
                            }}
                          >
                            <div className={`w-3 h-3 rounded-full mr-2 ${user.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{user.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">No users found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  disabled={!message.trim() || !selectedUser}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row h-96">
        {/* Conversation list */}
        <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="divide-y divide-gray-200">
            {mockUsers.map(user => (
              <div
                key={user.id}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-500">Last message preview...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message view */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-2">
                  {selectedUser.avatar}
                </div>
                <h3 className="text-md font-medium text-gray-900">{selectedUser.name}</h3>
                <div className={`w-2 h-2 rounded-full ml-2 ${selectedUser.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {/* Example messages */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg py-2 px-4 shadow-sm max-w-xs md:max-w-md">
                      <p className="text-gray-800">Hi there! How are you doing?</p>
                      <span className="text-xs text-gray-500 mt-1">10:30 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-blue-100 rounded-lg py-2 px-4 shadow-sm max-w-xs md:max-w-md">
                      <p className="text-gray-800">I'm doing great! Thanks for asking.</p>
                      <span className="text-xs text-gray-500 mt-1">10:32 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (message.trim()) {
                        alert(`Message sent: ${message}`);
                        setMessage('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={!message.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
