"use client"

import React, { useState } from "react";
import Image from "next/image";
import QuizSection from "@/components/CourseSection";
import Sidebar from "@/components/Sidebar";

const courseContents = [
  "01: Pengenalan Mitsubishi New Pajero Sport",
  "02: Fitur dan Spesifikasi Utama",
  "03: Teknologi Terkini",
  "04: Uji Performa",
  "05: Perbandingan dengan Kompetitor",
  "06: Tips Perawatan",
];

const chapterContents = {
  0: {
    title: "Pengenalan Mitsubishi New Pajero Sport",
    content: [
      {
        type: "text",
        data: "Mitsubishi New Pajero Sport menghadirkan konsep 'Live The Adventure' dengan desain yang lebih maskulin dan berkarakter. SUV ini merupakan generasi terbaru dari lini Pajero Sport yang telah terbukti tangguh di berbagai medan."
      },
      {
        type: "image",
        data: "/assets/pajero-intro.jpg",
        caption: "Tampilan depan New Pajero Sport dengan desain Dynamic Shield terbaru"
      },
      {
        type: "text",
        data: "Diluncurkan pertama kali di Thailand, New Pajero Sport membawa banyak penyegaran baik dari segi desain eksterior, interior, maupun fitur keselamatan."
      }
    ]
  },
  1: {
    title: "Fitur dan Spesifikasi Utama",
    content: [
      {
        type: "text",
        data: "New Pajero Sport hadir dengan dimensi yang lebih besar dari pendahulunya. Berikut spesifikasi utama:"
      },
      {
        type: "table",
        data: {
          headers: ["Parameter", "Spesifikasi"],
          rows: [
            ["Mesin", "2.4L Diesel Turbo Intercooler"],
            ["Tenaga", "181 HP @ 3,500 rpm"],
            ["Torsi", "430 Nm @ 2,500 rpm"],
            ["Transmisi", "8-speed AT"],
            ["Kapasitas Tangki", "68 liter"]
          ]
        }
      },
      {
        type: "text",
        data: "Fitur unggulan termasuk Multi Around Monitor, Ultrasonic Misacceleration Mitigation System, dan Active Stability Control."
      }
    ]
  },
};

const Courses = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Training Section
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-2">
            Materi Teks
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <h1 className="text-xl md:text-2xl font-bold">
                Mitsubishi New Pajero Sport : Live The Adventure
              </h1>
              <button 
                onClick={toggleBookmark}
                className="p-1 hover:bg-gray-200 rounded-full"
                aria-label="Bookmark"
              >
                <Image 
                  src={bookmarked ? "/assets/bookmark-filled.png" : "/assets/bookmark-outline.png"} 
                  alt="Bookmark" 
                  width={24} 
                  height={24} 
                />
              </button>
            </div>
            <div className="flex gap-4 mt-2 flex-wrap">
              <div className="flex items-center">
                <Image src="/assets/level.png" alt="Level" width={20} height={20} />
                <p className="text-gray-600 ml-2 text-sm">Beginner</p>
              </div>
              <div className="flex items-center">
                <Image src="/assets/time.png" alt="Time" width={20} height={20} />
                <p className="text-gray-600 ml-2 text-sm">Estimasi baca: 15 menit</p>
              </div>
              <div className="flex items-center">
                <Image src="/assets/pages.png" alt="Pages" width={20} height={20} />
                <p className="text-gray-600 ml-2 text-sm">6 bagian</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-end w-full md:w-auto">
            <button className="flex items-center text-[#A70000] font-bold text-sm px-3 py-1 border border-[#A70000] rounded">
              <Image src="/assets/share.png" alt="Share" width={16} height={16} />
              <span className="ml-2">Bagikan</span>
            </button>
            <button className="flex items-center bg-[#A70000] text-white text-sm px-4 py-2 font-bold rounded-lg">
              <Image src="/assets/done.png" alt="Mark As Done" width={16} height={16} />
              <span className="ml-2">Tandai Selesai</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="w-full lg:flex-1 bg-white rounded-lg shadow-md p-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-[#A70000] mb-4">
                {chapterContents[activeChapter].title}
              </h2>
              
              {chapterContents[activeChapter].content.map((item, index) => {
                switch(item.type) {
                  case 'text':
                    return (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {item.data}
                      </p>
                    );
                  case 'image':
                    return (
                      <div key={index} className="my-6">
                        <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
                          <Image 
                            src={item.data} 
                            alt={item.caption} 
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                          {item.caption}
                        </p>
                      </div>
                    );
                  case 'table':
                    return (
                      <div key={index} className="overflow-x-auto my-6">
                        <table className="min-w-full border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              {item.data.headers.map((header, i) => (
                                <th key={i} className="p-3 text-left border-b border-gray-200">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.data.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                {row.map((cell, j) => (
                                  <td key={j} className="p-3 border-b border-gray-200">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                {activeChapter > 0 && (
                  <button 
                    onClick={() => setActiveChapter(activeChapter - 1)}
                    className="flex items-center text-[#A70000] font-medium"
                  >
                    <Image src="/assets/arrow-left.png" alt="Previous" width={16} height={16} />
                    <span className="ml-2">Sebelumnya</span>
                  </button>
                )}
                {activeChapter < Object.keys(chapterContents).length - 1 && (
                  <button 
                    onClick={() => setActiveChapter(activeChapter + 1)}
                    className="flex items-center bg-[#A70000] text-white px-4 py-2 rounded ml-auto"
                  >
                    <span>Selanjutnya</span>
                    <Image src="/assets/arrow-right.png" alt="Next" width={16} height={16} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-[#A70000] text-white p-3 font-bold">
                Daftar Materi
              </div>
              <div className="divide-y divide-gray-200">
                {courseContents.map((content, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveChapter(index)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition ${
                      activeChapter === index ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        activeChapter === index ? "bg-[#A70000] text-white" : "bg-gray-200"
                      }`}>
                        {index + 1}
                      </div>
                      <span>{content}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h3 className="font-bold mb-2 flex items-center">
                <Image src="/assets/notes.png" alt="Notes" width={20} height={20} className="mr-2" />
                Catatan Anda
              </h3>
              <textarea 
                className="w-full border border-gray-300 rounded p-2 text-sm h-32"
                placeholder="Tulis catatan penting di sini..."
              ></textarea>
              <button className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-3 rounded">
                Simpan
              </button>
            </div>
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