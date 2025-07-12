"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { login } from "../../../lib/api";

// Slideshow images
const imageList = [
  "/assets/mitsubishi1.jpg",
  "/assets/mitsubishi2.jpg",
  "/assets/mitsubishi3.jpg",
];
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      const { access_token, data } = result;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "admin") {
        router.push(`/admin-agenda`);
      } else {
        router.push(`/training-section`);
      }
    } catch (error) {
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 0) {
          setShowForgotPassword(true);
        }
        return newAttempts;
      });
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black p-4">
      <div className="flex w-full max-w-5xl h-[500px] md:h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-0 md:w-1/2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.1 }} // Zoom in bertahap
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1 },
                scale: {
                  duration: 10, // kecepatan zoom
                  ease: "linear",
                  repeat: Infinity, // terus-menerus
                  repeatType: "mirror", // zoom in dan kembali pelan-pelan
                },
              }}
              className="absolute inset-0"
            >
              <Image
                src={imageList[currentImageIndex]}
                alt="Slideshow"
                layout="fill"
                objectFit="cover"
                className="select-none"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay text and logo */}
          <div className="absolute bottom-6 left-6 text-white text-xl font-light z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Capturing Moments, <br /> Creating Memories
            </motion.div>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-6 left-6 z-10"
          ></motion.div>
        </div>
        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="w-fit mx-auto mb-[60px] mt-[-10px]">
              <Image
                src="/assets/logo.png"
                alt="Mitsubishi Logo"
                width={40}
                height={40}
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome to Mitsubishi
              <br />
              Training Center
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
               The official Mitsubishi training center to enhance your technical skills and knowledge.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 sm:space-y-4"
            onSubmit={handleLogin}
          >
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="text-right text-xs sm:text-sm text-gray-600">
              {showForgotPassword ? (
                <motion.a
                  href="/forgotPassword"
                  className="text-blue-500 hover:underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Lupa Password?
                </motion.a>
              ) : (
                <span>Lupa Password?</span>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}