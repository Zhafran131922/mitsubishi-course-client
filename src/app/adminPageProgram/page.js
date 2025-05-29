"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProgramById } from '../../../lib/api';
import Sidebar from '@/adminComponents/Sidebar';

const AdminPageProgram = () => {
  const [program, setProgram] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const programId = searchParams.get('id');

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
            date: data.date_program,
            image: data.content
              ? `http://localhost:3001/uploads/${data.content.split("\\").pop()}`
              : '/default-image.jpg',
          });
        }
      } catch (error) {
        console.error("Failed to load program:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgram();
  }, [programId]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-transparent">
      {/* Sidebar */}
      <div className="fixed lg:relative z-50 h-screen">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : program ? (
          <div className="max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="mb-6">
              <button 
                onClick={() => window.history.back()} 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Kembali ke Daftar Program
              </button>
            </div>

            {/* Program Image */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Program Content */}
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Title and Date */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {new Date(program.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Deskripsi Program</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {program.description}
                </div>
              </div>

              {/* Additional Info (you can add more sections here) */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Tambahan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Lokasi</h3>
                    <p className="text-gray-600">Online/Offline (sesuai kebutuhan)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Kontak</h3>
                    <p className="text-gray-600">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Program tidak ditemukan</h3>
            <p className="mt-1 text-gray-500">Program yang Anda cari tidak tersedia atau telah dihapus.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageProgram;