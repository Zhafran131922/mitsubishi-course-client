"use client";

import { useState, useEffect } from "react";

const QuizSection = ({ material }) => {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Reset state ketika material berubah
  useEffect(() => {
    setQuiz([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    setLoading(true);
    setError("");
  }, [material]);

  useEffect(() => {
    if (!material?.id) return;

    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3001/api/v1/quiz/materials/${material.id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz for material ${material.id}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid quiz data format");
        }

        setQuiz(data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [material]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user')).id;
      
      const payload = {
        userId,
        materialId: material.id,
        answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
          questionId: Number(questionId),
          selectedAnswerId: answerId
        }))
      };

      const response = await fetch(
        "http://localhost:3001/api/v1/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      setScore(result.score);
      setSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error submitting quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3001/api/v1/quiz/${quizId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      // Refresh the quiz list after deletion
      const updatedQuiz = quiz.filter(q => q.id !== quizId);
      setQuiz(updatedQuiz);
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert(error.message || "Error deleting quiz");
    }
  };

  if (loading) return <div>Loading quiz for {material.title}...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!quiz.length) return <div>No quiz available for this material</div>;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quiz: {material.title}</h2>
        {/* You can add a button here to delete the entire quiz set if needed */}
      </div>
      
      {submitted ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold">Quiz Completed!</h3>
          <p className="text-lg mt-2">Your score: {score}/100</p>
        </div>
      ) : (
        <>
          {quiz.map((question) => (
            <div key={question.id} className="mb-6 border-b pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">{question.question}</h3>
                <button
                  onClick={() => handleDeleteQuiz(question.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-2">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`answer-${answer.id}`}
                      name={`question-${question.id}`}
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() => handleAnswerSelect(question.id, answer.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <label
                      htmlFor={`answer-${answer.id}`}
                      className="ml-2 block text-gray-700"
                    >
                      {answer.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default QuizSection;