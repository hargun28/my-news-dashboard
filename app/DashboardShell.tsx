// components/layout/DashboardShell.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "../mainPage/Header";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#001f3f] text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 text-white">{children}</main>
      </div>
    </div>
  );
}
