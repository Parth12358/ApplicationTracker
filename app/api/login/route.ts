import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { compare } from "bcrypt";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const result = await client.execute({
    sql: "SELECT password FROM users WHERE username = ?",
    args: [username],
  });

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const hashedPassword = result.rows[0].password as string;
  const valid = await compare(password, hashedPassword);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set session cookie
  const response = NextResponse.json({ success: true, username });
  response.cookies.set("session", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
