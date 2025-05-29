const Module = ({ material }) => {
  if (!material || material.length === 0) {
    return <p>Tidak ada modul tersedia.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Daftar Modul</h2>
      {material.map((item) => {
        const modulePath =
          item.module?.split("uploads\\")[1] ||
          item.module?.split("uploads/")[1];
        const moduleUrl = `http://localhost:3001/uploads/${modulePath}`;

        return (
          <div key={item.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <a
              href={moduleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Modul PDF
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default Module;
