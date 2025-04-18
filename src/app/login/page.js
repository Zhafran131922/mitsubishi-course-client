"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [text, setText] = useState("");
  
  const fullText = "Welcome to Mitsubishi Training Center";
  const typingSpeed = 50;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e, isAdmin) => {
    e.preventDefault();
    router.push(isAdmin ? "/adminAgenda" : "/trainingSection");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-96">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-[-140px] left-1/2 transform -translate-x-1/2"
        >
          <Image src="/assets/logo.png" alt="Logo" width={80} height={80} priority />
        </motion.div>

        <motion.h1
          className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold text-center whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.h1>

        <AnimatePresence mode="wait">
          {isAdminLogin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-lg text-black"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
              <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e, true)}>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-2 rounded-md font-semibold text-white"
                >
                  Login
                </button>
              </form>
              <p className="text-center text-sm mt-4">
                Back to {" "}
                <button onClick={() => setIsAdminLogin(false)} className="underline">
                  User Login
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Users Login</h2>
              <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e, false)}>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mt-1 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-1 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-2 rounded-md font-semibold"
                >
                  Login
                </button>
              </form>
              <p className="text-center text-sm mt-4">
                If you&apos;re an Admin, {" "}
                <button onClick={() => setIsAdminLogin(true)} className="underline">
                  Login Here!
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
