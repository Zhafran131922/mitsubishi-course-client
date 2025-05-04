"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow images
  const imageList = [
    "/assets/car1.jpg",
    "/assets/car2.jpg",
    "/assets/car3.jpg",
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleLogin = (e) => {
    e.preventDefault();

    const validUsers = [
      { email: "admin@example.com", password: "admin123", role: "admin" },
      { email: "user@example.com", password: "user123", role: "user" },
    ];

    const user = validUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 3) {
          setShowForgotPassword(true);
        }
        return newAttempts;
      });
      alert("Email atau password salah");
      return;
    }

    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("role", user.role);

    if (user.role === "admin") {
      router.push("/adminAgenda");
    } else {
      router.push("/trainingSection");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black p-4">
      <div className="flex w-full max-w-5xl h-[500px] md:h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side Image (Slideshow) */}
        <div className="w-0 md:w-1/2 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
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
          >
            <Image
              src="/assets/logo.png"
              alt="Mitsubishi Logo"
              width={25}
              height={25}
            />
          </motion.div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Welcome to Mitsubishi
              <br />
              Training Center
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
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
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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