"use client";

import { Bell, Menu, User } from "lucide-react"; // Icon dari lucide-react (bisa install: `npm install lucide-react`)
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-auto flex justify-end items-center px-6 py-4 bg-transparent fixed top-4 right-4 z-50">
      {/* Right Side: Notification and Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Bell className="w-6 h-6 text-black" />
          </button>
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition">
            <User className="w-6 h-6 text-black" />
            <span className="hidden md:block text-black font-medium">
              Profile
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
