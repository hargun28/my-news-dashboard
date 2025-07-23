"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import HomePage from "./(dashboard)/page";
import DashboardShell from "@/components/layout/DashboardShell";

export default function RootPage() {
  return (
    <>
      <SignedIn>
        <DashboardShell>
            <HomePage />
        </DashboardShell>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
