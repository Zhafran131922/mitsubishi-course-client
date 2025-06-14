import React, { useEffect, useState } from "react";

const Review = ({ material }) => {
  const [passedScores, setPassedScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper untuk mendapatkan info material
  const getMaterialInfo = (m) => {
    if (!m) return { id: null, title: "" };
    if (Array.isArray(m)) return { id: m[0]?.id ?? null, title: m[0]?.title ?? "" };
    if (typeof m === "object") return { id: m.id ?? null, title: m.title ?? "" };
    return { id: m, title: "" };
  };

  const { id: materialId, title: materialTitle = "" } = getMaterialInfo(material);

  useEffect(() => {
    if (!materialId) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/quiz/score", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch scores");

        const data = await res.json();
        const filtered = data.filter(
          (item) => item.status === "passed" && item.id_material === materialId
        );
        setPassedScores(filtered);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [materialId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
        Passed Scores {materialTitle && <span className="text-red-600">for &quot;{materialTitle}&quot;</span>}
        </h2>
        {passedScores.length > 0 && (
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {passedScores.length} passed
          </span>
        )}
      </div>

      {passedScores.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No passed scores</h3>
          <p className="mt-1 text-sm text-gray-500">
            No one has passed this quiz yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {passedScores.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-medium">
                          {item.user?.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.user?.full_name || "Unknown User"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-2 w-32 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 rounded-full bg-red-600" 
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {item.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Review;