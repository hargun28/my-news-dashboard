'use client';
import { Avatar } from "@/components/base/avatar/avatar"
import { Button } from "@/components/base/buttons/button"
import Link from "next/link"
import { useUserRole } from "../../hooks/use-user-role";


export default function Sidebar() {
  const role = useUserRole();
  return (
    <aside className="w-64 h-screen bg-slate-800 text-slate-100 border-r border-slate-700 p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Avatar initials="U" size="lg" />
        <div>
            <p className="font-semibold">Profile</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/bookmarks"><Button>Bookmarks</Button></Link>
        <Link href="/profile"><Button>My Profile</Button></Link>
         {role === "REPORTER" && (
          <Link href="/upload"><Button>Upload Article</Button></Link>
        )}
      </nav>
    </aside>
  )
}