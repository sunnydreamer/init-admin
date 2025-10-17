"use client";

import { useEffect, useState } from "react";
import { db } from "../fireabse";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

interface Coach {
  id: string;
  name: string;
  status: string;
}

export default function Home() {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "coaches"));
      const data: Coach[] = snapshot.docs.map((doc) => {
        const d = doc.data() as Coach;
        console.log(d);
        return {
          id: doc.id,
          name: d.name,
          status: d.status.replace(/"/g, ""), // remove extra quotes
        };
      });
      setCoaches(data);
    };
    fetchData();
  }, []);

  // Update coach status
  const updateStatus = async (coach: Coach, newStatus: string) => {
    const confirmed = confirm(
      `Are you sure you want to ${
        newStatus === "approved" ? "approve" : "cancel"
      } ${coach.name}?`
    );
    if (!confirmed) return;

    // Update Firestore
    const coachRef = doc(db, "coaches", coach.id);
    await updateDoc(coachRef, { status: newStatus });

    // Update local state
    setCoaches((prev) =>
      prev.map((c) =>
        c.id === coach.id
          ? {
              ...c,
              status: newStatus,
            }
          : c
      )
    );
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    width: "150px", // fixed width
    textAlign: "center" as const,
  };

  const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336", // red for cancel
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Coaches</h1>
      <table style={{ borderCollapse: "collapse", width: "auto" }}>
        <thead>
          <tr>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach) => (
            <tr key={coach.id}>
              <td style={cellStyle}>{coach.name}</td>
              <td style={cellStyle}>{coach.status}</td>
              <td style={cellStyle}>
                {coach.status === "pending" && (
                  <button
                    style={buttonStyle}
                    onClick={() => updateStatus(coach, "approved")}
                  >
                    Approve
                  </button>
                )}
                {coach.status === "approved" && (
                  <button
                    style={cancelButtonStyle}
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
