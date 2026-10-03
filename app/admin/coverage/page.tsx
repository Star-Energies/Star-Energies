import { CoverageManager } from "@/components/admin/admin-management";
import { getAdminCoverageRegions } from "@/lib/content";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminCoveragePage() {
  await requireAdminPage();
  return <CoverageManager regions={await getAdminCoverageRegions()} />;
}
