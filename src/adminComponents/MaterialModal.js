import React, { useState } from "react";
import { createTopicWithMaterials } from "../../lib/api";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

export default function CreateTopicModal({
  isOpen,
  onClose,
  token,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    idUser: "1",
    duration: "",
    deadline: "",
    picture: null,
    materials: [
      {
        title: "",
        urlLink: "",
        overview: "",
        modules: [],
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files
            ? files[0]
            : null
          : value,
    }));
  };

  const handleMaterialChange = (index, e) => {
    const { name, value, type, checked, files } = e.target;
    const updatedMaterials = [...formData.materials];

    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files
            ? Array.from(files)
            : []
          : value,
    };

    setFormData((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          title: "",
          urlLink: "",
          overview: "",
          modules: [],
        },
      ],
    }));
  };

  const removeMaterial = (index) => {
    if (formData.materials.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.level ||
      !formData.idUser ||
      !formData.duration ||
      !formData.picture
    ) {
      await Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required topic fields",
        icon: "error",
        confirmButtonColor: "#A70000",
      });
      return;
    }

    for (const material of formData.materials) {
      if (
        !material.title ||
        !material.urlLink ||
        !material.overview ||
        material.modules.length === 0
      ) {
        await Swal.fire({
          title: "Validation Error",
          text: "Please fill in all required material fields",
          icon: "error",
          confirmButtonColor: "#A70000",
        });
        return;
      }
    }

    // Show confirmation dialog
    const confirmResult = await Swal.fire({
      title: "Confirm Submission",
      text: "Are you sure you want to create this topic and materials?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#A70000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Create",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    setLoading(true);

    try {
      // Show loading indicator
      Swal.fire({
        title: "Processing",
        text: "Creating topic and materials...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const newTopic = await createTopicWithMaterials(formData, token);

      // Close loading indicator
      Swal.close();

      // Show success message
      await Swal.fire({
        title: "Success!",
        text: "Topic and materials created successfully!",
        icon: "success",
        confirmButtonColor: "#A70000",
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset form
      setFormData({
        title: "",
        level: "",
        idUser: "1",
        duration: "",
        deadline: "",
        picture: null,
        materials: [
          {
            title: "",
            urlLink: "",
            overview: "",
            modules: [],
          },
        ],
      });

      // Close modal and trigger parent to refresh data
      onClose();
      if (onSuccess) onSuccess(newTopic);
    } catch (error) {
      console.error("Error:", error);

      // Close loading if error occurs
      Swal.close();

      // Show error message
      await Swal.fire({
        title: "Error!",
        text: `Failed to create: ${error.message}`,
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            Buat Topik & Materi Baru
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
                Informasi Topik
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Topik <span className="text-red-600">*</span>
                </label>
                <input
                  name="title"
                  placeholder="Masukkan judul topik"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    required
                  >
                    <option value="">Pilih Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi (menit) <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="duration"
                    type="number"
                    placeholder="Durasi dalam menit"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-600">*</span>
                </label>
                <input
                  name="deadline"
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Thumbnail <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-red-500 rounded-lg cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-5">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 mt-2">
                        {formData.picture
                          ? formData.picture.name
                          : "Upload gambar thumbnail"}
                      </p>
                    </div>
                    <input
                      name="picture"
                      type="file"
                      accept="image/*"
                      className="opacity-0"
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Materials Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Daftar Materi
                </h3>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="flex items-center text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tambah Materi
                </button>
              </div>

              {formData.materials.map((material, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-3 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Materi {index + 1}
                    </span>
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Hapus
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Materi <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="title"
                      placeholder="Judul materi"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                      value={material.title}
                      onChange={(e) => handleMaterialChange(index, e)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Materi <span className="text-red-600">*</span>
                    </label>
                    <input
                      name="urlLink"
                      placeholder="https://example.com/materi"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                      value={material.urlLink}
                      onChange={(e) => handleMaterialChange(index, e)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="overview"
                      placeholder="Deskripsi singkat materi"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                      value={material.overview}
                      onChange={(e) => handleMaterialChange(index, e)}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Pendukung <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-red-500 rounded-lg cursor-pointer transition-all p-4">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-sm text-gray-500 mt-2">
                            {material.modules.length > 0
                              ? `${material.modules.length} file terpilih`
                              : "Upload file pendukung (PDF, DOC, PPT)"}
                          </p>
                        </div>
                        <input
                          type="file"
                          name="modules"
                          multiple
                          className="opacity-0"
                          onChange={(e) => handleMaterialChange(index, e)}
                          required
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
