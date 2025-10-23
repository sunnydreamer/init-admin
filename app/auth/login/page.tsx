"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/fireabse";
import { useUser } from "@/context/userContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/dashboard/coaches");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }

    setLoading(false);
  };

  const handlePasswordReset = async () => {
    setResetMessage("");

    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setShowForgotPopup(false);
      setResetEmail("");
      setTimeout(() => {
        alert(
          "✅ Password reset email sent! Please check your inbox.\n\nIf you don't see it, check your spam folder. If it's still not there, make sure this email exists."
        );
      }, 100);
    } catch (err: unknown) {
      if (err instanceof Error) setResetMessage(err.message);
      else setResetMessage(String(err));
    }
    setResetLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-semibold text-center">Welcome Back</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full p-3 rounded text-white font-medium transition-colors ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <a href="/auth/signup" className="hover:text-blue-600">
            Sign Up
          </a>
          <button
            type="button"
            onClick={() => setShowForgotPopup(true)}
            className="hover:text-blue-600"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {showForgotPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4 relative">
            <h2 className="text-lg font-semibold text-center">
              Reset Password
            </h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {resetMessage && (
              <p
                className={`text-sm text-center ${
                  resetMessage.includes("sent")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {resetMessage}
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowForgotPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className={`px-4 py-2 rounded text-white font-medium transition-colors ${
                  resetLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {resetLoading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
