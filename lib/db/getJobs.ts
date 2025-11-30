import { db } from "./index";
import { jobs } from "./schema";
import { eq, desc } from "drizzle-orm";

export async function getJobs(username: string) {
  const userJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.username, username))
    .orderBy(desc(jobs.createdAt));

  return userJobs;
}