"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ITEM_PER_PAGE } from "@/lib/settings";

interface PaginationProps {
  page: number;
  count: number;
}

export default function Pagination({ page, count }: PaginationProps) {
  const params = useSearchParams();
  const total = Math.ceil(count / ITEM_PER_PAGE);
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className="flex space-x-1">
      {pages.map((p) => {
        const qp = new URLSearchParams(Array.from(params.entries()));
        if (p > 1) qp.set("page", p.toString());
        else qp.delete("page");
        return (
          <Link
            key={p}
            href={`?${qp.toString()}`}
            className={
              `px-3 py-1 rounded text-sm ` +
              (p === page
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-700 border")
            }
          >
            {p}
          </Link>
        );
      })}
    </nav>
  );
}
