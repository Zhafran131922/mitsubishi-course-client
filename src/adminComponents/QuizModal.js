import React, { useState, useEffect } from "react";

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
        const token = localStorage.getItem("token");

        // Fetch materials dan topics secara paralel
        const [materialsRes, topicsRes] = await Promise.all([
          fetch("http://localhost:3001/api/v1/materials", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/v1/topics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!materialsRes.ok) throw new Error("Gagal mengambil data materi");
        if (!topicsRes.ok) throw new Error("Gagal mengambil data topic");

        const materialsData = await materialsRes.json();
        const topicsData = await topicsRes.json();

        setMaterials(materialsData.data);
        setTopics(topicsData.data);
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
      alert("Pilih materi terlebih dahulu");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    for (const q of questions) {
      if (!q.question || q.answers.some((a) => !a.answer)) {
        alert("Lengkapi semua pertanyaan dan jawaban terlebih dahulu");
        return;
      }
      if (!q.answers.some((a) => a.isCorrect)) {
        alert("Setiap soal harus memiliki jawaban benar");
        return;
      }

      const payload = {
        question: q.question,
        idMaterial: Number(idMaterial),
        answers: q.answers,
      };

      try {
        const res = await fetch("http://localhost:3001/api/v1/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Gagal membuat quiz");
        }
      } catch (err) {
        console.error("Submit error:", err);
        alert(err.message || "Terjadi kesalahan saat menyimpan quiz");
        return;
      }
    }

    alert("Semua quiz berhasil dibuat!");
    setIdMaterial("");
    setQuestions([]);
    onClose();
    if (typeof onSave === "function") onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded shadow w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Tambah Quiz</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Materi</label>
          {loadingMaterials ? (
            <p>Memuat daftar materi...</p>
          ) : (
            <select
              value={idMaterial}
              onChange={(e) => setIdMaterial(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Pilih Materi --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} - {getTopicName(m.idTopic)}{" "}
                  {/* Menampilkan judul materi dan nama topic */}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => addQuestion("multiple")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Pilihan Ganda
          </button>
          <button
            type="button"
            onClick={() => addQuestion("truefalse")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + True/False
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border p-4 rounded mb-4 relative bg-gray-50"
            >
              <button
                type="button"
                onClick={() => deleteQuestion(qIndex)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Hapus
              </button>
              <label className="block mb-2 font-semibold">
                Pertanyaan {qIndex + 1}
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full border p-2 rounded mb-3"
                placeholder="Masukkan pertanyaan"
              />

              <div className="space-y-2">
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-2">
                    {q.type === "multiple" && (
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
                        className="flex-1 border p-2 rounded"
                        placeholder={`Jawaban ${aIndex + 1}`}
                      />
                    )}
                    {q.type === "truefalse" && (
                      <span className="flex-1">{a.answer}</span>
                    )}
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={a.isCorrect}
                        onChange={() =>
                          handleAnswerChange(qIndex, aIndex, "isCorrect", true)
                        }
                        className="h-4 w-4"
                      />
                      Benar
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loadingMaterials}
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
