// components/search/ReporterSearchBar.tsx
"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";

interface ReporterSearchResult {
  id: string;
  username?: string;
  email?: string;
  organization?: { name: string };
}

export default function ReporterSearchBar() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState<ReporterSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/reporters/search?query=${encodeURIComponent(debounced)}`)
      .then((res) => res.json())
      .then((data: ReporterSearchResult[]) => setResults(data))
      .finally(() => setLoading(false));
  }, [debounced]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search reporters by name or organization..."
        className="w-full rounded border px-3 py-2 text-sm"
      />
      {loading && <p className="text-sm text-gray-500">Searching…</p>}
      <ul className="divide-y">
        {results.map((rep) => (
          <li key={rep.id} className="py-2">
            <Link
              href={`/reporters/${rep.id}`}
              className="flex justify-between items-center hover:bg-slate-700 p-2 rounded text-slate-100"
            >
              <span className="font-medium">{rep.username ?? rep.email}</span>
              <span className="text-xs text-gray-500">
                {rep.organization?.name ?? "Independent"}
              </span>
            </Link>
          </li>
        ))}
        {!loading && debounced && results.length === 0 && (
          <li className="text-sm text-gray-500">No reporters found.</li>
        )}
      </ul>
    </div>
  );
}
