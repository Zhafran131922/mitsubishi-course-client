"use client"; // Jika Anda menggunakan Next.js

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WelcomeAdmin = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bokehPositions, setBokehPositions] = useState([]);

  // Hanya jalankan di client untuk menghindari SSR hydration error
  useEffect(() => {
    const generateBokeh = () => {
      return Array.from({ length: 10 }, () => ({
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        top: Math.random() * 100,
        left: Math.random() * 100,
      }));
    };

    setBokehPositions(generateBokeh());
  }, []);

  // Fungsi untuk menangkap posisi mouse saat hover
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative w-[800px] h-[400px] rounded-xl shadow-lg overflow-hidden bg-black"
      onMouseMove={handleMouseMove} // Menangkap posisi mouse
    >
      {/* Background Efek Bokeh */}
      <div className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-80"></div>

      {/* Efek bokeh */}
      <div className="absolute inset-0">
        {bokehPositions.map((bokeh, i) => (
          <motion.div
            key={i}
            className="absolute bg-red-400 opacity-30 rounded-full blur-2xl"
            style={{
              width: `${bokeh.width}px`,
              height: `${bokeh.height}px`,
              top: `${bokeh.top}%`,
              left: `${bokeh.left}%`,
            }}
            animate={{
              x: mousePosition.x / 30 - 15, // Lebih smooth
              y: mousePosition.y / 30 - 15,
            }}
            transition={{
              duration: 2.5, // Lebih halus
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Konten */}
      <div className="relative p-6 text-white">
        <h1 className="text-2xl font-bold">Selamat Datang, Admin!</h1>
        <p className="text-lg">Terus pantau kegiatan pembelajaran di Mitsubishi Course.</p>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
