"use client";

import { useState } from "react";

interface StatusDropdownProps {
  jobId: string;
  currentStatus: string;
}

export default function StatusDropdown({ jobId, currentStatus }: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors = {
    applied: "bg-blue-100 text-blue-800",
    interviewing: "bg-yellow-100 text-yellow-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.applied;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer disabled:opacity-50 ${statusColor}`}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="applied">Applied</option>
      <option value="interviewing">Interviewing</option>
      <option value="offer">Offer</option>
      <option value="rejected">Rejected</option>
    </select>
  );
}