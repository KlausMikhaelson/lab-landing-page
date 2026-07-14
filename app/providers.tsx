"use client";

// PostHog (product analytics + session replay), wired the officially supported
// way for the App Router: init inside a client component's effect, after
// hydration, so the capture pipeline bootstraps reliably. The newer
// instrumentation-client + remote-config flow stalled bootstrap on this setup.
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: HOST,
      // Anonymous marketing traffic: only mint a person profile once someone
      // is identified (e.g. joins the waitlist). Keeps event volume/cost down.
      person_profiles: "identified_only",
      // Capture the initial pageview + client-side navigations.
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Session replay records automatically once "Record user sessions" is
      // enabled in the PostHog project settings (Settings -> Session replay).
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
