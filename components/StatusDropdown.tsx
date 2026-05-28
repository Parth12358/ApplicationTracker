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
    applied: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    interviewing: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    offer: "bg-green-500/20 text-green-300 border border-green-500/30",
    rejected: "bg-red-500/20 text-red-300 border border-red-500/30",
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
      className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer disabled:opacity-50 appearance-none ${statusColor}`}
      style={{ colorScheme: 'dark' }}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="applied" className="bg-gray-900 text-white">Applied</option>
      <option value="interviewing" className="bg-gray-900 text-white">Interviewing</option>
      <option value="offer" className="bg-gray-900 text-white">Offer</option>
      <option value="rejected" className="bg-gray-900 text-white">Rejected</option>
    </select>
  );
}