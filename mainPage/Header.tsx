// components/layout/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/lib/data";
import { userInfo } from "os";


export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold">NewsDash</Link>
        <nav className="flex space-x-6 text-sm">
          {NAV_LINKS.map(t => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={active ? "border-b-2 border-gray-900 pb-1 font-medium" : "text-gray-500"}
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
