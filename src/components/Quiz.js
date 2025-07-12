"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const QuizSection = ({ material }) => {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passed, setPassed] = useState(false);
  const [quizStatus, setQuizStatus] = useState(null); // 'passed', 'failed', or null

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to authenticate user");
      }
    } else {
      setError("No authentication token found");
    }
  }, []);

  // Reset state when material changes
  useEffect(() => {
    setQuiz([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    setLoading(true);
    setError("");
    setPassed(false);
    setQuizStatus(null);
  }, [material]);

  useEffect(() => {
    if (!material?.id || !userId) return;

    const checkQuizStatus = async () => {
      try {
        // Check localStorage first for cached status
        const cachedStatusKey = `quizStatus-${userId}-${material.id}`;
        const cachedStatus = localStorage.getItem(cachedStatusKey);
        const cachedScoreKey = `quizScore-${userId}-${material.id}`;

        if (cachedStatus === "passed") {
          const cachedScore = localStorage.getItem(cachedScoreKey);
          setQuizStatus("passed");
          setScore(cachedScore ? parseInt(cachedScore) : null);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://duanol.mitsubishi-training.my.id/api/v1/quiz/score/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch quiz status for user ${userId}`);
        }

        const data = await response.json();

        if (data.id_material === material.id && data.status === "passed") {
          setQuizStatus("passed");
          setScore(data.score || null);
          // Cache the status and score in localStorage
          localStorage.setItem(`quizStatus-${userId}-${material.id}`, "passed");
          localStorage.setItem(
            `quizScore-${userId}-${material.id}`,
            data.score || ""
          );
          setLoading(false);
          return;
        }

        // If not passed, fetch the quiz questions
        fetchQuiz();
      } catch (err) {
        console.error("Error checking quiz status:", err);
        // If error checking status, still try to fetch quiz
        fetchQuiz();
      }
    };

    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://duanol.mitsubishi-training.my.id/api/v1/quiz/materials/${material.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        setQuizStatus(null); // Reset status since we're showing the quiz
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkQuizStatus();
  }, [material, userId]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (!userId) {
        throw new Error("User authentication failed. Please login again.");
      }

      const token = localStorage.getItem("token");

      const payload = {
        userId: userId,
        materialId: material.id,
        answers: Object.entries(selectedAnswers).map(
          ([questionId, answerId]) => ({
            questionId: Number(questionId),
            selectedAnswerId: answerId,
          })
        ),
      };

      const response = await fetch(
        "https://duanol.mitsubishi-training.my.id/api/v1/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit quiz");
      }

      const result = await response.json();
      setScore(result.score);
      setSubmitted(true);

      // Check if user passed (>= 65%)
      const percentage = (result.score / quiz.length) * 100;
      if (percentage >= 65) {
        setPassed(true);
        setQuizStatus("passed");
        setScore(result.score);
        // Cache the passed status and score in localStorage
        const cachedStatusKey = `quizStatus-${userId}-${material.id}`;
        const cachedScoreKey = `quizScore-${userId}-${material.id}`;
        localStorage.setItem(cachedStatusKey, "passed");
        localStorage.setItem(cachedScoreKey, result.score);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error submitting quiz. Please try again.",
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleTryAgain = () => {
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(null);
    setPassed(false);
    setQuizStatus(null);
  };

  if (loading)
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A70000]"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );

  if (quizStatus === "passed")
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="text-center space-y-6">
          <div className="animate-bounce">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full border-4 border-green-300">
              <span className="text-3xl font-bold text-green-700">
                {score || "X"}
                <span className="text-xl">/{quiz.length}</span>
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 animate-fade-in">
            Quiz Completed!
          </h3>

          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                  style={{
                    width: `${((score / quiz.length) * 1).toFixed(0)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="relative z-10 bg-white px-4 py-2 inline-block text-xl font-bold text-green-700">
              {/* {((score / quiz.length) * 1).toFixed(0)}% */}
              Try Another Quiz
            </div>
          </div>

          <div className="animate-pulse bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-inner">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-green-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg font-medium text-green-800">
                Congratulations! You have passed this quiz.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                You scored {score} out of {quiz.length} questions correctly
              </p>
            </div>
          </div>

         
        </div>
      </div>
    );

  if (!quiz.length)
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">No quiz available for this material</div>
      </div>
    );

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quiz: {material.title}</h2>
      </div>

      {submitted && passed ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Quiz Completed!</h3>
          <p className="text-lg">
            Your score: {score} from {quiz.length} questions (
            {((score / quiz.length) * 100).toFixed(0)}%)
          </p>

          <div className="bg-green-100 text-green-800 p-3 rounded-lg inline-block">
            Congratulations! You passed the quiz.
          </div>
        </div>
      ) : submitted ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Quiz Completed!</h3>
          <p className="text-lg">
            Your score: {score} from {quiz.length} questions (
            {((score / quiz.length) * 100).toFixed(0)}%)
          </p>

          <div className="bg-red-100 text-red-800 p-3 rounded-lg inline-block">
            Sorry, you didnt pass. Keep trying!
          </div>

          <div className="pt-4">
            <button
              onClick={handleTryAgain}
              className="bg-[#A70000] text-white px-4 py-2 rounded hover:bg-[#8a0000] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {quiz.map((question) => (
            <div key={question.id} className="mb-6 border-b pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium mb-2">
                  {question.question}
                </h3>
              </div>
              <div className="space-y-2">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`answer-${answer.id}`}
                      name={`question-${question.id}`}
                      checked={selectedAnswers[question.id] === answer.id}
                      onChange={() =>
                        handleAnswerSelect(question.id, answer.id)
                      }
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

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length !== quiz.length ||
                isSubmitting
              }
              className="bg-[#A70000] text-white px-4 py-2 rounded hover:bg-[#8a0000] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-32"
            >
              {isSubmitting ? (
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
                  Submitting...
                </>
              ) : (
                "Submit Quiz"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizSection;
