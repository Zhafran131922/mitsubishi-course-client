import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative mt-12">
      {/* Profile Button */}
      <div
        className="flex items-center bg-black border-2 border-white rounded-full px-4 py-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <Image
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="User"
          width={40}
          height={40}
          className="rounded-full border-2 border-white mr-3"
        />
        <span className="text-white font-bold text-lg mr-2">Admin</span>
        <FaChevronDown className="text-white" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black border-2 border-red-500 rounded-lg shadow-lg overflow-hidden z-10"
          >
            {/* Edit Profile Button */}
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-red-500"
              onClick={() => alert("Edit Profile clicked")}
            >
              <Image src="/assets/edit.png" alt="Edit" width={20} height={20} className="mr-2" />
              Edit Profile
            </button>

            {/* Logout Button */}
            <button
              className="flex items-center w-full px-4 py-2 text-white hover:bg-red-500"
              onClick={() => alert("Logout clicked")}
            >
              <Image src="/assets/logout.png" alt="Logout" width={20} height={20} className="mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
