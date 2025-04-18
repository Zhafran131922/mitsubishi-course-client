import React from "react";
import Image from "next/image";
import QuizSection from "@/components/CourseSection";
import Sidebar from "@/components/Sidebar";

const courseContents = [
  "01: Lorem Ipsum",
  "02: Lorem Ipsum",
  "03: Lorem Ipsum",
  "04: Lorem Ipsum",
  "05: Lorem Ipsum",
  "06: Lorem Ipsum",
];

const Courses = () => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Training Section
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Materi
          </span>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h1 className="text-xl font-bold">
              Mitsubishi New Pajero Sport : Live The Adventure
            </h1>
            <div className="flex gap-4 mt-2 flex-wrap">
              <div className="flex items-center">
                <Image src="/assets/level.png" alt="Level" width={24} height={24} />
                <p className="text-gray-600 ml-2">Beginner</p>
              </div>
              <div className="flex items-center">
                <Image src="/assets/time.png" alt="Time" width={24} height={24} />
                <p className="text-gray-600 ml-2">7.02 Menit</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 lg:mt-0 justify-end lg:mr-39 xl:mr-0 sm:justify-end w-full">
            <button className="text-[#A70000] font-bold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2">
              Share
            </button>
            <button className="flex items-center bg-[#A70000] text-white text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 font-bold rounded-lg">
              <Image src="/assets/done.png" alt="Mark As Done" width={20} height={20} />
              <span className="ml-2">Mark As Done</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="w-full lg:flex-1">
            <iframe
              src="https://www.youtube.com/embed/BaZlx1dwE2U?si=PteMuyoPtPoofq0J"
              title="Course Video"
              allowFullScreen
              className="w-full h-60 sm:h-80 lg:h-[600px] rounded-lg shadow-md"
            ></iframe>
          </div>

          <div className="w-full lg:w-1/3 overflow-hidden">
            <table className="w-full lg:w-55 xl:w-full border border-gray-300">
              <thead>
                <tr className="bg-[#A70000] text-white">
                  <th className="p-2">#</th>
                  <th className="p-2">Course Content</th>
                </tr>
              </thead>
              <tbody>
                {courseContents.map((content, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 text-black hover:bg-gray-200"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-6">
          <QuizSection />
        </div>
      </div>
    </div>
  );
};

export default Courses;
