import React from "react";
import { ArrowUpRight, FileText, Puzzle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const CorporateService = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 2xl:ml-64">
      <Sidebar />
      <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Corporate Service
          </span>
          {/* <span className="bg-red-700 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Materi
          </span> */}
        </div>
      <div className="text-left max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Lorem Ipsum Dolor Sit Amet Consectetur</h1>
        <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
      </div>

      <div className="flex justify-end mt-4 pr-10">
        <button className="bg-red-600 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 transition">
          Start Training <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Hero Image */}
      <div className="mt-6 flex justify-center">
        <img src="/assets/car3.jpg" alt="Corporate Service" className="rounded-lg shadow-lg w-full max-w-4xl" />
      </div>

      {/* Service Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <ServiceCard
          icon={<FileText size={40} className="text-red-600" />}
          title="Lorem Ipsum Dolor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
        />
        <ServiceCard
          icon={<Puzzle size={40} className="text-red-600" />}
          title="Lorem Ipsum Dolor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
        />
        <ServiceCard
          icon={<FileText size={40} className="text-red-600" />}
          title="Lorem Ipsum Dolor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
        />
        <ServiceCard
          icon={<Puzzle size={40} className="text-red-600" />}
          title="Lorem Ipsum Dolor"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
        />
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-lg border border-gray-200">
      <div className="bg-red-100 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default CorporateService;
