// // components/reporters/ReporterCard.tsx
// import Link from "next/link";
// import { FollowButton } from "../dashboard/reporters/follow-button";

// export default function ReporterCard({ reporter }: { reporter: any }) {
//   return (
//     <div className="rounded border bg-white p-4">
//       <Link href={`/reporters/${reporter.id}`} className="font-medium hover:underline">
//         {reporter.username}
//       </Link>
//       <p className="text-xs text-gray-500">{reporter.organization?.name ?? "Independent"}</p>
//       <FollowButton reporterId={reporter.id} initial={reporter.isFollowed} />
//     </div>
//   );
// }