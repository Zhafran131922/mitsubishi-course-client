import React, { useState } from "react";

export default function CreateTopicModal({ isOpen, onClose, token }) {
  // Consolidated form state
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    idUser: "",
    duration: "",
    picture: null,
    materials: [
      {
        title: "",
        urlLink: "",
        markDone: false,
        modules: [],
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  // Form change handler
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

  // Material change handler
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

  // Add new material
  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          title: "",
          urlLink: "",
          markDone: false,
          modules: [],
        },
      ],
    }));
  };

  // Remove material
  const removeMaterial = (index) => {
    if (formData.materials.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.level ||
      !formData.idUser ||
      !formData.duration ||
      !formData.picture
    ) {
      alert("Semua field topik wajib diisi.");
      return;
    }

    // Validate each material
    for (const material of formData.materials) {
      if (
        !material.title ||
        !material.urlLink ||
        material.modules.length === 0
      ) {
        alert("Semua field material wajib diisi.");
        return;
      }
    }

    setLoading(true);

    try {
      const authToken = localStorage.getItem("token") || token;
      if (!authToken)
        throw new Error("Token tidak ditemukan. Silakan login kembali.");

      // 1. Create Topic
      const topicForm = new FormData();
      topicForm.append("title", formData.title);
      topicForm.append("level", formData.level);
      topicForm.append("id_user", formData.idUser);
      topicForm.append("duration", formData.duration);
      topicForm.append("picture", formData.picture);

      const topicRes = await fetch("http://localhost:3001/api/v1/topics", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: topicForm,
      });

      if (!topicRes.ok) {
        const errorData = await topicRes.json();
        throw new Error(errorData.message || "Gagal membuat topik");
      }

      const topicData = await topicRes.json();
      const topicId = topicData.data.id_topic;

      // 2. Create Materials
      const materialCreationPromises = formData.materials.map(
        async (material) => {
          const materialForm = new FormData();
          materialForm.append("topicId", topicId);
          materialForm.append("title", material.title);
          materialForm.append("url_link", material.urlLink);
          materialForm.append("mark_done", material.markDone);
          material.modules.forEach((module) =>
            materialForm.append("module", module)
          );

          const materialRes = await fetch(
            "http://localhost:3001/api/v1/materials",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${authToken}` },
              body: materialForm,
            }
          );

          if (!materialRes.ok) {
            const errorData = await materialRes.json();
            throw new Error(errorData.message || "Gagal membuat material");
          }

          return await materialRes.json();
        }
      );

      await Promise.all(materialCreationPromises);

      alert("✅ Topik dan Material berhasil dibuat!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert(`Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">
          Create New Topic & Materials
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic Form Fields */}
          <input
            name="title"
            placeholder="Title"
            className="w-full border rounded p-2"
            value={formData.title}
            onChange={handleChange}
            required
          />
          {/* <input
            name="level"
            placeholder="Level (Beginner/Intermediate/Advanced)"
            className="w-full border rounded p-2"
            value={formData.level}
            onChange={handleChange}
            required
          /> */}
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Pilih Level --</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            name="idUser"
            type="number"
            placeholder="User ID"
            className="w-full border rounded p-2"
            value={formData.idUser}
            onChange={handleChange}
            required
          />
          <input
            name="duration"
            type="number"
            placeholder="Duration (minutes)"
            className="w-full border rounded p-2"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            name="picture"
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleChange}
            required
          />

          {/* Materials Section */}
          <hr className="my-4" />
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Materials</h3>
            <button
              type="button"
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              onClick={addMaterial}
            >
              Add Material
            </button>
          </div>

          {formData.materials.map((material, index) => (
            <div key={index} className="border p-3 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Material {index + 1}</span>
                {formData.materials.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => removeMaterial(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                name="title"
                placeholder="Judul Material"
                className="w-full border p-2 rounded mb-2"
                value={material.title}
                onChange={(e) => handleMaterialChange(index, e)}
                required
              />
              <input
                name="urlLink"
                placeholder="URL Link"
                className="w-full border p-2 rounded mb-2"
                value={material.urlLink}
                onChange={(e) => handleMaterialChange(index, e)}
                required
              />
              <input
                type="file"
                name="modules"
                multiple
                className="w-full mb-2"
                onChange={(e) => handleMaterialChange(index, e)}
                required
              />
              <label className="flex items-center space-x-2">
                <input
                  name="markDone"
                  type="checkbox"
                  checked={material.markDone}
                  onChange={(e) => handleMaterialChange(index, e)}
                />
                <span>Tandai sebagai selesai</span>
              </label>
            </div>
          ))}

          {/* Form Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
