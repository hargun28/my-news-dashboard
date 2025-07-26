import NewsCategory from "../../mainPage/Dashboard/NewsCategory";
import UploadNewsForm from "../../mainPage/Dashboard/UploadNewsForm";
import { getUserRole } from "@/lib/get-user-role";

export default async function HomePage() {
  const role = await getUserRole();
  return (
    <div className="space-y-6">
      {role === "REPORTER" && <UploadNewsForm />}
      <NewsCategory />
    </div>
  );
 }
