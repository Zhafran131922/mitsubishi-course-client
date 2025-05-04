"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const AdminChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const mockUsers = [
        { id: 1, full_name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: 2, full_name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: 3, full_name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?u=3" },
      ];

      const mockChats = {
        1: [
          { id: 1, sender_id: 1, receiver_id: 1, message: "Hello, how can I help you?", timestamp: "10:30 AM" },
          { id: 2, sender_id: 1, receiver_id: 1, message: "I have a question about my order", timestamp: "10:32 AM" },
        ],
        2: [
          { id: 3, sender_id: 2, receiver_id: 1, message: "Hi there!", timestamp: "9:15 AM" },
          { id: 4, sender_id: 1, receiver_id: 2, message: "Hello Jane, how can I assist you?", timestamp: "9:16 AM" },
        ],
      };

      setUsers(mockUsers);
      setChats(mockChats);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // In a real app, you would fetch messages for this user here
  };

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      sender_id: 1, // Admin ID
      receiver_id: selectedUser.id,
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));
    
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 rounded-full shadow-xl hover:scale-105 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-4 w-[380px] sm:w-[550px] h-[450px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-gray-200"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 font-semibold text-lg shadow-md">
              Chat Admin Panel
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* User Sidebar */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`flex items-center gap-3 cursor-pointer px-4 py-3 text-sm hover:bg-gray-100 transition ${
                        selectedUser?.id === user.id
                          ? "bg-red-50 font-semibold text-red-600"
                          : ""
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span>{user.full_name}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Content */}
              <div className="w-2/3 flex flex-col bg-white">
                {selectedUser ? (
                  <>
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
                      {(chats[selectedUser.id] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_id === 1
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                              msg.sender_id === 1
                                ? "bg-gradient-to-br from-red-600 to-red-700 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {msg.message}
                            <div className="text-xs mt-1 opacity-70">
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center border-t border-gray-200 p-3 gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={handleSend}
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                    ) : (
                      <>
                        <MessageCircle className="w-10 h-10 mb-2" />
                        <p className="text-sm text-center">
                          Select a user to start chatting
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChatBox;