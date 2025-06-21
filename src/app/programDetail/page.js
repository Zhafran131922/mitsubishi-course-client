"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProgramById } from "../../../lib/api";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { Suspense } from "react";

const AdminPageProgramContent = () => {
  const [program, setProgram] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");
  const [imgSrc, setImgSrc] = useState(program?.image || "");

  useEffect(() => {
    async function loadProgram() {
      if (!programId) return;
      setIsLoading(true);
      try {
        const data = await fetchProgramById(programId);
        if (data) {
          setProgram({
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            date_program: data.date_program,
            time_program: data.time_program,
            duration: data.duration,
            platform: data.platform,
            jenis_program: data.jenis_program,
            url_link: data.url_link,
            image: data.content
              ? `https://duanol.mitsubishi-training.my.id/uploads/${data.content
                  .split("/")
                  .pop()}`
              : "/default-image.jpg",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
          setImgSrc(
            data.content
              ? `https://duanol.mitsubishi-training.my.id/uploads/${data.content
                  .split("/")
                  .pop()}`
              : "/default-image.jpg"
          );
        }
      } catch (error) {
        console.error("Failed to load program:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgram();
  }, [programId]);

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = timeString.split(":");
    return `${time[0]}:${time[1]}`;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="fixed lg:relative z-50 h-screen">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : program ? (
          <div className="max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors"
              >
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali ke Daftar Program
              </button>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg mb-8 border border-gray-200">
              <Image
                src={imgSrc}
                alt={program.title}
                width={800}
                height={384}
                className="w-full h-96 object-cover object-center"
                onError={() => setImgSrc("/default-image.jpg")}
              />
            </div>

            {/* Program Content */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              {/* Title and Status */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {program.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        program.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {program.status === "online" ? "Online" : "Offline"}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      {program.jenis_program}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Deskripsi Program
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {program.description || "Tidak ada deskripsi tersedia"}
                </div>
              </div>

              {/* Program Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3 text-lg">
                    Informasi Waktu
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(program.date_program).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Waktu</p>
                      <p className="text-gray-800 font-medium">
                        {formatTime(program.time_program) || "Tidak ditentukan"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Durasi</p>
                      <p className="text-gray-800 font-medium">
                        {formatDuration(program.duration) || "Tidak ditentukan"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3 text-lg">
                    Informasi Teknis
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Platform</p>
                      <p className="text-gray-800 font-medium">
                        {program.platform || "Tidak ditentukan"}
                      </p>
                    </div>
                    {program.status === "online" && (
                      <div>
                        <p className="text-sm text-gray-500">Link</p>
                        <p className="text-gray-800 font-medium">
                          {program.url_link ? (
                            <a
                              href={
                                program.url_link.startsWith("https")
                                  ? program.url_link
                                  : `https://${program.url_link}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:underline"
                            >
                              Click here!
                            </a>
                          ) : (
                            "Tidak tersedia"
                          )}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Dibuat pada</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(program.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-between text-sm text-gray-500">
                  <p>
                    Terakhir diperbarui:{" "}
                    {new Date(program.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Program tidak ditemukan
            </h3>
            <p className="mt-1 text-gray-500">
              Program yang Anda cari tidak tersedia atau telah dihapus.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPageProgram = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPageProgramContent />
    </Suspense>
  );
};

export default AdminPageProgram;