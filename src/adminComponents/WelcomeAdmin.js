"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const WelcomeAdmin = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bokehPositions, setBokehPositions] = useState([]);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Inisialisasi ukuran container dan posisi bokeh
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });

      const generateBokeh = () => {
        return Array.from({ length: 15 }, () => ({
          id: Math.random().toString(36).substring(7),
          width: Math.random() * 60 + 30,
          height: Math.random() * 60 + 30,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          opacity: Math.random() * 0.3 + 0.2,
        }));
      };
      setBokehPositions(generateBokeh());
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animasi pergerakan bokeh
  useEffect(() => {
    if (bokehPositions.length === 0 || containerSize.width === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setBokehPositions(prevBokehs => 
        prevBokehs.map(bokeh => {
          // Hitung jarak ke mouse
          const dx = mousePosition.x - bokeh.x;
          const dy = mousePosition.y - bokeh.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Jika mouse dekat (dalam 150px), hindari mouse
          let newVx = bokeh.vx;
          let newVy = bokeh.vy;
          
          if (distance < 150) {
            const avoidFactor = 1.5;
            newVx = (dx / distance) * -avoidFactor;
            newVy = (dy / distance) * -avoidFactor;
          } else {
            // Gerakan secara acak
            newVx = bokeh.vx;
            newVy = bokeh.vy;
            
            // Sesekali ubah arah
            if (Math.random() < 0.01) {
              newVx += (Math.random() - 0.5) * 0.5;
              newVy += (Math.random() - 0.5) * 0.5;
            }
            
            // Batasi kecepatan maksimal
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            const maxSpeed = 2;
            if (speed > maxSpeed) {
              newVx = (newVx / speed) * maxSpeed;
              newVy = (newVy / speed) * maxSpeed;
            }
          }
          
          // Update posisi
          let newX = bokeh.x + newVx;
          let newY = bokeh.y + newVy;
          
          // Pantulan dari tepi container
          if (newX < 0 || newX > containerSize.width) {
            newVx *= -0.8;
            newX = Math.max(0, Math.min(newX, containerSize.width));
          }
          if (newY < 0 || newY > containerSize.height) {
            newVy *= -0.8;
            newY = Math.max(0, Math.min(newY, containerSize.height));
          }
          
          return {
            ...bokeh,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [bokehPositions, mousePosition, containerSize]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 rounded-xl shadow-lg overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background Efek */}
      <div className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-80"></div>

      {/* Efek Bokeh */}
      <div className="absolute inset-0">
        {bokehPositions.map((bokeh) => (
          <motion.div
            key={bokeh.id}
            className="absolute bg-red-400 rounded-full blur-xl"
            style={{
              width: `${bokeh.width}px`,
              height: `${bokeh.height}px`,
              x: bokeh.x - bokeh.width/2,
              y: bokeh.y - bokeh.height/2,
              opacity: bokeh.opacity,
            }}
            transition={{
              duration: 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Konten */}
      <div className="relative p-4 text-white">
        <h1 className="text-base lg:text-lg font-bold">
          Welcome Admin!
        </h1>
        <p className="text-sm lg:text-base mt-1">
          Always monitor the learnings of your team on Mitsubishi Training.
        </p>
      </div>
    </div>
  );
};

export default WelcomeAdmin;