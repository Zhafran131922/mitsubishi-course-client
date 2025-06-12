"use client";

const Overview = ({ material }) => {
  if (!material) {
    return <div>No material selected</div>;
  }

  if (!material.overview) {
    return <div>No overview available for this material</div>;
  }

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Overview</h2>
      <p className="text-gray-700 whitespace-pre-line">{material.overview}</p>
    </div>
  );
};

export default Overview;
