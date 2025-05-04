"use client";

import { Calendar, Clock, Users, Wifi, Link as LinkIcon } from "lucide-react";

export default function OnlinePrograms() {
  const program = {
    title: "Pelatihan Digital Marketing 2024",
    description: "Pelatihan intensif selama 2 hari yang mencakup strategi pemasaran digital terbaru termasuk SEO, media sosial, dan iklan berbayar. Materi akan disampaikan oleh praktisi berpengalaman di bidangnya.",
    date: "15-16 Juni 2024",
    time: "09:00 - 16:00 WIB",
    platform: "Zoom Meeting",
    link: "https://zoom.us/j/1234567890",
    participants: "Max 50 peserta",
    meetingId: "123 456 7890",
    password: "mitsubishi123",
    image: "/assets/digital-marketing.jpg"
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{program.title}</h2>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Wifi className="w-4 h-4" />
            Online
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Users className="w-4 h-4" />
            {program.participants}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{program.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Tanggal</h3>
                <p className="text-gray-600">{program.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Waktu</h3>
                <p className="text-gray-600">{program.time}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Wifi className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Platform</h3>
                <p className="text-gray-600">{program.platform}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LinkIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-700">Link Meeting</h3>
                <a 
                  href={program.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {program.link}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Informasi Meeting</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Meeting ID</p>
              <p className="font-medium">{program.meetingId}</p>
            </div>
            <div>
              <p className="text-gray-600">Password</p>
              <p className="font-medium">{program.password}</p>
            </div>
          </div>
        </div>

        <button className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Join Sekarang
        </button>
      </div>
    </div>
  );
}