"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "../hooks/use-debounce";

interface TableSearchProps {
  placeholder?: string;
}

export default function TableSearch({ placeholder = "Search..." }: TableSearchProps) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("search") || "";
  const [value, setValue] = useState(initial);
  const debounced = useDebounce(value, 500);

  useEffect(() => {
    const qp = new URLSearchParams(Array.from(params.entries()));
    if (debounced) qp.set("search", debounced);
    else qp.delete("search");
    qp.set("page", "1");
    router.push(`?${qp.toString()}`);
  }, [debounced]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-3 py-2 text-sm w-full md:w-64"
    />
  );
}
