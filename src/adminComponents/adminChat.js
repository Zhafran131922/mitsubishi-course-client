"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

// Define the AdminChatBox component
const AdminChatBox = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage chat box visibility
  const [users, setUsers] = useState([]); // State to store the list of users
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [chats, setChats] = useState({}); // State to store chat messages
  const [input, setInput] = useState(""); // State to store the input message

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://8218-114-10-44-89.ngrok-free.app/api/v1/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data); // Update the users state with the fetched data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Toggle the visibility of the chat box
  const toggleChat = () => setIsOpen(!isOpen);

  // Handle user selection
  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const response = await fetch(`https://8218-114-10-44-89.ngrok-free.app/api/v1/messages?user_id=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setChats((prevChats) => ({ ...prevChats, [user.id]: data })); // Update the chats state with the fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage = {
      sender_id: 1, // Replace with the actual sender_id of the admin
      receiver_id: selectedUser.id,
      message: input,
    };

    try {
      const response = await fetch("https://4fb5-114-10-44-89.ngrok-free.app/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setChats((prevChats) => ({
        ...prevChats,
        [selectedUser.id]: [...(prevChats[selectedUser.id] || []), sentMessage],
      }));
      setInput(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-red-600 to-red-800 text-white p-3 rounded-full shadow-xl hover:scale-105 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-4 w-[380px] sm:w-[550px] h-[450px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-3 font-semibold text-lg shadow-md">
              Chat Admin Panel
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 overflow-hidden">
              {/* User Sidebar */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                {users.map((user) => (
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
                      src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span>{user.full_name}</span>
                  </div>
                ))}
              </div>

              {/* Chat Content */}
              <div className="w-2/3 flex flex-col bg-white">
                <div className="flex-1 p-4 overflow-y-auto space-y-2 text-sm">
                  {selectedUser &&
                    (chats[selectedUser.id] || []).map((msg, index) => (
                      <div
                        key={index}
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
                        </div>
                      </div>
                    ))}
                  {!selectedUser && (
                    <p className="text-gray-400 text-sm text
::contentReference[oaicite:6]{index=6}
 
                          text-center">
                      Silakan pilih pengguna untuk mulai chat.
                    </p>
                  )}
                </div>

                {/* Message Input */}
                {selectedUser && (
                  <div className="flex items-center border-t border-gray-200 p-3 gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ketik pesan..."
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleSend}
                      className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                    >
                      Kirim
                    </button>
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
