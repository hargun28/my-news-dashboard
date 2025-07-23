// components/reporters/ReporterStats.tsx
export default function ReporterStats({ reporter }: { reporter: any }) {
  return (
    <section className="rounded border bg-white p-6">
      <h2 className="text-lg font-semibold">{reporter.name}</h2>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
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
