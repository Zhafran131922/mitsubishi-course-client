import React, { useState } from "react";

const MaterialModal = ({ isOpen, onClose, newProgram, handleInputChange, handleSubmit }) => {
  const [quiz, setQuiz] = useState([]);

  // Menambahkan pertanyaan baru
  const addQuestion = () => {
    setQuiz([
      ...quiz,
      { 
        id: quiz.length + 1, 
        question: "", 
        options: ["", "", "", ""], 
        correctAnswer: null 
      }
    ]);
  };

  // Menghapus pertanyaan
  const removeQuestion = (index) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  // Mengubah teks pertanyaan
  const handleQuestionChange = (index, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index].question = value;
    setQuiz(updatedQuiz);
  };

  // Mengubah opsi jawaban
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[qIndex].options[oIndex] = value;
    setQuiz(updatedQuiz);
  };

  // Menentukan jawaban benar
  const handleCorrectAnswer = (qIndex, oIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[qIndex].correctAnswer = oIndex;
    setQuiz(updatedQuiz);
  };

  if (!isOpen) return null; // Cegah modal muncul jika tidak terbuka

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Input */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Name</label>
              <input
                type="text"
                name="title"
                value={newProgram.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Creator</label>
              <input
                type="text"
                name="creator"
                value={newProgram.creator}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Video Upload</label>
              <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Upload</label>
              <input type="file" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          {/* Overview & Announcements */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Overview</label>
            <textarea
              name="overview"
              value={newProgram.overview}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Announcements</label>
            <textarea
              name="announcements"
              value={newProgram.announcements}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
            />
          </div>

          {/* Quiz Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Quiz</h3>
            {quiz.map((q, qIndex) => (
              <div key={q.id} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium">Question {qIndex + 1}</label>
                  <button
                    type="button"
                    className="text-red-500 hover:underline"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder="Enter question"
                />
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-1">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-md mt-2"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Save Course
            </button>
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
