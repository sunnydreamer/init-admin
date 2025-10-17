"use client";

import { useState } from "react";
import { useUser } from "@/context/userContext";

export default function SettingsPage() {
  const { logout } = useUser();

  const [name, setName] = useState("Admin Name");
  const [email, setEmail] = useState("admin@example.com");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 1000)); // simulate API
    setSaving(false);
    alert("Settings saved!");
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
    name !== "Admin Name" ||
    email !== "admin@example.com" ||
    theme !== "light" ||
    notifications !== true;

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Name */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {/* Theme */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Theme</label>
        <select
          className="w-full border p-2 rounded"
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="notifications"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <label htmlFor="notifications" className="font-medium">
          Enable notifications
        </label>
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
