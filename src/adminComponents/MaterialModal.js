import React, { useState } from "react";

const MaterialModal = ({
  isOpen,
  onClose,
  newProgram,
  handleInputChange,
  handleSubmit,
}) => {
  const [quiz, setQuiz] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isDragging, setIsDragging] = useState(false);

  const addQuestion = (type = "multiple") => {
    let newQuestion = {
      id: Date.now(), // Better ID generation
      question: "",
      type: type,
      correctAnswer: null,
    };

    if (type === "multiple") {
      newQuestion.options = ["", "", "", ""];
    } else if (type === "truefalse") {
      newQuestion.options = ["True", "False"];
    }

    setQuiz([...quiz, newQuestion]);
  };

  const removeQuestion = (index) => {
    setQuiz(quiz.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...quiz];
    updated[index].question = value;
    setQuiz(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quiz];
    updated[qIndex].options[oIndex] = value;
    setQuiz(updated);
  };

  const handleCorrectAnswer = (qIndex, answer) => {
    const updated = [...quiz];
    updated[qIndex].correctAnswer = answer;
    setQuiz(updated);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newIndex) => {
    e.preventDefault();
    const oldIndex = e.dataTransfer.getData("index");
    const newQuiz = [...quiz];
    const [movedItem] = newQuiz.splice(oldIndex, 1);
    newQuiz.splice(newIndex, 0, movedItem);
    setQuiz(newQuiz);
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white p-8 rounded-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create New Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "basic" ? "text-[#A70000] border-b-2 border-[#A70000]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "content" ? "text-[#A70000] border-b-2 border-[#A70000]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "quiz" ? "text-[#A70000] border-b-2 border-[#A70000]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("quiz")}
          >
            Quiz
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, quiz)}>
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Task Name</label>
                  <input
                    type="text"
                    name="title"
                    value={newProgram.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A70000] focus:border-transparent transition-all"
                    placeholder="Enter course name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Creator</label>
                  <input
                    type="text"
                    name="creator"
                    value={newProgram.creator}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A70000] focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Overview</label>
                <textarea
                  name="overview"
                  value={newProgram.overview}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A70000] focus:border-transparent transition-all h-32"
                  placeholder="Describe the course..."
                />
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Video Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#A70000] transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Drag & drop video file or click to browse</p>
                      <input type="file" className="hidden" />
                      <button type="button" className="mt-2 px-4 py-2 bg-[#A70000] text-white rounded-lg text-sm hover:bg-[#850000] transition-colors">
                        Select File
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Module Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#A70000] transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Drag & drop PDF file or click to browse</p>
                      <input type="file" className="hidden" />
                      <button type="button" className="mt-2 px-4 py-2 bg-[#A70000] text-white rounded-lg text-sm hover:bg-[#850000] transition-colors">
                        Select File
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Announcements</label>
                <textarea
                  name="announcements"
                  value={newProgram.announcements}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A70000] focus:border-transparent transition-all h-32"
                  placeholder="Any announcements for students..."
                />
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              {quiz.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="mt-2 text-lg font-medium text-gray-700">No questions yet</h4>
                  <p className="mt-1 text-sm text-gray-500">Add your first question to start building the quiz</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quiz.map((q, qIndex) => (
                    <div
                      key={q.id}
                      className={`p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow ${isDragging ? "border-[#A70000]" : "border-gray-200"}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, qIndex)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, qIndex)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="bg-[#A70000] text-white text-xs font-bold px-2 py-1 rounded mr-2">
                            Q{qIndex + 1}
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {q.type === "multiple" ? "Multiple Choice" : q.type === "truefalse" ? "True/False" : "Essay"}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A70000] mb-3"
                        placeholder="Enter question text..."
                      />

                      {q.type === "multiple" && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                                className="h-4 w-4 text-[#A70000] focus:ring-[#A70000] border-gray-300"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                className="ml-2 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#A70000] flex-grow"
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...quiz];
                                    updated[qIndex].options.splice(oIndex, 1);
                                    setQuiz(updated);
                                  }}
                                  className="ml-2 text-gray-400 hover:text-red-500"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                          {q.options.length < 6 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...quiz];
                                updated[qIndex].options.push("");
                                setQuiz(updated);
                              }}
                              className="mt-1 text-sm text-[#A70000] hover:underline flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add option
                            </button>
                          )}
                        </div>
                      )}

                      {q.type === "truefalse" && (
                        <div className="flex space-x-4">
                          {q.options.map((opt, oIndex) => (
                            <label key={oIndex} className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                                className="h-4 w-4 text-[#A70000] focus:ring-[#A70000] border-gray-300"
                              />
                              <span className="ml-2 text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === "essay" && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500 italic">Student will provide a written response</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addQuestion("multiple")}
                  className="px-4 py-2 bg-[#A70000] text-white rounded-lg hover:bg-[#850000] transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("truefalse")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  True/False
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("essay")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Essay
                </button>
              </div>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex justify-between mt-8 pt-5 border-t border-gray-200">
            <div>
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "quiz" ? "content" : "basic")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {activeTab !== "quiz" && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "basic" ? "content" : "quiz")}
                  className="px-4 py-2 bg-[#A70000] text-white rounded-lg hover:bg-[#850000] transition-colors flex items-center"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {activeTab === "quiz" && (
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#A70000] text-white rounded-lg hover:bg-[#850000] transition-colors font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Course
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;