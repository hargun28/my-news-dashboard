// app/dashboard/page.tsx
"use client";

import Sidebar from "./Sidebar";
import NewsCategory from "./NewsCategory";
import UploadNewsForm from "./UploadNewsForm";
import UserStats from "./UserStats";

export default function HomeScreen() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main canvas */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <UploadNewsForm />
        <NewsCategory />
      </main>

      {/* Right stats panel */}
      <aside className="w-80 p-4 border-l bg-white">
        <UserStats />
      </aside>
    </div>
  );
}
