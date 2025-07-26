// app/(dashboard)/layout.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "../../mainPage/Header";
import "../globals.css"; // keep global styles

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-blue-100 text-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 text-slate-100 bg-blue-100">{children}</main>
      </div>
    </div>
  );
}
