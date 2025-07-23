import { Avatar } from "@/components/base/avatar/avatar"
import { Button } from "@/components/base/buttons/button"
import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r p-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Avatar initials="JD" size="lg" />
        <div>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-muted-foreground">Journalist</p>
        </div>
        </div>

      <nav className="flex flex-col gap-2">
        <Link href="/bookmarks"><Button>Bookmarks</Button></Link>
        <Link href="/profile"><Button>My Profile</Button></Link>
        <Link href="/settings"><Button>Settings</Button></Link>
      </nav>
    </aside>
  )
}