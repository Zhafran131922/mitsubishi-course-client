"use client"; // Menandakan ini adalah client component

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  
  const fullText = "Welcome to Mitsubishi Training Center";
  const typingSpeed = 50; // Kecepatan mengetik (ms)

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/trainingSection"); // Pindah ke TrainingSection setelah login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Wrapper untuk menjaga posisi login box tetap di tengah */}
      <div className="relative w-96">
        {/* Logo (Gunakan motion.div untuk animasi) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }} 
          className="absolute top-[-140px] left-1/2 transform -translate-x-1/2"
        >
          <Image src="/assets/logo.png" alt="Logo" width={80} height={80} priority />
        </motion.div>

        {/* Animasi teks */}
        <motion.h1
          className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold text-center whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.h1>

        {/* Kotak Login */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg text-white">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
          Don&apos;t have an account?{" "}
            <Link href="/contact-admin" className="underline">
              Contact Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
