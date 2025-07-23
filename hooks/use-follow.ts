// hooks/use-follow.ts
"use client";
import { useState } from "react";

export function useFollow(initial: boolean, reporterId: string) {
  const [following, setFollowing] = useState(initial);
  const toggle = async () => {
    const method = following ? "DELETE" : "POST";
    await fetch("/api/follow", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporterId }),
    });
    setFollowing(!following);
  };
  return { following, toggle };
}
