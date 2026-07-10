import { NextResponse } from "next/server";
import { ensureSchema, getPool } from "@/lib/db";

// pg needs the Node.js runtime (not edge); never cache this route
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = (body as { email?: unknown })?.email;
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await ensureSchema();
    // ON CONFLICT keeps it idempotent: re-submitting a known email is a no-op
    // and we don't leak whether the address was already on the list.
    await getPool().query(
      `INSERT INTO waitlist (email, source) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email, "landing"]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] insert failed:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }
}
