import { HomeContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminHomeContentPage() {
  await requireAdminPage();
  const { home, media } = await getAdminContentData();
  return <HomeContentEditor content={home} media={media} />;
}
