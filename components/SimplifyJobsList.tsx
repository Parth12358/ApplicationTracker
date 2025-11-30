'use client';

import { useEffect, useState } from 'react';

interface SimplifyJob {
  company: string;
  jobTitle: string;
  location: string;
  applicationUrl: string;
  datePosted: string;
  isFAANG: boolean;
}

interface SimplifyJobsListProps {
  existingJobs: Array<{ company: string; jobTitle: string }>;
}

type FilterTab = 'new' | 'all';
type SortOption = 'date' | 'company' | 'title';

export default function SimplifyJobsList({ existingJobs }: SimplifyJobsListProps) {
  const [jobs, setJobs] = useState<SimplifyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('new');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [addingJobId, setAddingJobId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/simplify-jobs');
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Failed to fetch SimplifyJobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const isJobInTracker = (job: SimplifyJob) => {
    return existingJobs.some(
      (existing) =>
        existing.company.toLowerCase() === job.company.toLowerCase() &&
        existing.jobTitle.toLowerCase() === job.jobTitle.toLowerCase()
    );
  };

  const handleAddToTracker = async (job: SimplifyJob) => {
    const jobId = `${job.company}-${job.jobTitle}`;
    setAddingJobId(jobId);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: job.company,
          jobTitle: job.jobTitle,
          location: job.location,
          applicationUrl: job.applicationUrl,
          notes: `Added from SimplifyJobs on ${new Date().toLocaleDateString()}`,
        }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to add job:', error);
    } finally {
      setAddingJobId(null);
    }
  };

  const parseDateToDays = (datePosted: string): number => {
    const match = datePosted.match(/^(\d+)(d|mo)$/);
    if (!match) return 999;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    if (unit === 'd') return value;
    if (unit === 'mo') return value * 30;
    
    return 999;
  };

  const filteredAndSortedJobs = () => {
    let filtered = jobs;

    if (activeFilter === 'new') {
      filtered = jobs.filter((job) => !isJobInTracker(job));
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const daysA = parseDateToDays(a.datePosted);
        const daysB = parseDateToDays(b.datePosted);
        return daysA - daysB;
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      if (sortBy === 'title') {
        return a.jobTitle.localeCompare(b.jobTitle);
      }
      return 0;
    });

    return sorted;
  };

  const displayedJobs = filteredAndSortedJobs();
  const newJobsCount = jobs.filter((job) => !isJobInTracker(job)).length;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading SimplifyJobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/20">
        <button
          onClick={() => setActiveFilter('new')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeFilter === 'new'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          New Jobs ({newJobsCount})
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeFilter === 'all'
              ? 'border-b-2 border-white text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          All Jobs ({jobs.length})
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-sm text-white"
        >
          <option value="date">Sort by: Date (Newest)</option>
          <option value="company">Sort by: Company (A-Z)</option>
          <option value="title">Sort by: Job Title (A-Z)</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {displayedJobs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            {activeFilter === 'new'
              ? 'No new jobs available. All SimplifyJobs are already in your tracker!'
              : 'No jobs found.'}
          </p>
        ) : (
          displayedJobs.map((job, index) => {
            const jobId = `${job.company}-${job.jobTitle}`;
            const isAdded = isJobInTracker(job);
            const isAdding = addingJobId === jobId;

            return (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {job.isFAANG && <span>🔥</span>}
                      {job.company}
                    </h3>
                    <p className="text-gray-300 mt-1">{job.jobTitle}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>Posted {job.datePosted} ago</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {job.applicationUrl && (<a
                      
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white text-sm font-medium"
                      >
                        Apply →
                      </a>
                    )}
                    {isAdded ? (
                      <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-md">
                        Added ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToTracker(job)}
                        disabled={isAdding}
                        className="px-3 py-1 bg-white/10 text-white text-sm rounded-md hover:bg-white/20 disabled:bg-white/5 border border-white/20"
                      >
                        {isAdding ? 'Adding...' : '+ Add to Tracker'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}