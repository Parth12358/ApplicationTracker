import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { addJob } from "@/lib/db/addJob";

export async function POST(request: NextRequest) {
  try {
    // Get username from session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const username = session.value;

    // Parse request body
    const body = await request.json();
    const { company, jobTitle, jobDescription, location, applicationUrl, notes } = body;

    // Validate required fields
    if (!company || !jobTitle) {
      return NextResponse.json(
        { error: "Company and job title are required" },
        { status: 400 }
      );
    }

    // Add job to database
    const newJob = await addJob({
      username,
      company,
      jobTitle,
      jobDescription,
      location,
      applicationUrl,
      notes,
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error adding job:", error);
    return NextResponse.json(
      { error: "Failed to add job" },
      { status: 500 }
    );
  }
}