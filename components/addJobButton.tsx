"use client";

import { useState } from "react";
import AddJobModal from "./addJobModal";

export default function AddJobButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/20 text-white text-sm font-bold rounded-lg hover:bg-white/20 transition-colors uppercase tracking-wider"
      >
        + Add Job
      </button>
      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}