import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Clock, Signal } from "lucide-react";
import { motion } from "framer-motion";

const TrainCard = ({ title, author, level, duration, image, route }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden w-full"
    >
      <div className="relative w-full aspect-[4/3]">
        <Image src={image} alt="Materi" layout="fill" objectFit="cover" />
      </div>
      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-1 text-gray-700 text-sm">
          <span>By {author}</span>
          <CheckCircle className="text-green-500 w-4 h-4" />
        </div>
        <h2 className="text-lg font-bold mt-4">{title}</h2>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <Link href={route}>
          <button className="mt-4 w-full bg-[#A70000] text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
            Buka Materi
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

const CardsContainer = () => {
  const courses = [
    { title: "Artificial Intelligence Basics", author: "Wahyudi", level: "Beginner", duration: "90 Menit", image: "/assets/car1.jpg", route: "/courses" },
    { title: "Machine Learning Fundamentals", author: "Tri", level: "Intermediate", duration: "120 Menit", image: "/assets/car2.jpg", route: "/courses" },
    { title: "Deep Learning Essentials", author: "Agus", level: "Advanced", duration: "180 Menit", image: "/assets/car3.jpg", route: "/courses" },
    { title: "Neural Networks Explained", author: "Mas", level: "Beginner", duration: "75 Menit", image: "/assets/car1.jpg", route: "/courses" },
    { title: "Machine Learning Fundamentals", author: "Tri", level: "Intermediate", duration: "120 Menit", image: "/assets/car2.jpg", route: "/courses" },
    { title: "Deep Learning Essentials", author: "Agus", level: "Advanced", duration: "180 Menit", image: "/assets/car3.jpg", route: "/courses" },
    { title: "Neural Networks Explained", author: "Mas", level: "Beginner", duration: "75 Menit", image: "/assets/car1.jpg", route: "/courses" },
  ];

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full px-4">
      {/* Grid container dengan ukuran box tetap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
        {(showAll ? courses : courses.slice(0, 5)).map((course, index) => (
          <div key={index} className="w-full">
            <TrainCard {...course} />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        {!showAll ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(true)}
            className="bg-transparent text-white underline py-2 px-4 rounded-md font-medium hover:text-bold transition"
          >
            View More
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(false)}
            className="bg-transparent text-white underline py-2 px-4 rounded-md font-medium hover:text-bold transition"
          >
            Show Less
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CardsContainer;