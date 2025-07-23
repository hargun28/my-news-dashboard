// components/reporters/follow-button.tsx
"use client";
import { useFollow } from "@/hooks/use-follow";

export function FollowButton({ reporterId, initial }: { reporterId: string; initial: boolean }) {
  const { following, toggle } = useFollow(initial, reporterId);
  return (
    <button onClick={toggle} className="mt-2 rounded border px-2 py-1 text-xs">
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
