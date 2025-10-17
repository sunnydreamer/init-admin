"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/fireabse";

export default function SettingsPage() {
  const { user, logout } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);

  // Update state if user changes asynchronously
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        firstName,
        lastName,
        email,
        lastLoginAt: new Date(),
      });

      alert("Settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out.");
    }
  };

  const isChanged =
    firstName !== (user?.firstName || "") ||
    lastName !== (user?.lastName || "") ||
    email !== (user?.email || "");

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* First Name */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">First Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Last Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Save button */}
      <div>
        <button
          onClick={handleSave}
          disabled={!isChanged || saving}
          className={`px-4 py-2 rounded ${
            isChanged
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Logout button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:underline text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
