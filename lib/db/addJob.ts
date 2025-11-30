import { db } from "./index";
import { jobs } from "./schema";

interface AddJobData {
  username: string;
  company: string;
  jobTitle: string;
  jobDescription?: string;
  location?: string;
  applicationUrl?: string;
  notes?: string;
}

export async function addJob(data: AddJobData) {
  const result = await db.insert(jobs).values({
    username: data.username,
    company: data.company,
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription || null,
    location: data.location || null,
    applicationUrl: data.applicationUrl || null,
    notes: data.notes || null,
    status: "applied",
  }).returning();

  return result[0];
}