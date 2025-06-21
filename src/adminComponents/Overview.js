"use client";

const Overview = ({ material }) => {
  if (!material?.overview) {
    return null; // Tidak menampilkan apa-apa jika tidak ada overview
  }

  return (
    <div className="bg-tansparent p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Overview</h2>
      <p className="text-gray-700 whitespace-pre-line">{material.overview}</p>
    </div>
  );
};

export default Overview;
