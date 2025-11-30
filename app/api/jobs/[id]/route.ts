import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH - Update job (full update or status only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Check if it's just a status update
    if (body.status && Object.keys(body).length === 1) {
      if (!["applied", "interviewing", "offer", "rejected"].includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      await db
        .update(jobs)
        .set({ status: body.status, updatedAt: new Date() })
        .where(and(eq(jobs.id, id), eq(jobs.username, session.value)));

      return NextResponse.json({ success: true });
    }

    // Full update
    const { company, jobTitle, jobDescription, location, applicationUrl, notes, status } = body;

    await db
      .update(jobs)
      .set({
        company,
        jobTitle,
        jobDescription,
        location,
        applicationUrl,
        notes,
        status,
        updatedAt: new Date(),
      })
      .where(and(eq(jobs.id, id), eq(jobs.username, session.value)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// DELETE - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.username, session.value)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}