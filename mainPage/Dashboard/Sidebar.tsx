// "use client";
// import { Avatar } from "@/components/base/avatar/avatar"
// import { Button } from "@/components/base/buttons/button"
// import Link from "next/link"

// export default function Sidebar() {
//   return (
//     <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col gap-6">
//       <div className="flex items-center gap-3">
//         <Avatar initials="JD" size="lg" />
//         <div>
//             <p className="font-semibold">John Doe</p>
//             <p className="text-sm text-muted-foreground">Journalist</p>
//         </div>
//         </div>

//       <nav className="flex flex-col gap-2">
//         <Link href="/bookmarks"><Button>Bookmarks</Button></Link>
//         <Link href="/profile"><Button>My Profile</Button></Link>
//         <Link href="/settings"><Button>Settings</Button></Link>
//       </nav>
//     </aside>
//   )
// }
// components/dashboard/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Key } from "react-aria-components";
import { Tabs } from "@/components/application/tabs/tabs";
import { NativeSelect } from "@/components/base/select/select-native";
import { Avatar } from "@/components/base/avatar/avatar";

type TabItem = { id: string; label: string; href: string; badge?: number };

const tabs: TabItem[] = [
  { id: "bookmarks",     label: "Bookmarks",     href: "/bookmarks" },
  { id: "profile",       label: "My profile",    href: "/profile" },
  { id: "settings",      label: "Settings",      href: "/settings" },
  // add more if you want:
  // { id: "notifications", label: "Notifications", href: "/notifications", badge: 2 },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // derive current tab from URL
  const current = tabs.find(t => pathname.startsWith(t.href))?.id ?? tabs[0].id;
  const [selectedTab, setSelectedTab] = useState<Key>(current);

  // keep state in sync when url changes (e.g. via back/forward)
  useEffect(() => {
    if (current !== selectedTab) setSelectedTab(current);
  }, [current, selectedTab]);

  const handleChange = (key: Key) => {
    setSelectedTab(key);
    const next = tabs.find(t => t.id === key);
    if (next) router.push(next.href);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col gap-6 text-grey-400">
      {/* User header */}
      <div className="flex items-center gap-3">
        <Avatar initials="JD" size="lg" />
        <div className="truncate">
          <p className="font-semibold leading-none text-gray-400">John Doe</p>
          <p className="text-sm text-gray-400">Reporter</p>
        </div>
      </div>

      {/* Mobile: native select */}
      <NativeSelect
        value={selectedTab as string}
        onChange={(e) => handleChange(e.target.value)}
        options={tabs.map(t => ({ label: t.label, value: t.id }))}
        className="w-full md:hidden"
      />

      {/* Desktop: vertical tabs */}
      <Tabs
        orientation="vertical"
        selectedKey={selectedTab}
        onSelectionChange={handleChange}
        className="max-md:hidden text-gray-400"
      >
        <Tabs.List type="button-brand" items={tabs}>
          {(tab) => <Tabs.Item {...tab} />}
        </Tabs.List>
      </Tabs>
    </aside>
  );
}
