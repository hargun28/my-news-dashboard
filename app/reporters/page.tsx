import ReporterCard from "./ReporterCard";
import ReporterSearchBar from "@/components/search/ReporterSearchBar";
import { listReporters } from "@/lib/reporters";
import { auth } from "@clerk/nextjs/server";

interface Props {
  searchParams: { page?: string };
}

export default async function ReportersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const take = 10;
  const { userId } = await auth();
  const reporters = await listReporters((page - 1) * take, take, userId || undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reporters</h1>
      <ReporterSearchBar />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {reporters.map((rep) => (
          <ReporterCard key={rep.id} reporter={rep} />
        ))}
      </div>
      <div className="flex gap-4">
        {page > 1 && (
          <a href={`?page=${page - 1}`} className="underline text-sm">
            Previous
          </a>
        )}
        {reporters.length === take && (
          <a href={`?page=${page + 1}`} className="underline text-sm">
            Next
          </a>
        )}
      </div>
    </div>
  );
}