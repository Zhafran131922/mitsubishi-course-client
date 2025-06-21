"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function NotFound() {
  const router = useRouter();

  const handleNavigate = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 overflow-hidden">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10" // 👉 penting untuk di atas partikel
      >
        <h1 className="text-9xl font-bold text-[#A70000] mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">
          Oops! The page you&apos;re looking for couldn&apos;t be found.
        </p>
        <button
          onClick={handleNavigate}
          className="inline-block px-8 py-3 bg-[#A70000] text-white rounded-full shadow-lg hover:bg-red-700 transition"
        >
          Teleport to Login Page
        </button>
      </motion.div>

      {/* Animasi Partikel */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-300 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              opacity: 0.7,
            }}
            animate={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
