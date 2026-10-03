import { SettingsEditor } from "@/components/admin/admin-management";
import { getAdminSiteSettings } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  return <SettingsEditor initial={await getAdminSiteSettings()} />;
}
