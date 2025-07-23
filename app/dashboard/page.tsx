// app/(dashboard)/page.tsx
import NewsCategory from "../../mainPage/Dashboard/NewsCategory";
import UploadNewsForm from "../../mainPage/Dashboard/UploadNewsForm";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Only show if user is reporter/admin */}
      <UploadNewsForm />
      <NewsCategory />
    </div>
  );
}
