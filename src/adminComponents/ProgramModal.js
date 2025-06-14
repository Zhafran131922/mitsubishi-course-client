import React, { useState } from "react";
import { createProgram } from "../../lib/api";

const ProgramModal = ({ isOpen, onClose, onSuccess, token: tokenProp }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "offline",
    url_link: "",
    date_program: "",
    time_program: "",
    duration: 20,
    platform: "Zoom",
    jenis_program: "Presentation",
    content: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, content: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createProgram(form, tokenProp);

      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Tambah Program Baru
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Judul Program <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Masukkan judul program"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_program"
                value={form.date_program}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Waktu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time_program"
                value={form.time_program}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            {/* Duration & Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Durasi (menit) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* URL (conditional) */}
            {form.status === "online" && (
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  URL Meeting <span className="text-red-500">*</span>
                </label>
                <input
                  name="url_link"
                  value={form.url_link}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/meeting"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>
            )}

            {/* Platform & Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option>Zoom</option>
                <option>Google Meet</option>
                <option>Microsoft Teams</option>
                <option>Lainnya</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Jenis Program <span className="text-red-500">*</span>
              </label>
              <select
                name="jenis_program"
                value={form.jenis_program}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option>Presentation</option>
                <option>Workshop</option>
                <option>Webinar</option>
                <option>Lainnya</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Deskripsi program..."
              />
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Gambar Thumbnail
              </label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-4">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-1 flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md bg-white font-medium text-red-600 hover:text-red-500 focus-within:outline-none">
                      <span>Upload file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                </span>
              ) : (
                "Simpan Program"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramModal;
