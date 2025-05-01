"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    if (!token || token.split(".").length !== 3) {
      console.error("Token tidak valid atau tidak lengkap:", token);
      throw new Error("Token tidak valid");
    }
    return jwtDecode(token);
  } catch (err) {
    console.error("Gagal decode token:", err);
    return null;
  }
};

const receiver_id = 1; 

const UserChat = () => {
  const [senderId, setSenderId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token di localStorage:", token); // cek di console
  
    const decoded = decodeToken(token);
    if (decoded && decoded.id) {
      setSenderId(decoded.id);
    } else {
      console.warn("ID tidak ditemukan dalam token");
    }
  }, []);
  

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const fetchMessages = async () => {
    try {
      if (!senderId) return;
      const res = await fetch(
        `http://localhost:3000/api/messages?sender_id=${senderId}&receiver_id=${receiver_id}`
      );
      const data = await res.json();
      const formatted = data.map((item) => ({
        sender: item.sender_id === senderId ? "user" : "admin",
        text: item.message,
      }));
      setMessages(formatted);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
    }
  };

  const sendMessage = async (msgText) => {
    try {
      if (!senderId) return;

      const res = await fetch(
        "https://1d37-114-10-44-89.ngrok-free.app/api/v1/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: senderId,
            receiver_id,
            message: msgText,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengirim pesan");

      const newMessage = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: newMessage.message },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (isOpen && senderId) {
      fetchMessages();
    }
  }, [isOpen, senderId]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleChat}
        className="bg-[#A70000] text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

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
