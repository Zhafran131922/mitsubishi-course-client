"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const dummyUsers = [
  { id: 1, name: "Zhafran", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Alya", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Farhan", avatar: "https://i.pravatar.cc/150?img=3" },
];

const AdminChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (!chats[user.id]) {
      setChats({ ...chats, [user.id]: [] });
    }
  };

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;

    const newMessage = { sender: "admin", text: input };
    const updatedChat = [...(chats[selectedUser.id] || []), newMessage];

    setChats({ ...chats, [selectedUser.id]: updatedChat });
    setInput("");

    // Simulated user reply
    setTimeout(() => {
      setChats((prev) => ({
        ...prev,
        [selectedUser.id]: [
          ...(prev[selectedUser.id] || []),
          { sender: "user", text: "Terima kasih Admin 🙌" },
        ],
      }));
    }, 1000);
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
                {dummyUsers.map((user) => (
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
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span>{user.name}</span>
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
                          msg.sender === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                            msg.sender === "admin"
                              ? "bg-gradient-to-br from-red-600 to-red-700 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  {!selectedUser && (
                    <p className="text-gray-400 text-sm text-center mt-10">
                      Pilih pengguna untuk memulai chat 📬
                    </p>
                  )}
                </div>

                {/* Input */}
                <div className="border-t p-3 flex items-center gap-2 bg-white">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Ketik pesan..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={!selectedUser}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!selectedUser}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-full text-sm shadow hover:scale-105 transition"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminChatBox;
