import { OperationsContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminOperationsPage() {
  await requireAdminPage();
  const { operations, media } = await getAdminContentData();
  return <OperationsContentEditor content={operations} media={media} />;
}
