import React from "react";
import { Mail, MapPin, Phone, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 w-full mt-20">
      <div className="container mx-auto text-center px-4">
        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <img
            src="/assets/logo.png"
            alt="Mitsubishi Logo"
            className="h-10 mr-2"
          />
          <h2 className="text-xl font-bold italic">
            MITSUBISHI TRAINING CENTER
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-gray-700 cursor-pointer">
            <img
              src="/assets/instagram.png"
              alt="Instagram"
              className="h-5"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-gray-700 cursor-pointer">
            <img
              src="/assets/twitter.png"
              alt="Twitter"
              className="h-5"
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:bg-gray-700 cursor-pointer">
            <img
              src="/assets/youtube.png"
              alt="YTube"
              className="h-5"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center text-gray-400 space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>Jl. Mdowdw 9822</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <span>026 565 6565 555</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>userfsds@gmail.com</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 text-sm text-gray-500">
          <p>
            MITSUBISHI TRAINING CENTER &copy; All Rights Reserved Made With{" "}
            <Heart className="inline w-4 h-4 text-red-500" /> By Wahyudi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
