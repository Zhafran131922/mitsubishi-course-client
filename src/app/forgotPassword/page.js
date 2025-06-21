"use client";

import { useState } from "react";
import { requestPasswordReset } from "../../../lib/api";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      await requestPasswordReset(email);
      setMessage("Password reset link has been sent to your email.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
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
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-sm text-center ${
              message.includes("sent") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </motion.p>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}