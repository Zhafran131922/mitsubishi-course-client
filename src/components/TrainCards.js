import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Signal } from "lucide-react";
import { motion } from "framer-motion";

const TrainCard = ({ title, author, level, duration, image, route }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img src={image} alt="Materi" className="w-full h-48 object-cover" />
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
          <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
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
    <div className="p-4 2xl:ml-64">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(showAll ? courses : courses.slice(0, 4)).map((course, index) => (
          <TrainCard key={index} {...course} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {!showAll ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(true)}
            className="bg-transparent  text-white underline py-2 px-4 rounded-md font-medium hover:text-bold transition"
          >
            View More
          </motion.button>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(false)}
            className="bg-transparent  text-white underline py-2 px-4 rounded-md font-medium hover:text-bold transition"
          >
            Show Less
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CardsContainer;
