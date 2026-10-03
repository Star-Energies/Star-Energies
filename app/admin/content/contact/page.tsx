import { ContactContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminContactContentPage() {
  await requireAdminPage();
  const { contact } = await getAdminContentData();
  return <ContactContentEditor content={contact} />;
}
