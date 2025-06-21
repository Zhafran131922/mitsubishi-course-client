const Module = ({ material }) => {
  if (!material || material.length === 0) {
    return <p>Tidak ada modul tersedia.</p>;
  }

  // Fungsi untuk mengecek ekstensi file
  const getFileExtension = (filename) => {
    return filename?.split('.').pop().toLowerCase();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Daftar Modul</h2>
      {material.map((item) => {
        const modulePath =
          item.module?.split("uploads\\")[1] ||
          item.module?.split("uploads/")[1];
        const moduleUrl = `https://duanol.mitsubishi-training.my.id/uploads/${modulePath}`;
        const fileExtension = getFileExtension(item.module);
        const isPowerPoint = ['ppt', 'pptx'].includes(fileExtension);
        const isPDF = fileExtension === 'pdf';

        return (
          <div key={item.id} className="p-4 border rounded shadow space-y-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <a
              href={moduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download {isPowerPoint ? 'PowerPoint' : 'PDF'}
            </a>

            {/* Tampilkan pratinjau berdasarkan jenis file */}
            <div className="mt-4 h-[600px]">
              {isPDF ? (
                <iframe
                  src={moduleUrl}
                  title={item.title}
                  width="100%"
                  height="100%"
                  className="border"
                >
                  PDF tidak dapat ditampilkan.
                </iframe>
              ) : isPowerPoint ? (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(moduleUrl)}`}
                  width="100%"
                  height="100%"
                  className="border"
                  frameBorder="0"
                >
                  PowerPoint tidak dapat ditampilkan.
                </iframe>
              ) : (
                <div className="bg-gray-100 p-4 rounded h-full flex items-center justify-center">
                  <p>Format file tidak didukung untuk pratinjau.</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Module;