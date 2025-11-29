import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const username = session.value;
  console.log("Logged in as:", username);
  // Fetch all jobs for this user, ordered by newest first (latest applied)
  const userJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.username, username))
    .orderBy(desc(jobs.createdAt))

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-gray-600 mt-1">Welcome, {username}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Applied Jobs</h2>
          
          {userJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs yet.</p>
              <p className="text-gray-400 mt-2">Start by importing jobs from SimplifyJobs or add manually.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.isFAANG && '🔥 '}
                          {job.company}
                        </h3>
                        {job.isClosed && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-1">{job.jobTitle}</p>
                      {job.location && (
                        <p className="text-gray-500 text-sm mt-1">📍 {job.location}</p>
                      )}
                      {job.compensation && (
                        <p className="text-green-600 text-sm mt-1">💰 {job.compensation}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === 'applied'
                            ? 'bg-blue-100 text-blue-800'
                            : job.status === 'interviewing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : job.status === 'offer'
                            ? 'bg-green-100 text-green-800'
                            : job.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {job.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{job.notes}</p>
                    </div>
                  )}

                  {job.applicationUrl && (
                    <div className="mt-3">
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Application →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
