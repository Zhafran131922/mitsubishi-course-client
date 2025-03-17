import React from "react";

const Overview = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold">Modul</h2>
      <p className="text-gray-600 mt-2">Modul 1</p>
      <iframe
        src="https://drive.google.com/file/d/1KCleWOn4bj2mN_gJUalBKMSIpOKOfKyj/preview"
        className="w-full h-[1100px] mt-4 border"
      ></iframe>
    </div>
  );
};

export default Overview;
