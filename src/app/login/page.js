"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(null);



  // Slideshow state
  const imageList = [
    "/assets/car1.jpg",
    "/assets/car2.jpg",
    "/assets/car3.jpg",
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000); // Ganti gambar setiap 5 detik

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side Image (Slideshow) */}
        <div className="w-1/2 relative hidden md:block overflow-hidden rounded-r-xl">
          {/* Previous image fading out */}
          {prevImageIndex !== null && (
            <Image
              src={imageList[prevImageIndex]}
              alt="Previous"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 transition-opacity duration-1000 opacity-0"
              key={`prev-${imageList[prevImageIndex]}`}
            />
          )}

          {/* Current image fading in */}
          <Image
            src={imageList[currentImageIndex]}
            alt="Current"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 transition-opacity duration-1000 opacity-100"
            key={`current-${imageList[currentImageIndex]}`}
          />

          {/* Overlay text and logo */}
          <div className="absolute bottom-6 left-6 text-white text-xl font-light z-10">
            Capturing Moments, <br /> Creating Memories
          </div>
          <Image
            src="/assets/logo.png"
            alt="Mitsubishi Logo"
            width={25}
            height={25}
            className="absolute top-6 left-6 z-10"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-10">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-gray-800">
              Welcome to Mitsubishi
              <br />
              Training Center
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-right text-sm text-gray-600">
              {showForgotPassword ? (
                <a
                  href="/forgotPassword"
                  className="text-blue-500 hover:underline"
                >
                  Lupa Password?
                </a>
              ) : (
                <span>Lupa Password?</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
