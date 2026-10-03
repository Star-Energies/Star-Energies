import { MediaLibrary } from "@/components/admin/admin-management";
import { getAdminMediaAssets } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminMediaPage() {
  await requireAdminPage();
  return <MediaLibrary media={await getAdminMediaAssets()} />;
}
