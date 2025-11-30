import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';
import { getJobs } from '@/lib/db/getJobs';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const username = sessionCookie.value;
  const jobs = await getJobs(username);

  // Calculate statistics
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'applied').length,
    interviewing: jobs.filter((j) => j.status === 'interviewing').length,
    offers: jobs.filter((j) => j.status === 'offer').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
  };

  const existingJobs = jobs.map((job) => ({
    company: job.company,
    jobTitle: job.jobTitle,
  }));

  return <DashboardClient username={username} stats={stats} allJobs={jobs} existingJobs={existingJobs} />;
}