"use client";

import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "@/context/userContext";
import { db } from "@/fireabse";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const { user, refreshUserInfo } = useUser();
  const router = useRouter();
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sendEmail = async () => {
    if (!currentUser || sending) return;
    setSending(true);
    setError(null);
    setCountdown(60);

    try {
      await sendEmailVerification(currentUser);
      setSent(true);
      setMessage(`✅ Verification email sent!`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const checkEmailVerificationStatus = async () => {
    if (!currentUser) return;
    try {
      await reload(currentUser);
      if (currentUser.emailVerified) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          isVerified: true,
        });
        setMessage("✅ Email verified! Redirecting...");
        refreshUserInfo();
        setTimeout(() => router.replace("/dashboard/coaches"), 2000);
      }
    } catch {
      setError("Error reloading user data. Please try refreshing the page.");
    }
  };

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (currentUser && !sent) {
      sendEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Poll for verification
  useEffect(() => {
    const interval = setInterval(checkEmailVerificationStatus, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p>
          A verification email has been sent to <strong>{user?.email}</strong>.
          Please check your inbox and click the link to activate your account.
        </p>

        <p className="text-green-600 font-bold">{message}</p>

        <div className="flex justify-center items-center space-x-2">
          <span>Didn&apos;t receive the email?</span>
          <button
            onClick={sendEmail}
            disabled={countdown > 0 || sending}
            className={`font-bold ${
              countdown > 0 || sending
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : sending
              ? "Sending..."
              : "Resend Email"}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
