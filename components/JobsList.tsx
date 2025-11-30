import { getJobs } from "@/lib/db/getJobs";
import { Job } from "@/lib/db/schema";
import Link from "next/link";
import StatusDropdown from "./StatusDropdown";

interface JobsListProps {
  username: string;
}

export default async function JobsList({ username }: JobsListProps) {
  const jobs = await getJobs(username);

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h3>
        <p className="text-gray-500 text-sm">Get started by adding your first job application</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Clickable Job Info */}
        <Link href={`/jobs/${job.id}`} className="flex items-center gap-4 flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate hover:text-blue-600">
            {job.company}
          </h3>
          <span className="text-gray-600 truncate">{job.jobTitle}</span>
          {job.location && <span className="text-sm text-gray-500 truncate">📍 {job.location}</span>}
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </Link>

        {/* Status Dropdown */}
        <StatusDropdown jobId={job.id} currentStatus={job.status} />
      </div>
    </div>
  );
}