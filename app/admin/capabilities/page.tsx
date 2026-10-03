import { CapabilitiesManager } from "@/components/admin/catalogue-management";
import { getAdminCapabilities } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminCapabilitiesPage() {
  await requireAdminPage();
  return <CapabilitiesManager capabilities={await getAdminCapabilities()} />;
}
