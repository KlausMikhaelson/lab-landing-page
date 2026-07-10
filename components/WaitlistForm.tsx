"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-base font-medium text-emerald-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
        <span aria-hidden className="inline-block h-2 w-2 bg-emerald-300" />
        You&apos;re on the list — we&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@company.com"
          aria-label="Email address"
          className="h-12 w-full rounded-full border border-white/25 bg-white/10 px-5 text-sm text-white placeholder-white/50 backdrop-blur-sm outline-none transition-colors focus:border-emerald-300/70 focus:bg-white/15 sm:w-72"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#141728] transition-transform hover:scale-[1.02] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Joining…" : "Request early access"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-rose-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
          {error}
        </p>
      )}
    </form>
  );
}
