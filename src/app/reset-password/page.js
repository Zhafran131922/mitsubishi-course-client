"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

function ResetPasswordContent() {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const tokenParam = urlParams.get('token') || queryString.split('?')[1];
      setToken(tokenParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing reset token. Please check your reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://duanol.mitsubishi-training.my.id/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage("Password successfully changed. Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              src="/assets/logo.png"
              alt="Mitsubishi Logo"
              width={40}
              height={40}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your new password below
          </p>
        </div>

        {token === null ? (
          <div className="text-center text-gray-600">Loading token...</div>
        ) : !token ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">Invalid reset link format.</p>
            <p className="text-sm text-gray-500 mb-4">
              Please make sure your URL looks like:<br />
              <code className="bg-gray-100 p-1 rounded text-xs">.../reset-password?token=YOUR_TOKEN</code>
            </p>
            <a 
              href="/login" 
              className="text-blue-500 hover:underline text-sm"
            >
              Back to login
            </a>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                  placeholder="Confirm new password"
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Processing..." : "Reset Password"}
              </motion.button>
            </form>
            
            {message && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 text-sm text-center ${
                  message.includes("successfully") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </motion.p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
        <div className="text-white">Loading reset password form...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}