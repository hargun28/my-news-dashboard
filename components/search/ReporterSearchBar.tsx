// components/search/ReporterSearchBar.tsx
"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import ReporterCard from "../../app/dashboard/reporters/ReporterCard";

export default function ReporterSearchBar() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debounced) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/reporters/search?query=${encodeURIComponent(debounced)}`)
      .then(r => r.json())
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debounced]);

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search reporters to follow..."
        className="w-full rounded border px-3 py-2 text-sm"
      />
      {loading && <p className="text-sm text-gray-500">Searching…</p>}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {results.map(rep => <ReporterCard key={rep.id} reporter={rep} />)}
      </div>
    </div>
  );
}
