"use client";

import { Bell, User, Home, Settings, LogOut, MessageSquare, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Navigation Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex flex-col items-center">
            <Home
              className={`h-5 w-5 ${pathname === "/dashboard" ? "text-[#A70000]" : "text-gray-500"}`}
            />
            <span className="text-xs mt-1 text-gray-500">Home</span>
          </Link>
          
          <Link href="/messages" className="flex flex-col items-center">
            <MessageSquare
              className={`h-5 w-5 ${pathname === "/messages" ? "text-[#A70000]" : "text-gray-500"}`}
            />
            <span className="text-xs mt-1 text-gray-500">Messages</span>
          </Link>
        </div>

        {/* Notification and Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon with Badge */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <Link
                href="/help"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Link>
              <div className="border-t border-gray-200"></div>
              <button className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;