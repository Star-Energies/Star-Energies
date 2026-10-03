import { AboutContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminAboutContentPage() {
  await requireAdminPage();
  const { about } = await getAdminContentData();
  return <AboutContentEditor content={about} />;
}
