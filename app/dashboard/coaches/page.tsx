"use client";

import { useEffect, useState } from "react";
import { db } from "@/fireabse";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

interface Coach {
  id: string;
  name: string;
  email: string;
  status: string;
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "coaches"));
      const data: Coach[] = snapshot.docs.map((doc) => {
        const d = doc.data() as Coach;
        return {
          id: doc.id,
          name: d.name,
          email: d.email,
          status: d.status.replace(/"/g, ""),
        };
      });
      setCoaches(data);
    };
    fetchData();
  }, []);

  const updateStatus = async (coach: Coach, newStatus: string) => {
    const confirmed = confirm(
      `Are you sure you want to ${
        newStatus === "approved" ? "approve" : "cancel"
      } ${coach.name}?`
    );
    if (!confirmed) return;

    const coachRef = doc(db, "coaches", coach.id);
    await updateDoc(coachRef, { status: newStatus });

    setCoaches((prev) =>
      prev.map((c) => (c.id === coach.id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold mb-4">Coaches</h1>
      <table className="border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 w-40 text-center">
              Name
            </th>
            <th className="border border-gray-300 px-4 py-2 w-40 text-center">
              Email
            </th>
            <th className="border border-gray-300 px-4 py-2 w-40 text-center">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 w-40 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach) => (
            <tr key={coach.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">
                {coach.name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {coach.email}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {coach.status}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {coach.status === "pending" && (
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    onClick={() => updateStatus(coach, "approved")}
                  >
                    Approve
                  </button>
                )}
                {coach.status === "approved" && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => updateStatus(coach, "pending")}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
