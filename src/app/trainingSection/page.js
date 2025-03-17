"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import TrainCards from "@/components/TrainCards";
import Footer from "@/components/Footer";

export default function TrainingSection() {
  const images = ["/assets/car1.jpg", "/assets/car2.jpg", "/assets/car3.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="z-50">
        <Sidebar />
      </div>

      {/* Konten utama + Footer */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-6 w-full mt-20 flex flex-col items-center">
          {/* Carousel Gambar Responsif */}
          <div className="w-full max-w-[1500px] h-auto max-h-[500px] 2xl:ml-64">
            <div className="w-full max-w-[1500px] h-auto max-h-[500px] overflow-hidden rounded-xl shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full object-cover rounded-xl"
                />
              </AnimatePresence>
            </div>

            {/* Indikator (Tiga Titik) */}
            <div className="flex mt-4 space-x-2 justify-center">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  } transition duration-300`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          <h1 className="mt-12 mb-9 text-2xl font-bold text-black 2xl:ml-64">
            Your Timeline
          </h1>
          <div>
            <Calendar />
          </div>
          <h1 className="mt-8 text-2xl font-bold text-black 2xl:ml-64">
            Courses Available
          </h1>
          <TrainCards />
        </div>
        <div className="2xl:ml-64">
          <Footer />
        </div>
      </div>
    </div>
  );
}
