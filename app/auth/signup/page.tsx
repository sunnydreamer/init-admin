"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/fireabse";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard/coaches");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }

    setLoading(false);
  };

  const getInputClass = (value: string, fieldError: boolean) =>
    `w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      fieldError ? "border-red-500" : "border-gray-300"
    }`;

  const isFieldError = (fieldValue: string, label?: string) =>
    !!error &&
    (!fieldValue ||
      (label === "Password" &&
        error === "Password must be at least 8 characters.") ||
      (label === "Confirm Password" && error === "Passwords do not match."));

  const renderField = (
    label: string,
    placeholder: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="relative">
      <label
        className={`absolute left-3 -top-2.5 text-xs bg-white px-1 transition-all ${
          value ? "text-blue-500" : "text-gray-400"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={getInputClass(value, isFieldError(value, label))}
      />
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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

        <h1 className="text-3xl font-semibold text-center">Create Account</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col space-y-4">
          {renderField(
            "First Name",
            "Enter your first name",
            "text",
            firstName,
            (e) => setFirstName(e.target.value)
          )}
          {renderField(
            "Last Name",
            "Enter your last name",
            "text",
            lastName,
            (e) => setLastName(e.target.value)
          )}
          {renderField("Email", "Enter your email", "email", email, (e) =>
            setEmail(e.target.value)
          )}
          {renderField(
            "Password",
            "Enter your password",
            "password",
            password,
            (e) => setPassword(e.target.value)
          )}
          {renderField(
            "Confirm Password",
            "Confirm your password",
            "password",
            confirmPassword,
            (e) => setConfirmPassword(e.target.value)
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full p-3 rounded text-white font-medium transition-colors ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <a href="/auth/login" className="hover:text-blue-600">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
