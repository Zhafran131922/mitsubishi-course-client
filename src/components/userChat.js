"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react"; // Icon dari lucide-react

const UserChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "admin", text: "Halo! Ada yang bisa dibantu?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulasi balasan admin otomatis
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "admin", text: "Baik, kami akan segera tindak lanjuti." },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-[#A70000] text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="mt-4 w-80 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="bg-[#A70000] text-white px-4 py-3 font-semibold">
              Chat dengan Admin
            </div>

            <div className="flex-1 p-3 space-y-2 h-64 overflow-y-auto text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-[#A70000] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-3 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Tulis pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-[#A70000] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#A70000]"
              >
                Kirim
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserChat;
