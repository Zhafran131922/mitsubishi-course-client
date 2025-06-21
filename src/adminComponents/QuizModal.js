import React, { useState, useEffect } from "react";
import { getMaterialsAndTopics } from "../../lib/api";
import { createQuiz } from "../../lib/api";
import Swal from "sweetalert2";

const QuizModal = ({ isOpen, onClose, onSave }) => {
  const [idMaterial, setIdMaterial] = useState("");
  const [questions, setQuestions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMaterialsAndTopics = async () => {
      try {
        const { materials, topics } = await getMaterialsAndTopics();
        setMaterials(materials);
        setTopics(topics);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Gagal mengambil data");
      } finally {
        setLoadingMaterials(false);
      }
    };

    fetchMaterialsAndTopics();
  }, [isOpen]);

  const getTopicName = (idTopic) => {
    const topic = topics.find((t) => t.id === idTopic);
    return topic ? topic.name : "Unknown Topic";
  };

  const addQuestion = (type) => {
    const newQuestion = {
      question: "",
      type,
      answers:
        type === "truefalse"
          ? [
              { answer: "True", isCorrect: false },
              { answer: "False", isCorrect: false },
            ]
          : Array.from({ length: 4 }, () => ({ answer: "", isCorrect: false })),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, aIndex, field, value) => {
    const updated = [...questions];
    if (field === "isCorrect") {
      updated[qIndex].answers = updated[qIndex].answers.map((ans, i) => ({
        ...ans,
        isCorrect: i === aIndex ? value : false,
      }));
    } else {
      updated[qIndex].answers[aIndex].answer = value;
    }
    setQuestions(updated);
  };

  const deleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idMaterial) {
      Swal.fire({
        title: "Peringatan",
        text: "Pilih materi terlebih dahulu",
        icon: "warning",
        confirmButtonColor: "#A70000",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Peringatan",
        text: "Anda harus login terlebih dahulu",
        icon: "warning",
        confirmButtonColor: "#A70000",
      });
      return;
    }

    try {
      // Validate all questions first
      for (const q of questions) {
        if (!q.question || q.answers.some((a) => !a.answer)) {
          Swal.fire({
            title: "Peringatan",
            text: "Lengkapi semua pertanyaan dan jawaban terlebih dahulu",
            icon: "warning",
            confirmButtonColor: "#A70000",
          });
          return;
        }

        if (!q.answers.some((a) => a.isCorrect)) {
          Swal.fire({
            title: "Peringatan",
            text: "Setiap soal harus memiliki jawaban benar",
            icon: "warning",
            confirmButtonColor: "#A70000",
          });
          return;
        }
      }

      // Show confirmation dialog
      const confirmResult = await Swal.fire({
        title: "Konfirmasi",
        text: `Apakah Anda yakin ingin membuat ${questions.length} kuis?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A70000",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Buat Kuis",
        cancelButtonText: "Batal",
      });

      if (!confirmResult.isConfirmed) return;

      // Create all quizzes
      const creationPromises = questions.map((q) =>
        createQuiz(
          {
            question: q.question,
            idMaterial,
            answers: q.answers,
          },
          token
        )
      );

      await Promise.all(creationPromises);

      // Show success message
      await Swal.fire({
        title: "Berhasil!",
        text: `Berhasil membuat ${questions.length} kuis`,
        icon: "success",
        confirmButtonColor: "#A70000",
      });

      // Reset form and close
      setIdMaterial("");
      setQuestions([]);
      onClose();
      if (typeof onSave === "function") onSave();
    } catch (err) {
      console.error("Submit error:", err);
      Swal.fire({
        title: "Gagal!",
        text: err.message || "Terjadi kesalahan saat menyimpan kuis",
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Quiz Baru</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materi
          </label>
          {loadingMaterials ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 py-2 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <select
              value={idMaterial}
              onChange={(e) => setIdMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Pilih Materi --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id} className="py-1">
                  {m.title} - {getTopicName(m.idTopic)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => addQuestion("multiple")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Pilihan Ganda
          </button>
          <button
            type="button"
            onClick={() => addQuestion("truefalse")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            True/False
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Belum ada pertanyaan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tambahkan pertanyaan menggunakan tombol di atas
              </p>
            </div>
          )}

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-200 p-5 rounded-lg mb-4 relative bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-3 right-3 flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {q.type === "multiple" ? "Pilihan Ganda" : "True/False"}
                </span>
                <button
                  type="button"
                  onClick={() => deleteQuestion(qIndex)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                  title="Hapus pertanyaan"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pertanyaan {qIndex + 1}
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan pertanyaan"
              />

              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jawaban:
                </label>
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-3">
                    <div
                      className={`flex-1 ${
                        q.type === "multiple"
                          ? ""
                          : "px-3 py-2 bg-gray-50 rounded"
                      }`}
                    >
                      {q.type === "multiple" ? (
                        <input
                          type="text"
                          value={a.answer}
                          onChange={(e) =>
                            handleAnswerChange(
                              qIndex,
                              aIndex,
                              "answer",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Jawaban ${aIndex + 1}`}
                        />
                      ) : (
                        <span className="text-gray-700">{a.answer}</span>
                      )}
                    </div>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`correct-answer-${qIndex}`}
                        checked={a.isCorrect}
                        onChange={() =>
                          handleAnswerChange(qIndex, aIndex, "isCorrect", true)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Benar</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              disabled={loadingMaterials || questions.length === 0}
            >
              Simpan Semua Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
