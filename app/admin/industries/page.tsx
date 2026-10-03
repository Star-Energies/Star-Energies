import { IndustriesManager } from "@/components/admin/catalogue-management";
import { getAdminIndustries } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminIndustriesPage() {
  await requireAdminPage();
  return <IndustriesManager industries={await getAdminIndustries()} />;
}
