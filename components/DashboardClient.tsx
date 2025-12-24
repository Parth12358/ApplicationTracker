
'use client';

import { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import AddJobButton from './addJobButton';
import SimplifyJobsList from './SimplifyJobsList';
import StatusDropdown from './StatusDropdown';
import Link from 'next/link';

interface Job {
  id: string;
  company: string;
  jobTitle: string;
  location: string | null;
  status: string;
  createdAt: Date;
}

interface Stats {
  total: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
}

interface DashboardClientProps {
  username: string;
  stats: Stats;
  allJobs: Job[];
}

export default function DashboardClient({ username, stats, allJobs }: DashboardClientProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Animated cursor-following gradient */}
      <div
        className="pointer-events-none fixed inset-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`,
        }}
      />

      {/* Main Content */}
      <div className="relative h-full overflow-hidden p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Tracker</h1>
            <p className="text-gray-400 mt-1">Welcome back, {username}</p>
          </div>
          <div className="flex items-center gap-3">
            <AddJobButton />
            <LogoutButton />
          </div>
        </div>

        {/* Grid Layout - No Scroll */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Column - Stats & ALL Jobs */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 overflow-hidden">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Applications */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider">Total Applications</div>
                <div className="text-4xl font-black text-white">{stats.total}</div>
              </div>

              {/* Applied */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider">Applied</div>
                <div className="text-4xl font-black text-white">{stats.applied}</div>
              </div>

              {/* Interviewing */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider">Interviewing</div>
                <div className="text-4xl font-black text-white">{stats.interviewing}</div>
              </div>

              {/* Offers */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider">Offers</div>
                <div className="text-4xl font-black text-white">{stats.offers}</div>
              </div>
            </div>

            {/* ALL Applications - Scrollable */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">My Applications</h2>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {allJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 font-bold">No applications yet</p>
                    <p className="text-gray-400 text-sm mt-2">Add your first job to get started!</p>
                  </div>
                ) : (
                  allJobs.map((job) => (
                    <div
                      key={job.id}
                      className="backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/jobs/${job.id}`} className="flex-1 min-w-0">
                          <h3 className="font-black text-white truncate hover:text-gray-300 transition-colors">
                            {job.company}
                          </h3>
                          <p className="text-gray-300 text-sm truncate">{job.jobTitle}</p>
                          {job.location && (
                            <p className="text-gray-400 text-xs mt-1 truncate">📍 {job.location}</p>
                          )}
                        </Link>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <StatusDropdown jobId={job.id} currentStatus={job.status} />
                          <span className="text-gray-400 text-xs font-bold">{formatDate(job.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - SimplifyJobs Feed */}
          <div className="col-span-12 lg:col-span-7 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/20 flex-shrink-0">
              <h2 className="text-xl font-black text-white uppercase tracking-wider">New Job Opportunities</h2>
              <p className="text-gray-300 text-sm mt-1 font-bold">Fresh listings from SimplifyJobs</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <SimplifyJobsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}