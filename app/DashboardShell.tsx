// components/layout/DashboardShell.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import { Header } from "../mainPage/Header";
import UploadNewsForm from "@/mainPage/Dashboard/UploadNewsForm";
import NewsCategory from "@/mainPage/Dashboard/NewsCategory";
import { getUserRole } from "@/lib/get-user-role";
import { routeModule } from "next/dist/build/templates/app-page";

export default async function DashboardShell({ children }: { children: React.ReactNode }) {
    const role = await getUserRole(); // Assuming this is a synchronous function, otherwise use async/await
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
