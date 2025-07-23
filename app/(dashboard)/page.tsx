// app/(dashboard)/page.tsx
import NewsCategory from "@/components/dashboard/NewsCategoryNav";
import UploadNewsForm from "@/components/dashboard/UploadNewsForm";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Only show if user is reporter/admin */}
      <UploadNewsForm />
      <NewsCategory />
    </div>
  );
}
