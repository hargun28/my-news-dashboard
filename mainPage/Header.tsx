// components/layout/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/lib/data";
import { userInfo } from "os";


export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-700 bg-slate-800/70 backdrop-blur-sm text-slate-100">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">NewsDash</Link>
        <nav className="flex space-x-6 text-sm">
          {NAV_LINKS.map(t => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={active ? "border-b-2 border-indigo-400 pb-1 font-medium" : "text-slate-400"}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
