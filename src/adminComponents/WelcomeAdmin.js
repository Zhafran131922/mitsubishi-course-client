"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WelcomeAdmin = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bokehPositions, setBokehPositions] = useState([]);

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

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative w-full h-96 rounded-xl shadow-lg overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background Efek */}
      <div className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-80"></div>

      {/* Efek Bokeh */}
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
              x: mousePosition.x / 30 - 15,
              y: mousePosition.y / 30 - 15,
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Konten */}
      <div className="relative p-4 text-white">
        <h1 className="text-base lg:text-lg font-bold">
          Selamat Datang, Admin!
        </h1>
        <p className="text-sm lg:text-base mt-1">
          Terus pantau kegiatan pembelajaran di Mitsubishi Course.
        </p>
      </div>
    </div>
  );
};

export default WelcomeAdmin;
