// components/reporters/ReporterStats.tsx
import { Avatar } from "@/components/base/avatar/avatar";

export default function ReporterStats({ reporter }: { reporter: any }) {
  return (
        <section className="rounded border bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar initials={reporter.name?.[0] ?? "R"} size="lg" />
        <div>
          <h2 className="text-lg font-semibold">{reporter.name}</h2>
          <p className="text-sm text-gray-500">
            {reporter.organization?.name || "Independent"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Followers</p>
          <p className="font-medium">{reporter._count?.followers ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Articles</p>
          <p className="font-medium">{reporter._count?.articles ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
