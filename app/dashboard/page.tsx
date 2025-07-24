// app/(dashboard)/page.tsx
import NewsCategory from "@/components/dashboard/NewsCategory";
import UploadNewsForm from "@/components/dashboard/UploadNewsForm";
import { useUserRole } from "../../lib/get-user-role";

export default async function HomePage() {
  const role = await useUserRole();  
  return (
    <div className="space-y-6">
      {/* Only show if user is reporter/admin */}
      <UploadNewsForm />
      {role === "REPORTER" && <UploadNewsForm />}
      <NewsCategory />
    </div>
  );
}
