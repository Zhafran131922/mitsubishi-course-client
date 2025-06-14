"use client";

import { useState } from "react";
import { requestPasswordReset } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await requestPasswordReset(email);
    setMessage("Link untuk reset password telah dikirim ke email Anda.");
  } catch (error) {
    setMessage(error.message);
  }
};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>
        <p className="text-sm mb-4 text-center text-white/80">
          Enter your email and well send you a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-2 rounded-md font-semibold"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-yellow-300">{message}</p>
        )}
        <p className="mt-6 text-center text-sm text-white/60">
          Remember your password?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Go back to login
          </a>
        </p>
      </div>
    </div>
  );
}
