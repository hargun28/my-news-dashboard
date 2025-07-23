"use client";

import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn 
} from "@clerk/nextjs";
import HomeSreen from "../mainPage/Dashboard/HomeScreen"; // or HomeScreen

export default function RootPage() {
  return (
    <>
      {/* If user is signed in, show the dashboard */}
      <SignedIn>
        <HomeSreen />
      </SignedIn>

      {/* If user is signed out, send them to Clerk’s sign in */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
