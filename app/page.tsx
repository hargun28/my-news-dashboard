import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import HomePage from "./dashboard/page"; // or wherever you placed it
import DashboardShell from "./DashboardShell";

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
